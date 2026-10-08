import { Users, CheckCircle2, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberDirectoryStatsProps {
  total: number;
  verifiedCount: number;
  pendingCount: number;
  pangkalanCount: number;
  selectedStatus?: string;
  onSelectStatus?: (status: string) => void;
}

export function MemberDirectoryStats({
  total,
  verifiedCount,
  pendingCount,
  pangkalanCount,
  selectedStatus,
  onSelectStatus,
}: MemberDirectoryStatsProps) {
  const isClickable = Boolean(onSelectStatus);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <button
        type="button"
        disabled={!isClickable}
        onClick={() => onSelectStatus?.("all")}
        className={cn(
          "rounded-xl border p-3.5 flex items-center justify-between text-left transition-all",
          "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60",
          isClickable && "hover:border-primary/50 cursor-pointer shadow-xs",
          selectedStatus === "all" && "ring-2 ring-primary/40 border-primary",
        )}
      >
        <div>
          <p className="text-[11px] text-muted-foreground font-medium">Total Sedulur</p>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {total}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Users className="h-4 w-4" />
        </div>
      </button>

      <button
        type="button"
        disabled={!isClickable}
        onClick={() => onSelectStatus?.("aktif")}
        className={cn(
          "rounded-xl border p-3.5 flex items-center justify-between text-left transition-all",
          "border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20",
          isClickable && "hover:border-emerald-500 cursor-pointer shadow-xs",
          selectedStatus === "aktif" && "ring-2 ring-emerald-500/50 border-emerald-500",
        )}
      >
        <div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            Sah Satu Aspal
          </p>
          <p className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300 tabular-nums">
            {verifiedCount}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      </button>

      <button
        type="button"
        disabled={!isClickable}
        onClick={() => onSelectStatus?.("pending_review")}
        className={cn(
          "rounded-xl border p-3.5 flex items-center justify-between text-left transition-all",
          "border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20",
          isClickable && "hover:border-amber-500 cursor-pointer shadow-xs",
          selectedStatus === "pending_review" && "ring-2 ring-amber-500/50 border-amber-500",
        )}
      >
        <div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Menunggu PIC</p>
          <p className="text-xl font-bold font-mono text-amber-700 dark:text-amber-300 tabular-nums">
            {pendingCount}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-600">
          <Clock className="h-4 w-4" />
        </div>
      </button>

      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3.5 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground font-medium">Basis Pangkalan</p>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
            {pangkalanCount}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
          <MapPin className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
