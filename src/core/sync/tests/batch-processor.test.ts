import { describe, it, expect } from "vitest";
import { aggregateIncidentUpdates, shouldBatchIncidents } from "../batch-processor";
import { OutboxOperation } from "../types";

describe("Incident Sync Batch Processor", () => {
  it("should not trigger batching when fewer than 2 incident operations exist", () => {
    const singleOp: OutboxOperation[] = [
      {
        id: "op-1",
        idempotencyKey: "key-1",
        action: "create_sos",
        module: "kejadian",
        payload: { incidentId: "inc-1", status: "aktif" },
        createdAt: "2026-10-12T00:00:00.000Z",
        updatedAt: "2026-10-12T00:00:00.000Z",
        status: "pending",
        retryCount: 0,
      },
    ];

    expect(shouldBatchIncidents(singleOp)).toBe(false);
  });

  it("should aggregate multiple updates for the same incident into a single merged payload", () => {
    const ops: OutboxOperation[] = [
      {
        id: "op-1",
        idempotencyKey: "key-1",
        action: "create_sos",
        module: "kejadian",
        payload: {
          incidentId: "inc-1",
          status: "aktif",
          kategori: "Kecelakaan",
        },
        createdAt: "2026-10-12T00:00:00.000Z",
        updatedAt: "2026-10-12T00:00:00.000Z",
        status: "pending",
        retryCount: 0,
      },
      {
        id: "op-2",
        idempotencyKey: "key-2",
        action: "update_status",
        module: "kejadian",
        payload: {
          incidentId: "inc-1",
          status: "ditangani",
          responderId: "driver-88",
        },
        createdAt: "2026-10-12T00:01:00.000Z",
        updatedAt: "2026-10-12T00:01:00.000Z",
        status: "pending",
        retryCount: 0,
      },
      {
        id: "op-3",
        idempotencyKey: "key-3",
        action: "create_kas",
        module: "kas",
        payload: { amount: 50000 },
        createdAt: "2026-10-12T00:02:00.000Z",
        updatedAt: "2026-10-12T00:02:00.000Z",
        status: "pending",
        retryCount: 0,
      },
    ];

    expect(shouldBatchIncidents(ops)).toBe(true);

    const batch = aggregateIncidentUpdates(ops);

    expect(batch.batchMode).toBe(true);
    expect(batch.totalOperations).toBe(2); // Only kejadian ops
    expect(batch.batchedTransactions.length).toBe(1); // 1 unique incident
    expect(batch.batchedTransactions[0].incidentId).toBe("inc-1");
    expect(batch.batchedTransactions[0].mergedPayload.status).toBe("ditangani");
    expect(batch.batchedTransactions[0].mergedPayload.kategori).toBe("Kecelakaan");
    expect(batch.batchedTransactions[0].mergedPayload.responderId).toBe("driver-88");
    expect(batch.originalOperationIds).toEqual(["op-1", "op-2"]);
  });

  it("should handle empty operations safely without throwing", () => {
    const batch = aggregateIncidentUpdates([]);
    expect(batch.totalOperations).toBe(0);
    expect(batch.batchedTransactions).toHaveLength(0);
    expect(shouldBatchIncidents([])).toBe(false);
  });
});
