import { z } from "zod";

/**
 * Safe Storage Accessor with Schema Validation (SOP v4.0)
 * Mencegah uncaught JSON parse error dan data schema corruption via Zod.
 */
export function safeReadStorage<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  if (typeof window === "undefined" || !window.localStorage) {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    const validation = schema.safeParse(parsed);

    if (validation.success) {
      return validation.data;
    }

    console.warn(
      `[SafeStorage] Schema mismatch pada key "${key}". Menggunakan fallback:`,
      validation.error.format(),
    );
    return fallback;
  } catch (error) {
    console.error(`[SafeStorage] Gagal membaca storage "${key}":`, error);
    return fallback;
  }
}

export function safeWriteStorage<T>(key: string, data: T): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`[SafeStorage] Gagal menulis storage "${key}":`, error);
    return false;
  }
}
