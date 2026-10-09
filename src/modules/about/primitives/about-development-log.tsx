import { useMemo, useState } from "react";
import { GitCommitHorizontal, Sparkles } from "lucide-react";
import { developmentLog, developmentLogTypeLabel } from "../data/development-log";

const TYPE_CHIP: Record<string, string> = {
  feat: "border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-200",
  fix: "border-rose-600/40 bg-rose-500/10 text-rose-800 dark:border-rose-400/30 dark:bg-rose-400/15 dark:text-rose-200",
  refactor:
    "border-indigo-600/40 bg-indigo-500/10 text-indigo-800 dark:border-indigo-400/30 dark:bg-indigo-400/15 dark:text-indigo-200",
  chore:
    "border-slate-500/40 bg-slate-500/10 text-slate-700 dark:border-slate-400/30 dark:bg-slate-400/15 dark:text-slate-200",
  ui: "border-amber-600/40 bg-amber-500/10 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-200",
  data: "border-sky-600/40 bg-sky-500/10 text-sky-800 dark:border-sky-400/30 dark:bg-sky-400/15 dark:text-sky-200",
  docs: "border-teal-600/40 bg-teal-500/10 text-teal-800 dark:border-teal-400/30 dark:bg-teal-400/15 dark:text-teal-200",
  security:
    "border-purple-600/40 bg-purple-500/10 text-purple-800 dark:border-purple-400/30 dark:bg-purple-400/15 dark:text-purple-200",
  perf: "border-orange-600/40 bg-orange-500/10 text-orange-800 dark:border-orange-400/30 dark:bg-orange-400/15 dark:text-orange-200",
  test: "border-lime-600/40 bg-lime-500/10 text-lime-800 dark:border-lime-400/30 dark:bg-lime-400/15 dark:text-lime-200",
};

const ALL_TYPES = Array.from(new Set(developmentLog.entries.map((e) => e.type)));

export function AboutDevelopmentLog() {
  const [filter, setFilter] = useState<string>("semua");

  const grouped = useMemo(() => {
    const filtered =
      filter === "semua"
        ? developmentLog.entries
        : developmentLog.entries.filter((e) => e.type === filter);
    const byDate = new Map<string, typeof filtered>();
    filtered.forEach((e) => {
      const list = byDate.get(e.date) ?? [];
      list.push(e);
      byDate.set(e.date, list);
    });
    return Array.from(byDate.entries());
  }, [filter]);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 max-w-2xl">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            Perubahan Development
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
            Kabar Perkembangan Terbaru
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
            Diperbarui otomatis dari riwayat pengembangan setiap aplikasi di-build, jadi setiap
            perubahan development langsung terpantau di sini tanpa disunting manual.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("semua")}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
            filter === "semua"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40"
          }`}
        >
          Semua
        </button>
        {ALL_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              filter === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            {developmentLogTypeLabel(t)}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {grouped.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada riwayat untuk kategori ini.</p>
        )}
        {grouped.map(([date, entries]) => (
          <div key={date}>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <GitCommitHorizontal className="h-3.5 w-3.5 text-primary" />
              {date}
              <span className="font-mono font-normal normal-case">· {entries.length} commit</span>
            </div>
            <ul className="space-y-2">
              {entries.map((e) => (
                <li
                  key={e.hash}
                  className="rounded-xl border border-border/80 bg-card p-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        TYPE_CHIP[e.type] ?? TYPE_CHIP.chore
                      }`}
                    >
                      {developmentLogTypeLabel(e.type)}
                    </span>
                    {e.scope && (
                      <span className="font-mono text-[11px] text-muted-foreground">{e.scope}</span>
                    )}
                    <span className="font-mono text-[11px] text-muted-foreground">{e.hash}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground leading-snug">
                    {e.subject}
                  </p>
                  {e.body.length > 0 && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                      {e.body.join("\n")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Sparkles className="h-3 w-3 text-primary" />
        Log ini dihasilkan otomatis melalui{" "}
        <code className="font-mono">scripts/gen-development-log.mjs</code> pada tiap build — tidak
        perlu diperbarui dengan tangan.
      </p>
    </section>
  );
}
