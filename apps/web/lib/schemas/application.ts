// lib/schemas/application.ts
import { z } from "zod";

const optionalSalary = z.preprocess(
  (val) => (val === "" || val === undefined ? undefined : val),
  z.coerce.number().int().positive().optional(),
);

const baseApplicationFields = z.object({
  title: z.string().min(1, "Title is required"),
  companyId: z.string().min(1, "Company is required"),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  remotePolicy: z.enum(["hybrid", "on-site", "remote"]).optional(),
  salaryMin: optionalSalary,
  salaryMax: optionalSalary,
  techStack: z.array(z.string()).default([]),
  description: z.string().optional(),
});

export const applicationFormSchema = baseApplicationFields.refine(
  (data) =>
    !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax,
  { message: "Min must be less than max", path: ["salaryMax"] },
);

export const editApplicationFormSchema = baseApplicationFields
  .extend({
    id: z.string().min(1),
    formAnswers: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
  })
  .refine(
    (data) =>
      !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax,
    { message: "Min must be less than max", path: ["salaryMax"] },
  );

export type ApplicationFormInput = z.input<typeof applicationFormSchema>;
export type ApplicationFormValues = z.output<typeof applicationFormSchema>;

export type EditApplicationFormInput = z.input<
  typeof editApplicationFormSchema
>;
export type EditApplicationFormValues = z.output<
  typeof editApplicationFormSchema
>;
