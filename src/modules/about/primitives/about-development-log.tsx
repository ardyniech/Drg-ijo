import { useMemo, useState } from "react";
import { GitCommitHorizontal, Sparkles } from "lucide-react";
import { developmentLog, developmentLogTypeLabel } from "../data/development-log";
import { DevelopmentLogItem } from "./development-log-item";

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
                <DevelopmentLogItem key={e.hash} entry={e} />
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
