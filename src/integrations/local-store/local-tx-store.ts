import { MOCK_PIKET_SHIFTS } from "./local-mock-data";

const KAS_KEY = "drg_kas_tx_v2";
const PIKET_KEY = "drg_piket_shifts_v2";

function isMockTransaction(t: Record<string, unknown>): boolean {
  if (!t || typeof t !== "object") return true;
  const id = String(t.id || "").toLowerCase();
  const desc = String(t.deskripsi || "").toLowerCase();
  return (
    id.startsWith("mock") ||
    id.startsWith("seed") ||
    id.startsWith("dummy") ||
    id.startsWith("tx-seed") ||
    desc.includes("dummy") ||
    desc.includes("mock transaction")
  );
}

export function purgeAllMockKasData(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KAS_KEY);
    if (!raw) return;
    const list = JSON.parse(raw);
    if (Array.isArray(list)) {
      const cleaned = list.filter((item) => !isMockTransaction(item));
      localStorage.setItem(KAS_KEY, JSON.stringify(cleaned));
    }
  } catch {
    localStorage.setItem(KAS_KEY, JSON.stringify([]));
  }
}

export function getStoredKasTransactions(): Array<Record<string, unknown>> {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KAS_KEY);
    if (!raw) {
      localStorage.setItem(KAS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cleaned = parsed.filter((item) => !isMockTransaction(item));
    if (cleaned.length !== parsed.length) localStorage.setItem(KAS_KEY, JSON.stringify(cleaned));
    return cleaned;
  } catch {
    return [];
  }
}

export function saveKasTransaction(row: Record<string, unknown>) {
  const current = getStoredKasTransactions();
  const newRow = {
    id: row.id || `kas_${Date.now()}`,
    status: row.status || "disetujui",
    created_at: new Date().toISOString(),
    ...row,
  };
  const updated = [newRow, ...current];
  if (typeof window !== "undefined") localStorage.setItem(KAS_KEY, JSON.stringify(updated));
  return newRow;
}

export function updateKasTransaction(id: string, patch: Record<string, unknown>) {
  const current = getStoredKasTransactions();
  const updated = current.map((t) => (t.id === id ? { ...t, ...patch } : t));
  if (typeof window !== "undefined") localStorage.setItem(KAS_KEY, JSON.stringify(updated));
  return updated;
}

export function computeKasBalances() {
  const items = getStoredKasTransactions();
  let sosialSaldo = 0;
  let umumSaldo = 0;
  let menunggu = 0;
  items.forEach((t) => {
    const val = Number(t.jumlah) || 0;
    if (t.status === "disetujui") {
      if (t.ledger === "sosial") sosialSaldo += t.jenis === "masuk" ? val : -val;
      else umumSaldo += t.jenis === "masuk" ? val : -val;
    } else if (t.status === "menunggu") {
      menunggu += 1;
    }
  });
  return [
    { ledger: "sosial", saldo: Math.max(0, sosialSaldo), menunggu },
    { ledger: "umum", saldo: Math.max(0, umumSaldo), menunggu: 0 },
  ];
}

export function getStoredPiketShifts(): Array<Record<string, unknown>> {
  if (typeof window === "undefined") return MOCK_PIKET_SHIFTS;
  try {
    const raw = localStorage.getItem(PIKET_KEY);
    if (!raw) {
      localStorage.setItem(PIKET_KEY, JSON.stringify(MOCK_PIKET_SHIFTS));
      return MOCK_PIKET_SHIFTS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_PIKET_SHIFTS;
  }
}

export function savePiketShift(row: Record<string, unknown>) {
  const current = getStoredPiketShifts();
  const newRow = { id: row.id || `shift_${Date.now()}`, ...row };
  const updated = [...current, newRow];
  if (typeof window !== "undefined") localStorage.setItem(PIKET_KEY, JSON.stringify(updated));
  return newRow;
}
