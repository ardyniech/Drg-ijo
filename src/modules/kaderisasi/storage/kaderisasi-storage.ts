import { MemberKaderisasi, JenjangLevel } from "../types";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";

const STORAGE_KEY = "drg_kaderisasi_data_v1";
let inMemoryStore: MemberKaderisasi[] | null = null;

function mapUsersToKaderisasi(): MemberKaderisasi[] {
  const users = LocalAuthClient.getUsers();
  return users.map((u, idx) => {
    const raw = (u.jenjang || "calon").toLowerCase();
    const currentLevel: JenjangLevel =
      raw === "purna" ? "Utama" : raw === "madya" ? "Madya" : raw === "muda" ? "Muda" : "Calon";
    const targetLevel: JenjangLevel =
      currentLevel === "Calon"
        ? "Muda"
        : currentLevel === "Muda"
          ? "Madya"
          : currentLevel === "Madya"
            ? "Utama"
            : "Kehormatan";
    return {
      id: u.id,
      memberId: u.nomor_anggota || `DRG-2026-${String(idx + 1).padStart(3, "0")}`,
      fullName: u.nama,
      currentLevel,
      targetLevel,
      joinedAt: u.created_at.split("T")[0],
      piketAttendanceCount: 12,
      kasCompliancePercent: 100,
      points: 85,
      status: "eligible",
      requirements: [
        { id: "req-1", label: "Piket pantau pangkalan & satgas >= 80%", met: true, score: 90 },
        { id: "req-2", label: "Iuran kas aspal tertib & lancar", met: true, score: 100 },
        {
          id: "req-3",
          label: "Tertib lalu lintas & nihil pelanggaran etik jalur",
          met: true,
          score: 100,
        },
      ],
    };
  });
}

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
      LocalAuthClient.updateUser(id, { jenjang: jenjangMap[nextLevel] || "muda" });
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
