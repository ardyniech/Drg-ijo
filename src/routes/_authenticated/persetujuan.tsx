import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import {
  usePersetujuan,
  ApprovalCard,
  ApprovalActionDialog,
  ApprovalFilters,
} from "@/modules/persetujuan";
import { UserCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/persetujuan")({
  component: PersetujuanAkunPage,
});

function PersetujuanAkunPage() {
  const {
    list,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    selectedItem,
    setSelectedItem,
    handleApprove,
    handleReject,
  } = usePersetujuan();

  const isFiltered = Boolean(search || typeFilter !== "all" || statusFilter !== "all");

  return (
    <PageShell
      title="Persetujuan Dulur Merapat"
      description="Verifikasi sedulur baru yang merapat ke pangkalan DRG, persetujuan pindah pangkalan santui, dan pengesahan amanah."
    >
      <div className="space-y-6">
        <ApprovalFilters
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
            <UserCheck className="h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {isFiltered ? "Belum Ada Antrean Dulur di Sini" : "Semua Berkas Sudah Klir"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {isFiltered
                ? "Tidak ada permohonan yang memenuhi kriteria filter pencarian."
                : "Alhamdulillah semua antrean dulur merapat dan mutasi pangkalan sudah tuntas diverifikasi."}
            </p>
            {isFiltered && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-4 gap-1.5 rounded-xl text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {list.map((item) => (
              <ApprovalCard key={item.id} item={item} onReview={setSelectedItem} />
            ))}
          </div>
        )}

        <ApprovalActionDialog
          item={selectedItem}
          open={Boolean(selectedItem)}
          onOpenChange={(open) => !open && setSelectedItem(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </PageShell>
  );
}
