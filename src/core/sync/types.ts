export type OutboxStatus = "pending" | "syncing" | "synced" | "failed";

export interface OutboxOperation {
  id: string;
  idempotencyKey: string;
  action: string;
  module: "kas" | "kejadian" | "piket" | "roles" | "inventaris" | "persetujuan";
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  status: OutboxStatus;
  retryCount: number;
  lastError?: string;
}

export interface SyncEngineStatus {
  isOnline: boolean;
  pendingCount: number;
  failedCount: number;
  isSyncing: boolean;
  lastSyncedAt: string | null;
}
