import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import {
  useKaderisasi,
  KaderisasiCard,
  KaderisasiEvalDialog,
  KaderisasiFilters,
} from "@/modules/kaderisasi";
import { Bike, Shield, Flame, Crown, RotateCcw } from "lucide-react";
import { OJOL_JENJANG_REGISTRY } from "@/lib/ojol-jenjang";

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

  const stages = [
    { ...OJOL_JENJANG_REGISTRY.calon, icon: Bike, step: "1" },
    { ...OJOL_JENJANG_REGISTRY.muda, icon: Shield, step: "2" },
    { ...OJOL_JENJANG_REGISTRY.madya, icon: Flame, step: "3" },
    { ...OJOL_JENJANG_REGISTRY.purna, icon: Crown, step: "4" },
  ];

  return (
    <PageShell
      title="Tingkat Aspal & Seduluran DRG"
      description="Jenjang karir khas driver ojol santui di jalan. Pantau poin solidaritas aspal, jam terbang piket pangkalan, dan rembug kenaikan tingkat."
    >
      <div className="space-y-6">
        {/* Horizontal Tier Guide: Bahasa Khas Ojol Aspal Santui */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isSelected = levelFilter === stage.kaderisasiLevel;
            return (
              <div
                key={stage.key}
                onClick={() => setLevelFilter(isSelected ? "all" : stage.kaderisasiLevel)}
                className={`cursor-pointer rounded-2xl border p-3.5 transition-all shadow-2xs ${
                  isSelected
                    ? "ring-2 ring-primary border-primary bg-primary/5"
                    : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-xl border ${stage.badgeColor} ${stage.borderClass}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Tahap {stage.step}
                  </span>
                </div>
                <div className="mt-2.5">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    {stage.title}
                  </h4>
                  <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {stage.nickname}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2 leading-tight">
                    "{stage.roadQuote}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>

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
