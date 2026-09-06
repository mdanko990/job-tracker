import { router } from "../trpc";
import { applicationRouter } from "./application";
import { companyRouter } from "./company";
import { contactRouter } from "./contact";
import { formAnswerRouter } from "./form-answer";

export const appRouter = router({
  application: applicationRouter,
  company: companyRouter,
  contact: contactRouter,
  formAnswer: formAnswerRouter,
});

export type AppRouter = typeof appRouter;
