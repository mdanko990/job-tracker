import { useCallback, useEffect, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null,
    ): [boolean, T | null] => [false, action],
    initialValue,
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(
  key: string,
  value: string | null,
): Promise<void> {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Local storage is unavailable:", error);
    }

    return;
  }

  try {
    if (value === null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error("SecureStore is unavailable:", error);
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        if (Platform.OS === "web") {
          const value =
            typeof localStorage !== "undefined"
              ? localStorage.getItem(key)
              : null;

          if (mounted) {
            setState(value);
          }

          return;
        }

        const value = await SecureStore.getItemAsync(key);

        if (mounted) {
          setState(value);
        }
      } catch (error) {
        console.error("Failed to load storage:", error);

        // Don't leave the app stuck on Loading...
        if (mounted) {
          setState(null);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);

      setStorageItemAsync(key, value).catch((error) => {
        console.error("Failed to save storage:", error);
      });
    },
    [key],
  );

  return [state, setValue];
}
