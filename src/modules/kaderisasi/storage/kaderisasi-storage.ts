import { MemberKaderisasi } from "../types";

const STORAGE_KEY = "drg_kaderisasi_data_v1";
let inMemoryStore: MemberKaderisasi[] | null = null;

const initialData: MemberKaderisasi[] = [];

export function getKaderisasiList(): MemberKaderisasi[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return inMemoryStore ?? initialData;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw);
  } catch {
    return initialData;
  }
}

export function saveKaderisasiList(list: MemberKaderisasi[]) {
  inMemoryStore = list;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}

export function updateMemberStatus(
  id: string,
  status: MemberKaderisasi["status"],
  notes?: string,
): MemberKaderisasi[] {
  const current = getKaderisasiList();
  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          status,
          evaluatorNotes: notes ?? item.evaluatorNotes,
          lastEvaluatedAt: new Date().toISOString().split("T")[0],
          currentLevel: status === "promoted" ? item.targetLevel : item.currentLevel,
        }
      : item,
  );
  saveKaderisasiList(updated);
  return updated;
}
