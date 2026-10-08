import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useIs } from "@/hooks/use-my-role";
import { useMe } from "@/hooks/use-me";
import {
  useKas,
  tierOf,
  KasBalanceCards,
  KasFilters,
  KasTable,
  NewTxDialog,
  KasExportModal,
  KasTransparencyDashboard,
} from "@/modules/kas";
import { BarChart3, Table as TableIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/kas")({
  head: () => ({ meta: [{ title: "Kas Komunitas — DRG App" }] }),
  component: KasPage,
});

function KasPage() {
  const [viewMode, setViewMode] = useState<"dashboard" | "table">("dashboard");
  const isBendahara = useIs(["bendahara", "admin", "super_admin"]);
  const isAdmin = useIs(["admin", "super_admin"]);
  const canApprove = isBendahara || isAdmin;
  const { data: me } = useMe();
  const roles = me ? [me.role, ...(me.isAdmin ? ["admin", "bendahara"] : [])] : [];

  const canApproveTier = (jumlah: number) => {
    const t = tierOf(jumlah);
    if (!t) return false;
    if (roles.includes("super_admin")) return true;
    if (t.role === "super_admin") return false;
    if (t.role === "admin") return roles.includes("admin");
    return roles.includes("bendahara") || roles.includes("admin");
  };

  const {
    rows,
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

  return (
    <PageShell
      eyebrow="Gotong Royong & Guyub Seduluran"
      title="Kas Sedulur & Uang Solidaritas DRG"
      description="Transparansi iuran kas gotong royong, santunan dulur musibah di jalan, dan dana guyub basecamp 100% terbuka."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-muted p-1 text-xs">
            <button
              onClick={() => setViewMode("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === "dashboard"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              <span>Transparansi Guyub</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Buku Kas Jalur</span>
            </button>
          </div>
          <KasExportModal rows={filtered} />
          {canApprove && <NewTxDialog />}
        </div>
      }
    >
      <KasBalanceCards totals={totals} />

      {viewMode === "dashboard" ? (
        <KasTransparencyDashboard rows={rows} />
      ) : (
        <div className="space-y-4">
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
        </div>
      )}
    </PageShell>
  );
}
