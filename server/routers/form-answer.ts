// server/routers/formAnswer.ts
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const formAnswerInput = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const formAnswerRouter = router({
  listByApplication: protectedProcedure
    .input(z.object({ applicationId: z.string().min(1) }))
    .query(({ ctx, input }) =>
      ctx.prisma.formAnswer.findMany({
        where: { applicationId: input.applicationId },
        orderBy: { question: "asc" },
      }),
    ),

  create: protectedProcedure
    .input(formAnswerInput.extend({ applicationId: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.formAnswer.create({
        data: input,
      }),
    ),

  update: protectedProcedure
    .input(formAnswerInput.extend({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.formAnswer.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.formAnswer.delete({ where: { id: input.id } }),
    ),
});
