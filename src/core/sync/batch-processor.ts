import { OutboxOperation } from "./types";

export interface BatchedIncidentTransaction {
  incidentId: string;
  operations: OutboxOperation[];
  mergedPayload: Record<string, unknown>;
  timestamp: string;
}

export interface IncidentBatchPayload {
  batchMode: true;
  createdAt: string;
  totalOperations: number;
  batchedTransactions: BatchedIncidentTransaction[];
  originalOperationIds: string[];
}

/**
 * Aggregates pending incident updates into cohesive batches.
 * Reduces Firestore write counts and client battery consumption.
 */
export function aggregateIncidentUpdates(operations: OutboxOperation[]): IncidentBatchPayload {
  const incidentOps = operations.filter((op) => op.module === "kejadian");
  const grouped = new Map<string, OutboxOperation[]>();

  for (const op of incidentOps) {
    const incId = (op.payload?.incidentId as string) || (op.payload?.id as string) || op.id;
    const existing = grouped.get(incId) || [];
    existing.push(op);
    grouped.set(incId, existing);
  }

  const batchedTransactions: BatchedIncidentTransaction[] = [];

  for (const [incidentId, ops] of grouped.entries()) {
    const sorted = [...ops].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const mergedPayload: Record<string, unknown> = {};
    for (const op of sorted) {
      Object.assign(mergedPayload, op.payload);
    }

    batchedTransactions.push({
      incidentId,
      operations: sorted,
      mergedPayload,
      timestamp: new Date().toISOString(),
    });
  }

  return {
    batchMode: true,
    createdAt: new Date().toISOString(),
    totalOperations: incidentOps.length,
    batchedTransactions,
    originalOperationIds: incidentOps.map((op) => op.id),
  };
}

export function shouldBatchIncidents(operations: OutboxOperation[]): boolean {
  const incidentOps = operations.filter((op) => op.module === "kejadian");
  return incidentOps.length >= 2;
}
