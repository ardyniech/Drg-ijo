import { NotulenRecord } from "../types";

const STORAGE_KEY = "drg_notulen_records";
let inMemoryNotulen: NotulenRecord[] | null = null;

const SEED_NOTULEN: NotulenRecord[] = [];

export const NotulenStorage = {
  getNotulen(): NotulenRecord[] {
    if (typeof window === "undefined" || !window.localStorage) {
      return inMemoryNotulen ?? SEED_NOTULEN;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_NOTULEN));
      return SEED_NOTULEN;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_NOTULEN;
    }
  },
  saveNotulen(items: NotulenRecord[]) {
    inMemoryNotulen = items;
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  },
};
