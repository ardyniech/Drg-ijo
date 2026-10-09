import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { roadmapPhases, type RoadmapPhase } from "../data/roadmap";

const statusMeta: Record<RoadmapPhase["status"], { icon: typeof Circle; className: string }> = {
  selesai: { icon: CheckCircle2, className: "text-success" },
  jalan: { icon: Loader2, className: "text-warn-foreground" },
  rencana: { icon: Circle, className: "text-muted-foreground" },
};

export function AboutRoadmap() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <div className="max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          Peta Pengembangan
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
          Sejauh Mana Kami Sudah Melangkah
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
          Perkiraan progres tiap fase, dari fondasi sampai rencana multi-perangkat.
        </p>
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
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {phase.progress}%
                </span>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
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
