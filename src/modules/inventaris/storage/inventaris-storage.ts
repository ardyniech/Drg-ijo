import { InventarisItem } from "../types";

const STORAGE_KEY = "drg_inventaris_records";

const SEED_INVENTARIS: InventarisItem[] = [];

let inMemoryCache: InventarisItem[] = [...SEED_INVENTARIS];

export const InventarisStorage = {
  getItems(): InventarisItem[] {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          // ignore
        }
      }
    }
    return inMemoryCache;
  },
  saveItems(items: InventarisItem[]) {
    inMemoryCache = items;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  },
};
