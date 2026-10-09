import { useMemo } from "react";

export function useKasTotals(balances: Array<Record<string, unknown>> = []) {
  return useMemo(() => {
    const sosialRaw = balances.find((b) => b.ledger === "sosial")?.saldo;
    const umumRaw = balances.find((b) => b.ledger === "umum")?.saldo;
    const menungguRaw = balances.find((b) => b.ledger === "sosial")?.menunggu;
    return {
      sosial: Number(sosialRaw ?? 0),
      umum: Number(umumRaw ?? 0),
      menunggu: Number(menungguRaw ?? 0),
    };
  }, [balances]);
}
