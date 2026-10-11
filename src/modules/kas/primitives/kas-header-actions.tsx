import { BarChart3, Table as TableIcon, FileText } from "lucide-react";
import { KasExportModal } from "./kas-export-modal";
import { NewTxDialog } from "./new-tx-dialog";
import { Tx } from "../types";

export type KasViewMode = "dashboard" | "table" | "sk";

interface KasHeaderActionsProps {
  viewMode: KasViewMode;
  onViewModeChange: (mode: KasViewMode) => void;
  filteredRows: Tx[];
  canApprove: boolean;
}

export function KasHeaderActions({
  viewMode,
  onViewModeChange,
  filteredRows,
  canApprove,
}: KasHeaderActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-xl bg-muted/80 p-1 text-xs border border-border/50">
        <button
          onClick={() => onViewModeChange("dashboard")}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all duration-150 active:scale-95 cursor-pointer ${
            viewMode === "dashboard"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>Transparansi</span>
        </button>
        <button
          onClick={() => onViewModeChange("table")}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all duration-150 active:scale-95 cursor-pointer ${
            viewMode === "table"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <TableIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>Buku Kas</span>
        </button>
        <button
          onClick={() => onViewModeChange("sk")}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all duration-150 active:scale-95 cursor-pointer ${
            viewMode === "sk"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span className="hidden sm:inline">SK Kas Gotong Royong</span>
          <span className="sm:hidden">SK Kas</span>
        </button>
      </div>
      <KasExportModal rows={filteredRows} />
      {canApprove && <NewTxDialog />}
    </div>
  );
}
