import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@job-tracker/server";

export const trpc = createTRPCReact<AppRouter>();
