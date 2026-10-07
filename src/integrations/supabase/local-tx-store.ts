import { MOCK_KAS_TRANSACTIONS, MOCK_PIKET_SHIFTS } from "./local-mock-data";

const KAS_KEY = "drg_kas_tx_v2";
const PIKET_KEY = "drg_piket_shifts_v2";

export function getStoredKasTransactions(): Array<Record<string, unknown>> {
  if (typeof window === "undefined") return MOCK_KAS_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(KAS_KEY);
    if (!raw) {
      localStorage.setItem(KAS_KEY, JSON.stringify(MOCK_KAS_TRANSACTIONS));
      return MOCK_KAS_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_KAS_TRANSACTIONS;
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
  if (typeof window !== "undefined") {
    localStorage.setItem(KAS_KEY, JSON.stringify(updated));
  }
  return newRow;
}

export function updateKasTransaction(id: string, patch: Record<string, unknown>) {
  const current = getStoredKasTransactions();
  const updated = current.map((t) => (t.id === id ? { ...t, ...patch } : t));
  if (typeof window !== "undefined") {
    localStorage.setItem(KAS_KEY, JSON.stringify(updated));
  }
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
      if (t.ledger === "sosial") {
        sosialSaldo += t.jenis === "masuk" ? val : -val;
      } else {
        umumSaldo += t.jenis === "masuk" ? val : -val;
      }
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
  const newRow = {
    id: row.id || `shift_${Date.now()}`,
    ...row,
  };
  const updated = [...current, newRow];
  if (typeof window !== "undefined") {
    localStorage.setItem(PIKET_KEY, JSON.stringify(updated));
  }
  return newRow;
}
