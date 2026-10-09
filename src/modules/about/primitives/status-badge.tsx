import { cn } from "@/lib/utils";
import { featureStatusMeta, type FeatureStatus } from "../data/feature-tree";

export function StatusBadge({ status, className }: { status: FeatureStatus; className?: string }) {
  const meta = featureStatusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        meta.chip,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
