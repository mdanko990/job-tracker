import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const companyRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.company.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { name: "asc" },
    }),
  ),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.company.create({
        data: { name: input.name, userId: ctx.session.user.id },
      }),
    ),
});
