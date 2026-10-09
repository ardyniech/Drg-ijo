import { developmentLogTypeLabel } from "../data/development-log";

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

interface EntryItemProps {
  entry: {
    type: string;
    scope: string | null;
    hash: string;
    subject: string;
    body: string[];
  };
}

export function DevelopmentLogItem({ entry: e }: EntryItemProps) {
  return (
    <li className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            TYPE_CHIP[e.type] ?? TYPE_CHIP.chore
          }`}
        >
          {developmentLogTypeLabel(e.type)}
        </span>
        {e.scope && <span className="font-mono text-[11px] text-muted-foreground">{e.scope}</span>}
        <span className="font-mono text-[11px] text-muted-foreground">{e.hash}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-foreground leading-snug">{e.subject}</p>
      {e.body.length > 0 && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
          {e.body.join("\n")}
        </p>
      )}
    </li>
  );
}
