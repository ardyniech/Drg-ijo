import { z } from "zod";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { NotulenRecord } from "../types";

const STORAGE_KEY = "drg_notulen_records";
const NotulenSchema: z.ZodType<NotulenRecord> = z.any();
const NotulenListSchema = z.array(NotulenSchema);

let cache: NotulenRecord[] | null = null;

export const NotulenStorage = {
  getNotulen(): NotulenRecord[] {
    if (cache) return cache;
    const data = safeReadStorage(STORAGE_KEY, NotulenListSchema, []);
    cache = data;
    return data;
  },
  saveNotulen(records: NotulenRecord[]): void {
    cache = records;
    safeWriteStorage(STORAGE_KEY, records);
  },
};
