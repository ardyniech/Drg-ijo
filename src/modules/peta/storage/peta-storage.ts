import { z } from "zod";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { ActiveDriverMarker, OfficialShelter } from "../types";

const SHELTERS_KEY = "drg_shelters_v1";
const ShelterSchema: z.ZodType<OfficialShelter> = z.any();
const SheltersListSchema = z.array(ShelterSchema);

let inMemoryShelters: OfficialShelter[] | null = null;

export function getShelters(): OfficialShelter[] {
  const data = safeReadStorage(SHELTERS_KEY, SheltersListSchema, inMemoryShelters ?? []);
  inMemoryShelters = data;
  return data;
}

export function saveShelters(list: OfficialShelter[]) {
  inMemoryShelters = list;
  safeWriteStorage(SHELTERS_KEY, list);
}

export function addShelter(shelter: OfficialShelter) {
  saveShelters([shelter, ...getShelters()]);
  return shelter;
}

export function getActiveDrivers(): ActiveDriverMarker[] {
  return [];
}
