import { MigrationContext, SchemaHealthReport } from "./types";
import { MANAGED_SCHEMA_KEYS } from "./migration-backup";
import { getCurrentSchemaVersion, LATEST_TARGET_VERSION } from "./migration-runner";
import { getAppliedMigrations } from "./migration-storage";

export function verifySchemaIntegrity(ctx: MigrationContext): SchemaHealthReport {
  const currentVersion = getCurrentSchemaVersion(ctx);
  const appliedMigrations = getAppliedMigrations(ctx);
  const corruptedKeys: string[] = [];
  let totalRecords = 0;

  MANAGED_SCHEMA_KEYS.forEach((key) => {
    const raw = ctx.getItem(key);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        totalRecords += parsed.length;
      } else if (parsed && typeof parsed === "object") {
        totalRecords += 1;
      }
    } catch {
      corruptedKeys.push(key);
    }
  });

  const latestApplied = appliedMigrations[appliedMigrations.length - 1];

  return {
    isHealthy: corruptedKeys.length === 0,
    currentVersion,
    targetVersion: LATEST_TARGET_VERSION,
    totalApplied: appliedMigrations.length,
    corruptedKeys,
    totalRecordsChecked: totalRecords,
    lastMigrationAt: latestApplied?.applied_at,
  };
}

export function autoHealCorruptedKeys(ctx: MigrationContext): string[] {
  const healed: string[] = [];
  MANAGED_SCHEMA_KEYS.forEach((key) => {
    const raw = ctx.getItem(key);
    if (!raw) return;

    try {
      JSON.parse(raw);
    } catch {
      const backupKey = `${key}_corrupted_snapshot_${Date.now()}`;
      ctx.setItem(backupKey, raw);
      ctx.removeItem(key);
      healed.push(key);
      console.warn(`[MigrationVerifier] Berhasil mengisolasi data korup pada key "${key}"`);
    }
  });
  return healed;
}
