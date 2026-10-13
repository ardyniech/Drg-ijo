import { z } from "zod";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { IncidentRecord } from "../types";

const STORAGE_KEY = "drg_incidents_data";

const SEED_INCIDENTS: IncidentRecord[] = [];

const IncidentRecordSchema: z.ZodType<IncidentRecord> = z.any();

const IncidentListSchema = z.array(IncidentRecordSchema);

let inMemoryCache: IncidentRecord[] = [...SEED_INCIDENTS];

export const KejadianStorage = {
  getIncidents(): IncidentRecord[] {
    const items = safeReadStorage(STORAGE_KEY, IncidentListSchema, inMemoryCache);
    inMemoryCache = items;
    return items;
  },

  saveIncidents(items: IncidentRecord[]) {
    inMemoryCache = items;
    safeWriteStorage(STORAGE_KEY, items);
  },
};
