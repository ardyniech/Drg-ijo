import type { FeatureStatus } from "./types";

export const featureStatusMeta: Record<
  FeatureStatus,
  { label: string; dot: string; chip: string }
> = {
  siap: {
    label: "Siap dipakai",
    dot: "bg-emerald-600 dark:bg-emerald-400",
    chip: "border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-200",
  },
  sebagian: {
    label: "Sebagian / terbatas",
    dot: "bg-amber-500 dark:bg-amber-400",
    chip: "border-amber-600/40 bg-amber-500/15 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-200",
  },
  rencana: {
    label: "Belum ada / rencana",
    dot: "bg-muted-foreground",
    chip: "border-border bg-muted text-muted-foreground",
  },
};
