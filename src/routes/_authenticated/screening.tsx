import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useMe } from "@/hooks/use-me";
import {
  useScreening,
  ScreeningFilters,
  ScreeningTable,
  ScreeningReviewDialog,
  UserScreeningView,
} from "@/modules/screening";

export const Route = createFileRoute("/_authenticated/screening")({
  head: () => ({
    meta: [
      { title: "Screening Calon Anggota — DRG App" },
      {
        name: "description",
        content: "Panel evaluasi dan screening berkas calon anggota komunitas DRG.",
      },
    ],
  }),
  component: ScreeningPage,
});

function ScreeningPage() {
  const { data: me } = useMe();
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

  const myApp = data.find((c) => c.email.toLowerCase() === me?.email?.toLowerCase());

  if (!me?.isAdmin) {
    return (
      <PageShell
        eyebrow="Dulur Anyar"
        title="Screening Pendaftaran Merapat"
        description={
          myApp
            ? "Status pengajuan dan evaluasi berkas perkenalan Anda di pangkalan DRG."
            : "Silakan isi kuesioner screening untuk merapat resmi jadi keluarga besar satu aspal."
        }
      >
        <UserScreeningView myApp={myApp} email={me?.email || ""} nama={me?.nama || ""} />
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Orientasi & Marwah Jalur"
      title="Screening Dulur Anyar Merapat"
      description="Kenalan santui calon dulur DRG: orientasi etika jalanan, masa pengenalan pangkalan, dan persaudaraan satu aspal."
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
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

      <ScreeningTable data={filtered} isLoading={isLoading} onSelect={setSelected} />

      <ScreeningReviewDialog app={selected} onClose={() => setSelected(null)} />
    </PageShell>
  );
}
