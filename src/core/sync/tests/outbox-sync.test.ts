import { describe, it, expect, beforeEach } from "vitest";
import {
  enqueueOperation,
  getOutboxQueue,
  updateOperationStatus,
  clearSyncedOperations,
} from "../outbox-storage";

describe("Outbox Sync Engine", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("should enqueue a new operation with pending status and idempotency key", () => {
    const op = enqueueOperation({
      idempotencyKey: "test-idem-001",
      action: "Pencatatan Kas",
      module: "kas",
      payload: { jumlah: 50000, ledger: "sosial" },
    });

    expect(op.status).toBe("pending");
    expect(op.idempotencyKey).toBe("test-idem-001");
    expect(op.retryCount).toBe(0);

    const duplicate = enqueueOperation({
      idempotencyKey: "test-idem-001",
      action: "Pencatatan Kas",
      module: "kas",
      payload: { jumlah: 50000, ledger: "sosial" },
    });
    expect(duplicate.id).toBe(op.id);
  });

  it("should update operation status and handle retry count on failure", () => {
    const op = enqueueOperation({
      idempotencyKey: "test-idem-002",
      action: "Lapor Insiden",
      module: "kejadian",
      payload: { kategori: "darurat" },
    });

    const updated = updateOperationStatus(op.id, "failed", "Koneksi timeout");
    const failedOp = updated.find((i) => i.id === op.id);
    expect(failedOp?.status).toBe("failed");
    expect(failedOp?.retryCount).toBe(1);
    expect(failedOp?.lastError).toBe("Koneksi timeout");
  });

  it("should purge synced operations properly", () => {
    const op1 = enqueueOperation({
      idempotencyKey: "test-idem-003",
      action: "Piket",
      module: "piket",
      payload: { shift: "pagi" },
    });
    updateOperationStatus(op1.id, "synced");
    const remaining = clearSyncedOperations();
    expect(remaining.find((i) => i.id === op1.id)).toBeUndefined();
  });
});
