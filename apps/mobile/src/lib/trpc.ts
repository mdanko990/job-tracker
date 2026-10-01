import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@job-tracker/server";
export const AUTH_TOKEN_KEY = "auth_token";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://job-tracker-nine-opal.vercel.app";

// In-memory copy of the session token, kept in sync by <SessionProvider />.
// Persisting to SecureStore is async, so reading from it here could race
// with the first requests made right after sign-in.
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${API_URL}/api/trpc`,
      transformer: superjson,
      headers() {
        return authToken ? { authorization: `Bearer ${authToken}` } : {};
      },
    }),
  ],
});
