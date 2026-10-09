import { ActiveDriverMarker, OfficialShelter } from "../types";

const SHELTERS_KEY = "drg_shelters_v1";
let inMemoryShelters: OfficialShelter[] | null = null;

export function getShelters(): OfficialShelter[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return inMemoryShelters ?? [];
  }
  try {
    const raw = localStorage.getItem(SHELTERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OfficialShelter[]) : [];
  } catch {
    return [];
  }
}

export function saveShelters(list: OfficialShelter[]) {
  inMemoryShelters = list;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(SHELTERS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}

export function addShelter(shelter: OfficialShelter) {
  saveShelters([shelter, ...getShelters()]);
  return shelter;
}

export function getActiveDrivers(): ActiveDriverMarker[] {
  return [];
}
