import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@job-tracker/server/routers/_app";
import { createContext } from "@job-tracker/server/context";
import { auth } from "@/lib/auth";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    // Web requests are authenticated by the NextAuth cookie,
    // mobile requests by an `Authorization: Bearer <token>` header.
    createContext: async () => createContext({ req, webSession: await auth() }),
  });

export { handler as GET, handler as POST };
