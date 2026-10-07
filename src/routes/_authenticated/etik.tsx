import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import {
  useEtik,
  EtikCaseCard,
  EtikReportDialog,
  EtikActionDialog,
  EtikFilterBar,
} from "@/modules/etik";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Plus, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/etik")({
  component: DewanEtikPage,
});

function DewanEtikPage() {
  const {
    cases,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedCase,
    setSelectedCase,
    isReportOpen,
    setIsReportOpen,
    handleCreateCase,
    handleUpdateStatus,
  } = useEtik();

  const isFiltered = Boolean(search || statusFilter !== "all");

  return (
    <PageShell
      title="Dewan Etik & Kode Perilaku"
      description="Penegakan tata tertib komunitas, mediasi perselisihan lapangan, dan transparansi keputusan sidang etik."
      action={
        <Button
          onClick={() => setIsReportOpen(true)}
          className="gap-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Lapor Pelanggaran
        </Button>
      }
    >
      <div className="space-y-6">
        <EtikFilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {cases.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
            <ShieldAlert className="h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {isFiltered ? "Tidak Ada Perkara yang Cocok" : "Tidak Ada Perkara Etik"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {isFiltered
                ? "Tidak ada perkara yang memenuhi kriteria pencarian Anda."
                : "Semua kondisi ketertiban komunitas berjalan kondusif tanpa aduan aktif."}
            </p>
            {isFiltered && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
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
            {cases.map((item) => (
              <EtikCaseCard key={item.id} item={item} onOpenAction={setSelectedCase} />
            ))}
          </div>
        )}

        <EtikReportDialog
          open={isReportOpen}
          onOpenChange={setIsReportOpen}
          onSubmit={handleCreateCase}
        />

        <EtikActionDialog
          item={selectedCase}
          open={Boolean(selectedCase)}
          onOpenChange={(open) => !open && setSelectedCase(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </PageShell>
  );
}
