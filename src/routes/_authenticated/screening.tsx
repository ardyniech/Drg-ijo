import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import {
  useScreening,
  ScreeningFilters,
  ScreeningTable,
  ScreeningReviewDialog,
} from "@/modules/screening";

export const Route = createFileRoute("/_authenticated/screening")({
  head: () => ({
    meta: [
      { title: "Screening Calon Anggota — DRG App" },
      {
        name: "description",
        content: "Panel evaluasi dan screening berkas calon anggota komunitas DRG.",
      },
      { property: "og:title", content: "Screening Calon Anggota — DRG App" },
    ],
  }),
  component: ScreeningPage,
});

function ScreeningPage() {
  const {
    data,
    filtered,
    isLoading,
    selected,
    setSelected,
    q,
    setQ,
    statusFilter,
    setStatusFilter,
    verifFilter,
    setVerifFilter,
    exportCsv,
  } = useScreening();

  return (
    <PageShell
      eyebrow="PIC Kaderisasi"
      title="Screening Calon Anggota"
      description="Skor terkalkulasi dari bobot rahasia. Klik baris untuk review & putuskan."
      actions={
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={exportCsv}
            disabled={filtered.length === 0}
          >
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href="/daftar" target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1.5 h-4 w-4" /> Formulir Publik
            </a>
          </Button>
        </div>
      }
    >
      <ScreeningFilters
        q={q}
        onQueryChange={setQ}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        verifFilter={verifFilter}
        onVerifFilterChange={setVerifFilter}
        filteredCount={filtered.length}
        totalCount={data.length}
      />

      <ScreeningTable
        data={filtered}
        isLoading={isLoading}
        onSelect={setSelected}
      />

      <ScreeningReviewDialog
        app={selected}
        onClose={() => setSelected(null)}
      />
    </PageShell>
  );
}
