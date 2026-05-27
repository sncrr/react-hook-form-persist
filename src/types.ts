import { FieldValues, UseFormReturn, UseFormSetValue, UseFormWatch } from "react-hook-form";

export type StorageType = "localStorage" | "sessionStorage";

/**
 * Configuration options for persisting and restoring
 * React Hook Form state in web environments.
 *
 * Uses a debounced sync strategy to avoid performance issues
 * during frequent form updates.
 */
export type PersistOptions<T extends FieldValues> = {

  /**
   * Unique storage key used to persist form data in storage.
   */
  key: string;

  /**
   * React hook form methods returned from useForm().
   */
  formMethods: UseFormReturn<T>;

  /**
   * Storage engine to use for persistence.
   * Default: 'localStorage'
   */
  storage?: StorageType;

  /**
   * Debounce delay (in milliseconds) for persisting updates.
   * Prevents excessive writes during rapid input changes.
   * Default: 300
   */
  debounce?: number;

  /**
   * Values that should override persisted storage
   * values when restoring the form.
   */
  override?: Partial<T>;

  /**
   * Form fields that should NOT be persisted.
   */
  exclude?: Array<keyof T>;
};