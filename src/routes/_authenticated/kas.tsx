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
  KasTransparencyDashboard,
  KasHeaderActions,
  KasSkList,
  type KasViewMode,
} from "@/modules/kas";

export const Route = createFileRoute("/_authenticated/kas")({
  head: () => ({ meta: [{ title: "Kas Komunitas — DRG App" }] }),
  component: KasPage,
});

function KasPage() {
  const [viewMode, setViewMode] = useState<KasViewMode>("dashboard");
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
        <KasHeaderActions
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filteredRows={filtered}
          canApprove={canApprove}
        />
      }
    >
      <KasBalanceCards totals={totals} />

      {viewMode === "dashboard" && <KasTransparencyDashboard rows={rows} />}

      {viewMode === "table" && (
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

      {viewMode === "sk" && <KasSkList />}
    </PageShell>
  );
}
