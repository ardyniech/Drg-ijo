import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useIs } from "@/hooks/use-my-role";
import { useMe } from "@/hooks/use-me";
import {
  useKas,
  tierOf,
  KasBalanceCards,
  KasFilters,
  KasTable,
  NewTxDialog,
} from "@/modules/kas";

export const Route = createFileRoute("/_authenticated/kas")({
  head: () => ({ meta: [{ title: "Kas Komunitas — DRG App" }] }),
  component: KasPage,
});

function KasPage() {
  const isBendahara = useIs("bendahara");
  const isAdmin = useIs("admin");
  const canApprove = isBendahara || isAdmin;
  const { data: me } = useMe();
  const roles = me?.roles ?? [];

  const canApproveTier = (jumlah: number) => {
    const t = tierOf(jumlah);
    if (!t) return false;
    if (roles.includes("super_admin")) return true;
    if (t.role === "super_admin") return false;
    if (t.role === "admin") return roles.includes("admin");
    return roles.includes("bendahara") || roles.includes("admin");
  };

  const {
    filtered,
    totals,
    isLoading,
    ledgerFilter,
    setLedgerFilter,
    statusFilter,
    setStatusFilter,
    q,
    setQ,
    approve,
  } = useKas();

  function exportCsv() {
    const header = ["tanggal", "ledger", "jenis", "jumlah", "kategori", "deskripsi", "status"];
    const lines = [header.join(",")];
    filtered.forEach((r) => {
      const cells = [
        r.tanggal,
        r.ledger,
        r.jenis,
        String(r.jumlah),
        (r.kategori ?? "").replaceAll('"', '""'),
        (r.deskripsi ?? "").replaceAll('"', '""'),
        r.status,
      ].map((c) => `"${c}"`);
      lines.push(cells.join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kas-drg-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageShell
      eyebrow="Bendahara"
      title="Kas Komunitas"
      description="Ledger sosial & umum transparan. Tier approval: <500rb otomatis, 500rb–2jt bendahara, 2–5jt admin, ≥5jt super admin."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="mr-1.5 h-4 w-4" /> CSV
          </Button>
          {isBendahara && <NewTxDialog />}
        </div>
      }
    >
      <KasBalanceCards totals={totals} />

      <KasFilters
        q={q}
        onQChange={setQ}
        ledgerFilter={ledgerFilter}
        onLedgerFilterChange={setLedgerFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <KasTable
        rows={filtered}
        isLoading={isLoading}
        canApprove={canApprove}
        canApproveTier={canApproveTier}
        onApprove={(id, status) => approve.mutate({ id, status })}
      />
    </PageShell>
  );
}
