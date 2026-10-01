import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

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
  // ...your other analytics procedures stay as-is
});
