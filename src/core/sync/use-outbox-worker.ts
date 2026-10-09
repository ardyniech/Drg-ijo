import { useState, useEffect, useCallback, useRef } from "react";
import {
  getOutboxQueue,
  updateOperationStatus,
  clearSyncedOperations,
  getEligiblePendingOps,
  markOpFailedWithBackoff,
} from "./outbox-queue";
import { SyncEngineStatus, SyncPushResponse } from "./types";

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
    if (isFlushing.current || typeof window === "undefined" || !navigator.onLine) return;
    const toSync = getEligiblePendingOps(15);
    if (toSync.length === 0) return;

    isFlushing.current = true;
    setIsSyncing(true);

    toSync.forEach((op) => updateOperationStatus(op.id, "syncing"));
    setQueueVersion((v) => v + 1);

    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operations: toSync }),
      });

      if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
      const data = (await res.json()) as SyncPushResponse;

      if (data.success && Array.isArray(data.acknowledgedIds)) {
        data.acknowledgedIds.forEach((id) => updateOperationStatus(id, "synced"));
        clearSyncedOperations();
        setLastSyncedAt(
          new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        );
      } else {
        throw new Error("Gagal konfirmasi sinkronisasi dari server");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Koneksi ke server terputus";
      toSync.forEach((op) => markOpFailedWithBackoff(op.id, msg));
    } finally {
      setIsSyncing(false);
      isFlushing.current = false;
      setQueueVersion((v) => v + 1);
    }
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

  return { syncStatus, flushQueue, queueVersion };
}
