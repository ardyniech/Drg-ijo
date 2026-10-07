import { OutboxOperation } from "./types";

const OUTBOX_KEY = "drg_outbox_queue_v1";
let inMemoryQueue: OutboxOperation[] = [];

export function getOutboxQueue(): OutboxOperation[] {
  if (typeof window === "undefined") return inMemoryQueue;
  try {
    const raw = localStorage.getItem(OUTBOX_KEY);
    if (!raw) return inMemoryQueue;
    return JSON.parse(raw);
  } catch {
    return inMemoryQueue;
  }
}

export function saveOutboxQueue(queue: OutboxOperation[]) {
  inMemoryQueue = queue;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(OUTBOX_KEY, JSON.stringify(queue));
    } catch {
      // quota exceeded fallback
    }
  }
}

export function enqueueOperation(
  op: Omit<OutboxOperation, "id" | "status" | "retryCount" | "createdAt" | "updatedAt">,
): OutboxOperation {
  const queue = getOutboxQueue();
  const existing = queue.find((item) => item.idempotencyKey === op.idempotencyKey);
  if (existing) return existing;

  const now = new Date().toISOString();
  const newOp: OutboxOperation = {
    ...op,
    id: `op_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    retryCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const updated = [...queue, newOp];
  saveOutboxQueue(updated);
  return newOp;
}

export function updateOperationStatus(
  id: string,
  status: OutboxOperation["status"],
  error?: string,
): OutboxOperation[] {
  const queue = getOutboxQueue();
  const updated = queue.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      status,
      updatedAt: new Date().toISOString(),
      retryCount: status === "failed" ? item.retryCount + 1 : item.retryCount,
      lastError: error,
    };
  });
  saveOutboxQueue(updated);
  return updated;
}

export function clearSyncedOperations(): OutboxOperation[] {
  const queue = getOutboxQueue();
  const retained = queue.filter((item) => item.status !== "synced");
  saveOutboxQueue(retained);
  return retained;
}
