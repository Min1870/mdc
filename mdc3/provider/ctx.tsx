import { useStorageState } from "@/hooks/useStorageState";
import * as SecureStore from "expo-secure-store";
import { useContext, createContext, type PropsWithChildren } from "react";
import { fetchApi } from "@/api";
import { FormStateProps } from "@/app/login";



const AuthContext = createContext<{
  signIn: (formState: FormStateProps) => Promise<void>;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: async () => {},
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: async (formState: FormStateProps) => {
          try {
            const response = await fetchApi({
              endpoint: "login",
              data: formState,
            });
            if (response) {
              setSession("xxx");
              await SecureStore.setItemAsync("token", response.token);
              await SecureStore.setItemAsync(
                "refreshToken",
                response.refreshToken,
              );
              await SecureStore.setItemAsync("randToken", response.randToken);
            }
          } catch (error) {
            console.error(error);
          }
        },
        signOut: async () => {
          try {
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("refreshToken");
            await SecureStore.deleteItemAsync("randToken");
            setSession(null);
          } catch (error) {
            console.error(error);
          }
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
