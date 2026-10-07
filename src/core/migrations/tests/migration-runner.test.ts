import { describe, it, expect, beforeEach } from "vitest";
import {
  runSchemaMigrations,
  getCurrentSchemaVersion,
  SCHEMA_VERSION_KEY,
  LATEST_TARGET_VERSION,
} from "../migration-runner";
import { getAppliedMigrations } from "../migration-storage";
import { verifySchemaIntegrity, autoHealCorruptedKeys } from "../migration-verifier";
import { restoreSafetySnapshot } from "../migration-backup";
import { MigrationContext } from "../types";

function createMockContext(initialStore: Record<string, string> = {}): MigrationContext {
  const store = { ...initialStore };
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    getAllKeys: () => Object.keys(store),
  };
}

describe("Database Schema Migration Utility", () => {
  let mockCtx: MigrationContext;

  beforeEach(() => {
    mockCtx = createMockContext({
      drg_kas_transactions_v1: JSON.stringify([
        { id: "tx-1", jumlah: 50000, jenis: "masuk", ledger: "sosial", status: "disetujui" },
      ]),
      drg_local_users_v1: JSON.stringify([
        {
          id: "user-1",
          email: "test@drg.id",
          nama: "Test Driver",
          role: "driver",
          status: "aktif",
        },
      ]),
    });
  });

  it("merekam riwayat migrasi pada tabel schema_migrations secara berurutan", async () => {
    expect(getCurrentSchemaVersion(mockCtx)).toBe(0);

    const result = await runSchemaMigrations(mockCtx, LATEST_TARGET_VERSION);

    expect(result.success).toBe(true);
    expect(result.batch).toBe(1);

    const applied = getAppliedMigrations(mockCtx);
    expect(applied.length).toBe(3);
    expect(applied[0].version).toBe(1);
    expect(applied[1].version).toBe(2);
    expect(applied[2].version).toBe(3);
    expect(applied[2].status).toBe("applied");
    expect(applied[2].checksum).toMatch(/^sha1_/);
    expect(applied[2].execution_time_ms).toBeGreaterThanOrEqual(0);
  });

  it("bersifat idempoten jika dijalankan berulang kali pada versi yang sama", async () => {
    mockCtx.setItem(SCHEMA_VERSION_KEY, LATEST_TARGET_VERSION.toString());

    const result = await runSchemaMigrations(mockCtx, LATEST_TARGET_VERSION);

    expect(result.success).toBe(true);
    expect(result.appliedVersions.length).toBe(0);
  });

  it("membuat snapshot cadangan otomatis sebelum migrasi berjalan", async () => {
    const result = await runSchemaMigrations(mockCtx, LATEST_TARGET_VERSION);

    expect(result.backupKey).toBeDefined();
    const snapshotRaw = mockCtx.getItem(result.backupKey!);
    expect(snapshotRaw).not.toBeNull();

    const snapshot = JSON.parse(snapshotRaw!);
    expect(snapshot.sourceVersion).toBe(0);
    expect(snapshot.records.drg_kas_transactions_v1).toBeDefined();
  });

  it("mampu memulihkan (rollback) data secara aman jika terjadi kegagalan", async () => {
    const originalKasData = mockCtx.getItem("drg_kas_transactions_v1");
    const result = await runSchemaMigrations(mockCtx, LATEST_TARGET_VERSION);
    expect(result.backupKey).toBeDefined();

    mockCtx.setItem("drg_kas_transactions_v1", JSON.stringify([{ id: "corrupt" }]));

    const restored = restoreSafetySnapshot(mockCtx, result.backupKey!);
    expect(restored).toBe(true);
    expect(mockCtx.getItem("drg_kas_transactions_v1")).toBe(originalKasData);
  });

  it("mendeteksi dan mengisolasi kunci data yang korup secara otomatis", () => {
    mockCtx.setItem("drg_incident_records_v1", "{invalid json data...");

    const reportBefore = verifySchemaIntegrity(mockCtx);
    expect(reportBefore.isHealthy).toBe(false);
    expect(reportBefore.corruptedKeys).toContain("drg_incident_records_v1");

    const healed = autoHealCorruptedKeys(mockCtx);
    expect(healed).toContain("drg_incident_records_v1");
    expect(mockCtx.getItem("drg_incident_records_v1")).toBeNull();

    const reportAfter = verifySchemaIntegrity(mockCtx);
    expect(reportAfter.isHealthy).toBe(true);
  });
});
