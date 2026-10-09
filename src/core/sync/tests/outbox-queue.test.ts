import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateBackoffDelay,
  generateIdempotencyKey,
  isEligibleForRetry,
  getEligiblePendingOps,
  markOpFailedWithBackoff,
  enqueueOperation,
  saveOutboxQueue,
  MAX_SYNC_RETRIES,
  MAX_BACKOFF_MS,
} from "../outbox-queue";

describe("Outbox Queue Engine & Backoff", () => {
  beforeEach(() => {
    saveOutboxQueue([]);
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("calculates exponential backoff delay correctly and caps at maximum", () => {
    expect(calculateBackoffDelay(0)).toBe(0);
    expect(calculateBackoffDelay(1)).toBe(1000);
    expect(calculateBackoffDelay(2)).toBe(2000);
    expect(calculateBackoffDelay(3)).toBe(4000);
    expect(calculateBackoffDelay(4)).toBe(8000);
    expect(calculateBackoffDelay(10)).toBe(MAX_BACKOFF_MS);
  });

  it("generates normalized idempotency keys", () => {
    const key = generateIdempotencyKey("Kas", "Tambah SK", "sk-123");
    expect(key).toBe("kas:tambah_sk:sk-123");
  });

  it("identifies eligible operations for retry based on time and status", () => {
    const now = Date.now();
    const pendingOp = enqueueOperation({
      idempotencyKey: "idem-pending",
      action: "Test",
      module: "kas",
      payload: {},
    });

    expect(isEligibleForRetry(pendingOp, now)).toBe(true);

    const updated = markOpFailedWithBackoff(pendingOp.id, "Network timeout");
    const failedOp = updated.find((o) => o.id === pendingOp.id)!;

    // Immediately after failure, nextRetryAt is in the future
    expect(isEligibleForRetry(failedOp, now)).toBe(false);

    // 2 seconds later (past 1s backoff), it becomes eligible
    expect(isEligibleForRetry(failedOp, now + 2000)).toBe(true);
  });

  it("does not retry operations exceeding max retry threshold", () => {
    const op = enqueueOperation({
      idempotencyKey: "idem-max-retry",
      action: "Test Exceed",
      module: "kejadian",
      payload: {},
    });

    let current = [op];
    for (let i = 0; i < MAX_SYNC_RETRIES; i++) {
      current = markOpFailedWithBackoff(op.id, "Err");
    }

    const exhaustedOp = current.find((o) => o.id === op.id)!;
    expect(exhaustedOp.retryCount).toBe(MAX_SYNC_RETRIES);
    expect(isEligibleForRetry(exhaustedOp, Date.now() + 9999999)).toBe(false);
  });

  it("retrieves only eligible pending operations in batch", () => {
    const op1 = enqueueOperation({
      idempotencyKey: "batch-1",
      action: "Op 1",
      module: "piket",
      payload: {},
    });
    enqueueOperation({
      idempotencyKey: "batch-2",
      action: "Op 2",
      module: "piket",
      payload: {},
    });

    const eligible = getEligiblePendingOps(10);
    expect(eligible.length).toBe(2);

    // After failure with backoff, eligible count drops to 1
    markOpFailedWithBackoff(op1.id, "Offline");
    const afterFail = getEligiblePendingOps(10);
    expect(afterFail.length).toBe(1);
    expect(afterFail[0].idempotencyKey).toBe("batch-2");
  });
});
