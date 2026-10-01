import { createContext, use, type PropsWithChildren } from "react";
import { Alert } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useStorageState } from "./useStorageState";
import { signInWithBrowser } from "./lib/auth";
import { AUTH_TOKEN_KEY, setAuthToken, trpc } from "./lib/trpc";

type AuthContextValue = {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  session: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useSession(): AuthContextValue {
  const value = use(AuthContext);

  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState(AUTH_TOKEN_KEY);
  const queryClient = useQueryClient();
  const exchangeCode = trpc.auth.exchangeMobileCode.useMutation();
  const logout = trpc.auth.logout.useMutation();

  // Keep the tRPC client's header in sync with the stored token.
  setAuthToken(session);

  return (
    <AuthContext.Provider
      value={{
        signIn: async () => {
          try {
            const login = await signInWithBrowser();

            if (!login) {
              return; // user closed the browser
            }

            const result = await exchangeCode.mutateAsync(login);

            setAuthToken(result.token);
            setSession(result.token);
          } catch (error) {
            console.error("Sign-in failed:", error);
            Alert.alert(
              "Sign-in failed",
              error instanceof Error ? error.message : String(error),
            );
          }
        },

        signOut: async () => {
          try {
            // Revoke the server session while the token is still stored.
            await logout.mutateAsync();
          } catch (error) {
            console.error("Server logout failed:", error);
          }

          setSession(null);
          queryClient.clear();
        },

        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
