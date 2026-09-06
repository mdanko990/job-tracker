import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const statusEnum = z.enum([
  "SAVED",
  "APPLIED",
  "SCREENING",
  "TECHNICAL_INTERVIEW",
  "FINAL_ROUND",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
  "GHOSTED",
]);

const actionTypeEnum = z.enum([
  "CONFIRMATION_RECEIVED",
  "EMAIL_SENT",
  "EMAIL_RECEIVED",
  "PHONE_CALL",
  "VIDEO_CALL",
  "TAKE_HOME_SUBMITTED",
  "FOLLOW_UP_SENT",
  "OFFER_RECEIVED",
  "OTHER",
]);

const createApplicationInput = z.object({
  title: z.string().min(1),
  companyId: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  remotePolicy: z.string().optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  techStack: z.array(z.string()).default([]),
  description: z.string().optional(),
});

const updateApplicationInput = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  companyId: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  remotePolicy: z.string().optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  techStack: z.array(z.string()).default([]),
  description: z.string().optional(),
  formAnswers: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .default([]),
});

export const applicationRouter = router({
  list: protectedProcedure
    .input(z.object({ status: statusEnum.optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.application.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input?.status ? { currentStatus: input.status } : {}),
        },
        include: {
          company: true,
          statusEvents: { orderBy: { occurredAt: "desc" }, take: 1 },
        },
        orderBy: { lastInteractionAt: "desc" },
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const application = await ctx.prisma.application.findUnique({
        where: { id: input.id, userId: ctx.session.user.id },
        include: {
          company: true,
          statusEvents: { orderBy: { occurredAt: "desc" } },
          formAnswers: true,
        },
      });
      if (!application) throw new Error("Not found");
      return application;
    }),

  create: protectedProcedure
    .input(createApplicationInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.application.create({
        data: {
          ...input,
          url: input.url || undefined,
          userId: ctx.session.user.id,
          lastInteractionAt: new Date(),
          statusEvents: {
            create: {
              status: "SAVED",
              comment: "Application saved",
              occurredAt: new Date(),
            },
          },
        },
        include: { statusEvents: true, company: true },
      });
    }),

  update: protectedProcedure
    .input(updateApplicationInput)
    .mutation(async ({ ctx, input }) => {
      const { id, formAnswers, ...app } = input;
      return ctx.prisma.application.update({
        where: { id, userId: ctx.session.user.id },
        data: {
          ...app,
          url: app.url || undefined,
          lastInteractionAt: new Date(),
          formAnswers: {
            deleteMany: {},
            createMany: { data: formAnswers },
          },
        },
        include: { statusEvents: true, company: true, formAnswers: true },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: statusEnum,
        actionType: actionTypeEnum.optional(),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status, actionType, comment } = input;
      return ctx.prisma.application.update({
        where: { id, userId: ctx.session.user.id },
        data: {
          currentStatus: status,
          lastInteractionAt: new Date(),
          statusEvents: {
            create: { status, actionType, comment, occurredAt: new Date() },
          },
        },
        include: {
          statusEvents: { orderBy: { occurredAt: "desc" } },
          company: true,
        },
      });
    }),

  addHistoryNote: protectedProcedure
    .input(
      z.object({
        applicationId: z.string().min(1),
        actionType: actionTypeEnum,
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const application = await ctx.prisma.application.findUnique({
        where: { id: input.applicationId, userId: ctx.session.user.id },
        select: { currentStatus: true },
      });
      if (!application) throw new Error("Not found");

      return ctx.prisma.application.update({
        where: { id: input.applicationId },
        data: {
          lastInteractionAt: new Date(),
          statusEvents: {
            create: {
              status: application.currentStatus,
              actionType: input.actionType,
              comment: input.comment,
              occurredAt: new Date(),
            },
          },
        },
        include: { statusEvents: { orderBy: { occurredAt: "desc" } } },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.application.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
