import { z } from "zod";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { MemberKaderisasi } from "../types";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { mapUsersToKaderisasi } from "./kaderisasi-mapper";

const STORAGE_KEY = "drg_kaderisasi_data_v2";
let inMemoryStore: MemberKaderisasi[] | null = null;

const KaderisasiSchema: z.ZodType<MemberKaderisasi> = z.any();
const KaderisasiListSchema = z.array(KaderisasiSchema);

export function getKaderisasiList(): MemberKaderisasi[] {
  const fallback = inMemoryStore ?? mapUsersToKaderisasi();
  const data = safeReadStorage(STORAGE_KEY, KaderisasiListSchema, fallback);
  if (data.length === 0) {
    const initial = mapUsersToKaderisasi();
    inMemoryStore = initial;
    safeWriteStorage(STORAGE_KEY, initial);
    return initial;
  }
  inMemoryStore = data;
  return data;
}

export function saveKaderisasiList(list: MemberKaderisasi[]) {
  inMemoryStore = list;
  safeWriteStorage(STORAGE_KEY, list);
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
