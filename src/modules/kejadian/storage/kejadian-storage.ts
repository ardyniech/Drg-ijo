import { IncidentRecord } from "../types";

const STORAGE_KEY = "drg_incidents_data";

const SEED_INCIDENTS: IncidentRecord[] = [];

let inMemoryCache: IncidentRecord[] = [...SEED_INCIDENTS];

export const KejadianStorage = {
  getIncidents(): IncidentRecord[] {
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

  saveIncidents(items: IncidentRecord[]) {
    inMemoryCache = items;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  },
};
