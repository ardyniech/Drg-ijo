import { CheckCircle2, Loader2, Circle, Sparkles } from "lucide-react";
import { roadmapPhases, roadmapData, type RoadmapPhase } from "../data/roadmap";

const statusMeta: Record<RoadmapPhase["status"], { icon: typeof Circle; className: string }> = {
  selesai: { icon: CheckCircle2, className: "text-emerald-600" },
  jalan: { icon: Loader2, className: "text-amber-600" },
  rencana: { icon: Circle, className: "text-muted-foreground" },
};

export function AboutRoadmap() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            Peta Pengembangan
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
            Sejauh Mana Kami Sudah Melangkah
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            Progres tiap fase dihitung otomatis dari modul dan fitur nyata dalam basis kode.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border/60 self-start sm:self-auto">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Auto-Sync Realtime: {roadmapData.source}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {roadmapPhases.map((phase) => {
          const meta = statusMeta[phase.status];
          const Icon = meta.icon;
          return (
            <div
              key={phase.phase}
              className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${meta.className}`} />
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {phase.phase}
                    </div>
                    <h3 className="font-display text-sm font-bold text-foreground">
                      {phase.title}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {phase.progress}%
                  </span>
                  {phase.completedItems !== undefined && (
                    <p className="text-[10px] text-muted-foreground">
                      {phase.completedItems}/{phase.totalItems} siap
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    phase.progress === 100 ? "bg-emerald-600" : "bg-primary"
                  }`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>

              <ul className="mt-3 space-y-1">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
