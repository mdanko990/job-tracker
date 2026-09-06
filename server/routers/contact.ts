// server/routers/contact.ts
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const contactInput = z.object({
  name: z.string().min(1),
  linkedin: z.string().url().optional().or(z.literal("")),
  isConnected: z.boolean().default(false),
  isMessaged: z.boolean().default(false),
});

export const contactRouter = router({
  listByCompany: protectedProcedure
    .input(z.object({ companyId: z.string().min(1) }))
    .query(({ ctx, input }) =>
      ctx.prisma.contact.findMany({
        where: { companyId: input.companyId },
        orderBy: { name: "asc" },
      }),
    ),

  create: protectedProcedure
    .input(contactInput.extend({ companyId: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.contact.create({
        data: { ...input, linkedin: input.linkedin || undefined },
      }),
    ),

  update: protectedProcedure
    .input(contactInput.extend({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.contact.update({
        where: { id },
        data: { ...data, linkedin: data.linkedin || undefined },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.contact.delete({ where: { id: input.id } }),
    ),
});
