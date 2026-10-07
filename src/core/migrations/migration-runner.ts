import { MigrationContext, MigrationResult } from "./types";
import { createSafetySnapshot, restoreSafetySnapshot } from "./migration-backup";
import { MIGRATION_STEPS } from "./migration-steps";
import {
  getAppliedMigrations,
  getNextBatchNumber,
  recordAppliedMigration,
  computeMigrationChecksum,
} from "./migration-storage";

export const SCHEMA_VERSION_KEY = "drg_schema_version_v1";
export const LATEST_TARGET_VERSION = 3;

export function createBrowserMigrationContext(): MigrationContext {
  return {
    getItem: (k) => (typeof window !== "undefined" ? localStorage.getItem(k) : null),
    setItem: (k, v) => typeof window !== "undefined" && localStorage.setItem(k, v),
    removeItem: (k) => typeof window !== "undefined" && localStorage.removeItem(k),
    getAllKeys: () => (typeof window !== "undefined" ? Object.keys(localStorage) : []),
  };
}

export function getCurrentSchemaVersion(ctx: MigrationContext): number {
  const applied = getAppliedMigrations(ctx);
  if (applied.length > 0) {
    return Math.max(...applied.map((m) => m.version));
  }
  const raw = ctx.getItem(SCHEMA_VERSION_KEY) || ctx.getItem("drg_storage_version_v1");
  const parsed = raw ? parseInt(raw, 10) : 0;
  return isNaN(parsed) ? 0 : parsed;
}

export async function runSchemaMigrations(
  customCtx?: MigrationContext,
  targetVersion: number = LATEST_TARGET_VERSION,
): Promise<MigrationResult> {
  const ctx = customCtx || createBrowserMigrationContext();
  const currentVersion = getCurrentSchemaVersion(ctx);

  if (currentVersion >= targetVersion) {
    return {
      success: true,
      fromVersion: currentVersion,
      toVersion: currentVersion,
      appliedVersions: [],
      batch: 0,
    };
  }

  const batch = getNextBatchNumber(ctx);
  const backupKey = createSafetySnapshot(ctx, currentVersion, targetVersion);
  const applied = getAppliedMigrations(ctx);
  const appliedSet = new Set(applied.map((a) => a.version));

  const pendingSteps = MIGRATION_STEPS.filter(
    (step) => step.version <= targetVersion && !appliedSet.has(step.version),
  ).sort((a, b) => a.version - b.version);

  const appliedVersions: number[] = [];

  for (const step of pendingSteps) {
    const startMs = Date.now();
    try {
      await Promise.resolve(step.up(ctx));
      const elapsed = Date.now() - startMs;
      appliedVersions.push(step.version);

      recordAppliedMigration(ctx, {
        version: step.version,
        name: step.name,
        batch,
        execution_time_ms: elapsed,
        checksum: computeMigrationChecksum(step),
        applied_at: new Date().toISOString(),
        status: "applied",
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[SchemaMigration] Gagal pada migrasi v${step.version} (${step.name}):`, err);

      restoreSafetySnapshot(ctx, backupKey);

      return {
        success: false,
        fromVersion: currentVersion,
        toVersion: currentVersion,
        appliedVersions,
        batch,
        backupKey,
        error: `Migration v${step.version} failed: ${errMsg}. Rolled back safely.`,
      };
    }
  }

  ctx.setItem(SCHEMA_VERSION_KEY, targetVersion.toString());
  ctx.setItem("drg_storage_version_v1", targetVersion.toString());

  return {
    success: true,
    fromVersion: currentVersion,
    toVersion: targetVersion,
    appliedVersions,
    batch,
    backupKey,
  };
}
