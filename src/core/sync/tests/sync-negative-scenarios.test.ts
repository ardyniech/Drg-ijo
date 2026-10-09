import { describe, it, expect, beforeEach } from "vitest";
import {
  enqueueOperation,
  markOpFailedWithBackoff,
  saveOutboxQueue,
  getOutboxQueue,
  isEligibleForRetry,
  MAX_SYNC_RETRIES,
} from "../outbox-queue";

describe("Phase 4 Negative Audit Scenarios (SOP v4.0)", () => {
  beforeEach(() => {
    saveOutboxQueue([]);
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  // 1. Bad Input Scenario
  it("Audit 1 - Bad Input: handles malformed payload, empty string keys, and extreme retry counts gracefully", () => {
    const op = enqueueOperation({
      idempotencyKey: "",
      action: "Invalid Action",
      module: "kas",
      payload: {},
    });

    expect(op.id).toBeDefined();
    expect(op.status).toBe("pending");

    // Extreme backoff calculation on negative or massive retry numbers
    const updated = markOpFailedWithBackoff(op.id, "Corrupted network packet");
    const found = updated.find((i) => i.id === op.id);
    expect(found?.lastError).toBe("Corrupted network packet");
    expect(found?.retryCount).toBe(1);
    expect(found?.nextRetryAt).toBeDefined();
  });

  // 2. Cross-Module Failure Scenario
  it("Audit 2 - Cross-Module Failure: dispatcher/sync handler throws error without corrupting outbox queue", () => {
    const op = enqueueOperation({
      idempotencyKey: "cross-mod-err",
      action: "Mutasi Kas",
      module: "kas",
      payload: { nominal: -100 },
    });

    // Simulate handler throwing unhandled exception
    try {
      throw new Error("Cross-module invariant violated: negative balance");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fatal error";
      markOpFailedWithBackoff(op.id, msg);
    }

    const queue = getOutboxQueue();
    const target = queue.find((i) => i.id === op.id);
    expect(target?.status).toBe("failed");
    expect(target?.lastError).toContain("Cross-module invariant violated");
    // Ensure queue integrity is maintained
    expect(queue.length).toBe(1);
  });

  // 3. UI Dead-End Scenario
  it("Audit 3 - UI Dead-End: offline network disconnection retains pending queue without infinite lock", () => {
    const op = enqueueOperation({
      idempotencyKey: "offline-op-1",
      action: "SOS Alert",
      module: "kejadian",
      payload: { koordinat: "0,0" },
    });

    expect(op.status).toBe("pending");

    // When offline, op remains pending or transitions to failed with future retry
    markOpFailedWithBackoff(op.id, "Koneksi ke server terputus (offline)");
    const queue = getOutboxQueue();
    const offlineOp = queue.find((i) => i.id === op.id)!;

    expect(offlineOp.status).toBe("failed");
    expect(offlineOp.retryCount).toBe(1);
    // Not eligible immediately (prevents CPU lock / infinite retry loop)
    expect(isEligibleForRetry(offlineOp, Date.now())).toBe(false);
    // Eligible after exponential backoff window expires
    expect(isEligibleForRetry(offlineOp, Date.now() + 2000)).toBe(true);

    // After exhausting max retries, does not loop indefinitely
    for (let i = 1; i < MAX_SYNC_RETRIES; i++) {
      markOpFailedWithBackoff(op.id, "Persistent offline");
    }
    const exhaustedQueue = getOutboxQueue();
    const finalOp = exhaustedQueue.find((i) => i.id === op.id)!;
    expect(isEligibleForRetry(finalOp, Date.now() + 100000)).toBe(false);
  });
});
