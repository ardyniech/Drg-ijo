import { OutboxOperation } from "./types";
import {
  getOutboxQueue,
  saveOutboxQueue,
  enqueueOperation,
  updateOperationStatus,
  clearSyncedOperations,
} from "./outbox-storage";

export const MAX_SYNC_RETRIES = 5;
export const BASE_BACKOFF_MS = 1000;
export const MAX_BACKOFF_MS = 30000;

export function calculateBackoffDelay(retryCount: number): number {
  if (retryCount <= 0) return 0;
  const backoff = BASE_BACKOFF_MS * Math.pow(2, retryCount - 1);
  return Math.min(backoff, MAX_BACKOFF_MS);
}

export function generateIdempotencyKey(module: string, action: string, entityId: string): string {
  const cleanModule = module.trim().toLowerCase();
  const cleanAction = action.trim().toLowerCase().replace(/\s+/g, "_");
  const cleanId = entityId.trim();
  return `${cleanModule}:${cleanAction}:${cleanId}`;
}

export function isEligibleForRetry(op: OutboxOperation, nowMs = Date.now()): boolean {
  if (op.status === "pending") return true;
  if (op.status === "failed") {
    if (op.retryCount >= MAX_SYNC_RETRIES) return false;
    if (!op.nextRetryAt) return true;
    return new Date(op.nextRetryAt).getTime() <= nowMs;
  }
  return false;
}

export function getEligiblePendingOps(maxBatch = 10): OutboxOperation[] {
  const queue = getOutboxQueue();
  const now = Date.now();
  return queue.filter((op) => isEligibleForRetry(op, now)).slice(0, maxBatch);
}

export function markOpFailedWithBackoff(id: string, error: string): OutboxOperation[] {
  const queue = getOutboxQueue();
  const target = queue.find((i) => i.id === id);
  const nextRetryCount = (target?.retryCount ?? 0) + 1;
  const delayMs = calculateBackoffDelay(nextRetryCount);
  const nextRetryAt = new Date(Date.now() + delayMs).toISOString();

  const updated = queue.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      status: "failed" as const,
      updatedAt: new Date().toISOString(),
      retryCount: nextRetryCount,
      lastError: error,
      nextRetryAt,
    };
  });
  saveOutboxQueue(updated);
  return updated;
}

export {
  getOutboxQueue,
  saveOutboxQueue,
  enqueueOperation,
  updateOperationStatus,
  clearSyncedOperations,
};
