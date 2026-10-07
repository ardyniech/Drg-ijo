import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { MemberStatusType } from "../types";

interface MemberStatusBadgeProps {
  status: MemberStatusType;
  size?: "sm" | "default";
}

export function MemberStatusBadge({ status, size = "default" }: MemberStatusBadgeProps) {
  const isSmall = size === "sm";

  if (status === "aktif") {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 ${
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
        }`}
      >
        <CheckCircle2 className={isSmall ? "h-3 w-3" : "h-3.5 w-3.5"} />
        <span>Verified</span>
      </span>
    );
  }

  if (status === "pending_review") {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 ${
          isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
        }`}
      >
        <Clock className={isSmall ? "h-3 w-3" : "h-3.5 w-3.5"} />
        <span>Pending</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 ${
        isSmall ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <AlertCircle className={isSmall ? "h-3 w-3" : "h-3.5 w-3.5"} />
      <span>Nonaktif</span>
    </span>
  );
}
