import { useEffect, useRef } from "react";
import { PersistOptions, StorageType } from "./types";
import { FieldValues } from "react-hook-form";

const getStorage = (type: StorageType) => {
  if (type === "sessionStorage") {
    return {
      get: (key: string) => sessionStorage.getItem(key),
      set: (key: string, value: string) => sessionStorage.setItem(key, value),
      remove: (key: string) => sessionStorage.removeItem(key),
    };
  }

  return {
    get: (key: string) => localStorage.getItem(key),
    set: (key: string, value: string) => localStorage.setItem(key, value),
    remove: (key: string) => localStorage.removeItem(key),
  };
};

export function usePersistedForm<T extends FieldValues>({
  key,
  formMethods,
  override = {},
  exclude = [],
  storage = "localStorage",
  debounce = 300,
}: PersistOptions<T>) {
  const store = getStorage(storage);
  const timeoutRef = useRef<any>(null);
  const { reset, watch } = formMethods;

  // Restore on mount
  useEffect(() => {
    const storedValue = store.get(key);
    if (storedValue) {
      reset({
        ...JSON.parse(storedValue),
        ...override,
      });
    }
  }, [key, formMethods]);

  // Subscribe without rerenders
  // Prevent laggy issue on watch multiple fields
  // Debounce the updates
  useEffect(() => {
    const subscription = watch((values) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const filteredValue = Object.keys(values).reduce((acc, key) => {
          if (!exclude.includes(key)) {
            acc[key as keyof T] = values[key];
          }

          return acc;
        }, {} as T);

        store.set(`form_persist:${key}`, JSON.stringify(filteredValue));
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
