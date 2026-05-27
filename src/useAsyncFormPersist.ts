import { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { PersistOptions } from "./types";

let AsyncStorage: any;

const getAsyncStorage = () => {
  if (!AsyncStorage) {
    AsyncStorage = require("@react-native-async-storage/async-storage").default;
  }
  return AsyncStorage;
};

export function useAsyncFormPersist<T extends FieldValues>({
  key,
  formMethods,
  override = {},
  exclude = [],
  debounce = 300,
}: PersistOptions<T>) {
  const storage = getAsyncStorage();
  const timeoutRef = useRef<any>(null);
  const { reset, watch } = formMethods;

  // Restore on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const storedValue = await storage.getItem(`form_persist:${key}`);

        if (storedValue && mounted) {
          reset({
            ...JSON.parse(storedValue),
            ...override,
          });
        }
      } catch {
        // ignore corrupted data
      }
    })();

    return () => {
      mounted = false;
    };
  }, [key, formMethods]);

  // Persist on change (debounced)
  useEffect(() => {
    const subscription = watch((values) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          const filteredValue = Object.keys(values).reduce((acc, k) => {
            if (!exclude.includes(k)) {
              acc[k as keyof T] = values[k];
            }
            return acc;
          }, {} as T);

          await storage.setItem(
            `form_persist:${key}`,
            JSON.stringify(filteredValue),
          );
        } catch {
          // ignore write errors
        }
      }, debounce);
    });

    return () => {
      subscription.unsubscribe();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debounce, formMethods, key]);
}
