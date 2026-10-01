import { router } from "../trpc";
import { analyticsRouter } from "./analytics";
import { applicationRouter } from "./application";
import { authRouter } from "./auth";
import { companyRouter } from "./company";
import { contactRouter } from "./contact";
import { formAnswerRouter } from "./form-answer";

export const appRouter = router({
  auth: authRouter,
  application: applicationRouter,
  company: companyRouter,
  contact: contactRouter,
  formAnswer: formAnswerRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
