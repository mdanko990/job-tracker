"use client";

import { useState } from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error) => {
            const message =
              error instanceof TRPCClientError
                ? error.message
                : "Something went wrong";
            toast.error(message);
          },
          onSuccess: (_data, _variables, _context, mutation) => {
            const successMessage = mutation.meta?.successMessage as
              | string
              | undefined;
            if (successMessage) toast.success(successMessage);
          },
        }),
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
