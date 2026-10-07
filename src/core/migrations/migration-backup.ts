import { MigrationContext } from "./types";

export const SNAPSHOT_PREFIX = "drg_schema_backup_";
const MAX_SAVED_SNAPSHOTS = 3;

export const MANAGED_SCHEMA_KEYS = [
  "drg_local_users_v1",
  "drg_local_session_v1",
  "drg_outbox_queue_v1",
  "drg_approvals_data_v1",
  "drg_role_audit_logs_v1",
  "drg_kas_transactions_v1",
  "drg_incident_records_v1",
  "drg_piket_schedule_v1",
  "drg_inventaris_data_v1",
  "drg_screening_apps_v2",
  "drg_screening_answers_v2",
  "drg_screening_audit_v2",
] as const;

export interface SnapshotData {
  timestamp: string;
  sourceVersion: number;
  records: Record<string, string>;
  checksum: number;
}

function calculateSimpleHash(data: Record<string, string>): number {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function createSafetySnapshot(
  ctx: MigrationContext,
  sourceVersion: number,
  targetVersion: number,
): string {
  const snapshotKey = `${SNAPSHOT_PREFIX}v${sourceVersion}_to_v${targetVersion}_${Date.now()}`;
  const records: Record<string, string> = {};

  MANAGED_SCHEMA_KEYS.forEach((key) => {
    const val = ctx.getItem(key);
    if (val !== null) records[key] = val;
  });

  const payload: SnapshotData = {
    timestamp: new Date().toISOString(),
    sourceVersion,
    records,
    checksum: calculateSimpleHash(records),
  };

  ctx.setItem(snapshotKey, JSON.stringify(payload));
  pruneOldSnapshots(ctx);
  return snapshotKey;
}

export function restoreSafetySnapshot(ctx: MigrationContext, snapshotKey: string): boolean {
  const raw = ctx.getItem(snapshotKey);
  if (!raw) return false;

  try {
    const parsed: SnapshotData = JSON.parse(raw);
    if (!parsed.records) return false;

    Object.entries(parsed.records).forEach(([key, value]) => {
      ctx.setItem(key, value);
    });

    return true;
  } catch (err) {
    console.error("[MigrationBackup] Gagal memulihkan snapshot", err);
    return false;
  }
}

function pruneOldSnapshots(ctx: MigrationContext): void {
  try {
    const allKeys = ctx.getAllKeys();
    const snapshotKeys = allKeys
      .filter((k) => k.startsWith(SNAPSHOT_PREFIX))
      .sort((a, b) => b.localeCompare(a));

    if (snapshotKeys.length > MAX_SAVED_SNAPSHOTS) {
      snapshotKeys.slice(MAX_SAVED_SNAPSHOTS).forEach((k) => ctx.removeItem(k));
    }
  } catch (e) {
    console.warn("[MigrationBackup] Gagal merapikan cadangan lama", e);
  }
}
