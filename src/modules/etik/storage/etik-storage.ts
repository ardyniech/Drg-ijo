import { EtikCase, NewEtikCasePayload } from "../types";

const STORAGE_KEY = "drg_etik_cases_v1";
let inMemoryStore: EtikCase[] | null = null;

const initialCases: EtikCase[] = [
  {
    id: "case-1",
    caseNumber: "ETIK-2024-001",
    reportedMemberName: "Rian Hidayat",
    reportedMemberId: "DRG-088",
    reporterName: "Satgas Lapangan",
    category: "Ketertiban Pangkalan",
    severity: "Ringan",
    description: "Parkir liar di luar zona pangkalan resmi stasiun yang memicu komplain pengelola.",
    incidentDate: "2024-05-10",
    location: "Stasiun Sudirman",
    status: "mediation_scheduled",
    mediationNotes: "Dijadwalkan mediasi bersama Korlap pada 15 Mei 2024.",
    createdAt: "2024-05-10T14:30:00Z",
  },
  {
    id: "case-2",
    caseNumber: "ETIK-2024-002",
    reportedMemberName: "Fajar Nugraha",
    reportedMemberId: "DRG-032",
    reporterName: "Anggota Tim C",
    category: "Perselisihan Lapangan",
    severity: "Sedang",
    description: "Adu mulut terkait perebutan orderan pelanggan di spot mall.",
    incidentDate: "2024-04-28",
    location: "Mall Grand Indonesia",
    status: "resolved",
    sanctionSummary: "Sanksi teguran tertulis dan perdamaian tertulis kedua belah pihak.",
    createdAt: "2024-04-28T09:15:00Z",
  },
];

export function getEtikCases(): EtikCase[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return inMemoryStore ?? initialCases;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
      return initialCases;
    }
    return JSON.parse(raw);
  } catch {
    return initialCases;
  }
}

export function saveEtikCases(cases: EtikCase[]) {
  inMemoryStore = cases;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch {
      // ignore
    }
  }
}

export function addEtikCase(
  payload: NewEtikCasePayload,
  reporterName = "Pelapor Anggota",
): EtikCase {
  const current = getEtikCases();
  const newCase: EtikCase = {
    id: `case-${Date.now()}`,
    caseNumber: `ETIK-${new Date().getFullYear()}-${String(current.length + 1).padStart(3, "0")}`,
    reporterName,
    ...payload,
    status: "investigating",
    createdAt: new Date().toISOString(),
  };
  const updated = [newCase, ...current];
  saveEtikCases(updated);
  return newCase;
}

export function updateCaseStatus(
  id: string,
  status: EtikCase["status"],
  notes?: string,
): EtikCase[] {
  const current = getEtikCases();
  const updated = current.map((c) =>
    c.id === id
      ? {
          ...c,
          status,
          ...(status === "sanctioned" ? { sanctionSummary: notes } : {}),
          ...(status === "mediation_scheduled" ? { mediationNotes: notes } : {}),
          ...(status === "resolved" ? { sanctionSummary: notes || c.sanctionSummary } : {}),
        }
      : c,
  );
  saveEtikCases(updated);
  return updated;
}
