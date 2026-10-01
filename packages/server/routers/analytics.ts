import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { computeStageFunnel } from "../analytics/stage-funnel";
import {
  groupActivityByDay,
  resolveTimeZone,
} from "../analytics/activity-heatmap";

const dateRangeEnum = z.enum(["today", "week", "month", "overall"]);

function getRangeStart(range: z.infer<typeof dateRangeEnum>): Date | undefined {
  const now = new Date();
  switch (range) {
    case "today": {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case "week": {
      const d = new Date(now);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
      d.setDate(diff);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case "month": {
      return new Date(now.getFullYear(), now.getMonth(), 1);
    }
    case "overall":
      return undefined;
  }
}

export const analyticsRouter = router({
  stageFunnel: protectedProcedure.query(async ({ ctx }) => {
    const applications = await ctx.prisma.application.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        currentStatus: true,
        statusEvents: { select: { status: true }, distinct: ["status"] },
      },
    });

    return computeStageFunnel(applications);
  }),

  statusBreakdown: protectedProcedure
    .input(z.object({ range: dateRangeEnum.default("overall") }).optional())
    .query(async ({ ctx, input }) => {
      const range = input?.range ?? "overall";
      const start = getRangeStart(range);
      const results = await ctx.prisma.application.groupBy({
        by: ["currentStatus"],
        where: {
          userId: ctx.session.user.id,
          ...(start ? { createdAt: { gte: start } } : {}),
        },
        _count: true,
      });
      return results.map((r) => ({ status: r.currentStatus, count: r._count }));
    }),

  heatmapCalendar: protectedProcedure
    .input(
      z
        .object({
          // IANA name from the client, e.g. "Europe/Kyiv", so days match
          // the user's calendar rather than the server's (UTC).
          timeZone: z.string().optional(),
          days: z.number().int().min(1).max(366).default(365),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const timeZone = resolveTimeZone(input?.timeZone);
      const to = new Date();
      const from = new Date(to);
      from.setDate(from.getDate() - (input?.days ?? 365) + 1);

      const events = await ctx.prisma.statusEvent.findMany({
        where: {
          occurredAt: { gte: from },
          application: { userId: ctx.session.user.id },
        },
        select: { occurredAt: true },
      });

      return groupActivityByDay(
        events.map((e) => e.occurredAt),
        timeZone,
        from,
        to,
      );
    }),
});
