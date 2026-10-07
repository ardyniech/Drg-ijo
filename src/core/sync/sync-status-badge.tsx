import { useOutboxWorker } from "./use-outbox-worker";
import { RefreshCw, CheckCircle2, AlertCircle, CloudOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SyncStatusBadge() {
  const { syncStatus, flushQueue } = useOutboxWorker();
  const { isOnline, pendingCount, failedCount, isSyncing, lastSyncedAt } = syncStatus;

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
        <CloudOff className="h-3 w-3 animate-pulse" />
        <span>Mode Offline</span>
        {pendingCount > 0 && (
          <span className="rounded bg-amber-500/20 px-1 font-mono text-[10px]">{pendingCount}</span>
        )}
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-600">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Sinkronisasi...</span>
      </div>
    );
  }

  if (failedCount > 0) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => flushQueue()}
        className="h-7 gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 text-[11px] font-medium text-rose-600 hover:bg-rose-500/20"
      >
        <AlertCircle className="h-3 w-3 text-rose-600" />
        <span>{failedCount} Gagal</span>
        <RefreshCw className="h-2.5 w-2.5 ml-0.5" />
      </Button>
    );
  }

  if (pendingCount > 0) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => flushQueue()}
        className="h-7 gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 text-[11px] font-medium text-amber-700 hover:bg-amber-500/20"
      >
        <RefreshCw className="h-3 w-3 animate-spin text-amber-600" />
        <span>{pendingCount} Tersimpan Lokal</span>
      </Button>
    );
  }

  return (
    <div
      title={lastSyncedAt ? `Terakhir sinkron pukul ${lastSyncedAt}` : "Data tersinkron otomatis"}
      className="hidden md:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
    >
      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
      <span>Tersinkronisasi</span>
    </div>
  );
}
