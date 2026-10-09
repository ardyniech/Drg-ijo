import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import {
  useKaderisasi,
  KaderisasiCard,
  KaderisasiEvalDialog,
  KaderisasiFilters,
} from "@/modules/kaderisasi";
import { Bike, RotateCcw } from "lucide-react";
import { KaderisasiTierGuide } from "@/modules/kaderisasi/primitives/kaderisasi-tier-guide";

export const Route = createFileRoute("/_authenticated/kaderisasi")({
  component: KaderisasiPage,
});

function KaderisasiPage() {
  const {
    list,
    search,
    setSearch,
    levelFilter,
    setLevelFilter,
    selectedMember,
    setSelectedMember,
    handlePromote,
    handleReject,
  } = useKaderisasi();

  const isFiltered = Boolean(search || levelFilter !== "all");

  return (
    <PageShell
      title="Tingkat Aspal & Seduluran DRG"
      description="Jenjang karir khas driver ojol santui di jalan. Pantau poin solidaritas aspal, jam terbang piket pangkalan, dan rembug kenaikan tingkat."
    >
      <div className="space-y-6">
        <KaderisasiTierGuide levelFilter={levelFilter} setLevelFilter={setLevelFilter} />

        <KaderisasiFilters
          search={search}
          onSearchChange={setSearch}
          levelFilter={levelFilter}
          onLevelFilterChange={setLevelFilter}
        />

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
            <Bike className="h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              Tidak Ada Dulur Pada Antrean Ini
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {isFiltered
                ? "Tidak ada dulur yang cocok dengan kata kunci atau filter tingkat aspal."
                : "Belum ada dulur yang masuk antrean musyawarah kenaikan tingkat."}
            </p>
            {isFiltered && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setLevelFilter("all");
                }}
                className="mt-4 gap-1.5 rounded-xl text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filter Aspal
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {list.map((item) => (
              <KaderisasiCard key={item.id} item={item} onEvaluate={setSelectedMember} />
            ))}
          </div>
        )}

        <KaderisasiEvalDialog
          member={selectedMember}
          open={Boolean(selectedMember)}
          onOpenChange={(open) => !open && setSelectedMember(null)}
          onPromote={handlePromote}
          onReject={handleReject}
        />
      </div>
    </PageShell>
  );
}
