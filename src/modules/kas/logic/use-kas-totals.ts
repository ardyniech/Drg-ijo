import { useMemo } from "react";

export function useKasTotals(balances: Array<Record<string, unknown>> = []) {
  return useMemo(() => {
    const sosial = balances.find((b) => b.ledger === "sosial")?.saldo ?? 0;
    const umum = balances.find((b) => b.ledger === "umum")?.saldo ?? 0;
    const menunggu = balances.find((b) => b.ledger === "sosial")?.menunggu ?? 0;
    return { sosial, umum, menunggu };
  }, [balances]);
}
