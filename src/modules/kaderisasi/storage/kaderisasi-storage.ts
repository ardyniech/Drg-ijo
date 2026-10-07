import { MemberKaderisasi } from "../types";

const STORAGE_KEY = "drg_kaderisasi_data_v1";
let inMemoryStore: MemberKaderisasi[] | null = null;

const initialData: MemberKaderisasi[] = [
  {
    id: "kad-1",
    memberId: "DRG-045",
    fullName: "Budi Santoso",
    currentLevel: "Calon",
    targetLevel: "Muda",
    joinedAt: "2024-01-15",
    piketAttendanceCount: 12,
    kasCompliancePercent: 100,
    points: 85,
    status: "eligible",
    requirements: [
      { id: "req-1", label: "Piket minimal 10 kali", met: true, score: 30 },
      { id: "req-2", label: "Iuran kas lancar > 90%", met: true, score: 30 },
      { id: "req-3", label: "Rekomendasi Korlap Pangkalan", met: true, score: 25 },
    ],
  },
  {
    id: "kad-2",
    memberId: "DRG-029",
    fullName: "Agus Pratama",
    currentLevel: "Muda",
    targetLevel: "Madya",
    joinedAt: "2023-06-20",
    piketAttendanceCount: 24,
    kasCompliancePercent: 95,
    points: 92,
    status: "in_review",
    requirements: [
      { id: "req-1", label: "Piket satgas minimal 20 kali", met: true, score: 30 },
      { id: "req-2", label: "Aktif respon SOS lapangan minimal 5x", met: true, score: 35 },
      { id: "req-3", label: "Lulus pembekalan dewan etik", met: true, score: 27 },
    ],
  },
  {
    id: "kad-3",
    memberId: "DRG-012",
    fullName: "Hendra Wijaya",
    currentLevel: "Madya",
    targetLevel: "Utama",
    joinedAt: "2022-11-10",
    piketAttendanceCount: 45,
    kasCompliancePercent: 100,
    points: 98,
    status: "promoted",
    lastEvaluatedAt: "2024-05-01",
    evaluatorNotes: "Dedikasi luar biasa sebagai komandan satgas.",
    requirements: [
      { id: "req-1", label: "Pengabdian > 1.5 tahun", met: true, score: 35 },
      { id: "req-2", label: "Mentor bagi minimal 3 anggota baru", met: true, score: 35 },
      { id: "req-3", label: "Sidang pleno Dewan Pengurus", met: true, score: 28 },
    ],
  },
];

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
