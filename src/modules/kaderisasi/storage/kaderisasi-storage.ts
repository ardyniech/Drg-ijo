import { MemberKaderisasi } from "../types";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { mapUsersToKaderisasi } from "./kaderisasi-mapper";

const STORAGE_KEY = "drg_kaderisasi_data_v2";
let inMemoryStore: MemberKaderisasi[] | null = null;

export function getKaderisasiList(): MemberKaderisasi[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return inMemoryStore ?? mapUsersToKaderisasi();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = mapUsersToKaderisasi();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mapUsersToKaderisasi();
  } catch {
    return mapUsersToKaderisasi();
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
  const updated = current.map((item) => {
    if (item.id !== id) return item;
    const isPromoted = status === "promoted";
    const nextLevel = isPromoted ? item.targetLevel : item.currentLevel;

    if (isPromoted) {
      const jenjangMap: Record<string, "calon" | "muda" | "madya" | "purna"> = {
        Calon: "calon",
        Muda: "muda",
        Madya: "madya",
        Utama: "purna",
        Kehormatan: "purna",
      };
      LocalAuthClient.updateUser(id, {
        jenjang: jenjangMap[nextLevel] || "muda",
      });
    }

    return {
      ...item,
      status,
      evaluatorNotes: notes ?? item.evaluatorNotes,
      lastEvaluatedAt: new Date().toISOString().split("T")[0],
      currentLevel: nextLevel,
    };
  });
  saveKaderisasiList(updated);
  return updated;
}
