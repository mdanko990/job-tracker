import { useState } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { SessionProvider, useSession } from "@/ctx";
import { trpc, trpcClient } from "@/lib/trpc";
import { SplashScreenController } from "@/splash";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <SplashScreenController />
            <RootNavigator />
          </SessionProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
