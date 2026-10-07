import { useState, useEffect, useCallback, useRef } from "react";
import { getOutboxQueue, updateOperationStatus, clearSyncedOperations } from "./outbox-storage";
import { SyncEngineStatus } from "./types";

export function useOutboxWorker() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [queueVersion, setQueueVersion] = useState(0);
  const isFlushing = useRef(false);

  const queue = getOutboxQueue();
  const pendingCount = queue.filter((i) => i.status === "pending" || i.status === "syncing").length;
  const failedCount = queue.filter((i) => i.status === "failed").length;

  const flushQueue = useCallback(async () => {
    if (isFlushing.current) return;
    const currentQueue = getOutboxQueue();
    const toSync = currentQueue.filter((i) => i.status === "pending" || i.status === "failed");
    if (toSync.length === 0) return;

    isFlushing.current = true;
    setIsSyncing(true);

    for (const op of toSync) {
      updateOperationStatus(op.id, "syncing");
      setQueueVersion((v) => v + 1);
      try {
        await new Promise((resolve) => setTimeout(resolve, 350));
        updateOperationStatus(op.id, "synced");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal sinkronisasi data";
        updateOperationStatus(op.id, "failed", msg);
      }
      setQueueVersion((v) => v + 1);
    }

    clearSyncedOperations();
    setLastSyncedAt(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
    setIsSyncing(false);
    isFlushing.current = false;
    setQueueVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [flushQueue]);

  const syncStatus: SyncEngineStatus = {
    isOnline,
    pendingCount,
    failedCount,
    isSyncing,
    lastSyncedAt,
  };

  return {
    syncStatus,
    flushQueue,
    queueVersion,
  };
}
