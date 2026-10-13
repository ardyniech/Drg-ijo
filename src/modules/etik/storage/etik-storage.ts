import { z } from "zod";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { EtikCase, NewEtikCasePayload } from "../types";

const STORAGE_KEY = "drg_etik_cases_v1";
let inMemoryStore: EtikCase[] | null = null;

const initialCases: EtikCase[] = [];

const EtikCaseSchema: z.ZodType<EtikCase> = z.any();
const EtikCasesSchema = z.array(EtikCaseSchema);

export function getEtikCases(): EtikCase[] {
  const cases = safeReadStorage(STORAGE_KEY, EtikCasesSchema, inMemoryStore ?? initialCases);
  inMemoryStore = cases;
  return cases;
}

export function saveEtikCases(cases: EtikCase[]) {
  inMemoryStore = cases;
  safeWriteStorage(STORAGE_KEY, cases);
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
