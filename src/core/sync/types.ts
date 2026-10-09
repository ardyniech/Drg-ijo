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
  nextRetryAt?: string;
}

export interface SyncPushResponse {
  success: boolean;
  acknowledgedIds: string[];
  serverTimestamp: string;
  errors?: Record<string, string>;
}

export interface SyncEngineStatus {
  isOnline: boolean;
  pendingCount: number;
  failedCount: number;
  isSyncing: boolean;
  lastSyncedAt: string | null;
}
