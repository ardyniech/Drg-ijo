import { z } from "zod";
import { OutboxOperation } from "./types";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { generatePrefixedId } from "@/shared/utils/id-generator";

const OUTBOX_KEY = "drg_outbox_queue_v1";
let inMemoryQueue: OutboxOperation[] = [];

const OutboxOperationSchema = z.object({
  id: z.string(),
  idempotencyKey: z.string(),
  action: z.string(),
  module: z.enum(["kas", "kejadian", "piket", "roles", "inventaris", "persetujuan"]),
  payload: z.record(z.unknown()),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(["pending", "syncing", "synced", "failed"]),
  retryCount: z.number(),
  lastError: z.string().optional(),
});

export function getOutboxQueue(): OutboxOperation[] {
  const queue = safeReadStorage(OUTBOX_KEY, z.array(OutboxOperationSchema), inMemoryQueue);
  inMemoryQueue = queue;
  return queue;
}

export function saveOutboxQueue(queue: OutboxOperation[]) {
  inMemoryQueue = queue;
  safeWriteStorage(OUTBOX_KEY, queue);
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
    id: generatePrefixedId("op"),
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
