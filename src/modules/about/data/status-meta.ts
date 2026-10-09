import type { FeatureStatus } from "./types";

export const featureStatusMeta: Record<
  FeatureStatus,
  { label: string; dot: string; chip: string }
> = {
  siap: {
    label: "Siap dipakai",
    dot: "bg-success",
    chip: "border-success/30 bg-success/10 text-success-foreground",
  },
  sebagian: {
    label: "Sebagian / terbatas",
    dot: "bg-warn",
    chip: "border-warn/40 bg-warn/15 text-warn-foreground",
  },
  rencana: {
    label: "Belum ada / rencana",
    dot: "bg-muted-foreground",
    chip: "border-border bg-muted text-muted-foreground",
  },
};
