import { MigrationContext, SchemaMigrationRecord, MigrationStep } from "./types";

export const SCHEMA_MIGRATIONS_TABLE = "drg_schema_migrations_v1";

export function getAppliedMigrations(ctx: MigrationContext): SchemaMigrationRecord[] {
  const raw = ctx.getItem(SCHEMA_MIGRATIONS_TABLE);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.sort((a, b) => a.version - b.version) : [];
  } catch {
    return [];
  }
}

export function getNextBatchNumber(ctx: MigrationContext): number {
  const list = getAppliedMigrations(ctx);
  if (list.length === 0) return 1;
  const maxBatch = Math.max(...list.map((m) => m.batch || 1));
  return maxBatch + 1;
}

export function recordAppliedMigration(
  ctx: MigrationContext,
  record: SchemaMigrationRecord,
): SchemaMigrationRecord[] {
  const current = getAppliedMigrations(ctx);
  const filtered = current.filter((m) => m.version !== record.version);
  const updated = [...filtered, record].sort((a, b) => a.version - b.version);
  ctx.setItem(SCHEMA_MIGRATIONS_TABLE, JSON.stringify(updated));
  return updated;
}

export function removeAppliedMigration(
  ctx: MigrationContext,
  version: number,
): SchemaMigrationRecord[] {
  const current = getAppliedMigrations(ctx);
  const updated = current.filter((m) => m.version !== version);
  ctx.setItem(SCHEMA_MIGRATIONS_TABLE, JSON.stringify(updated));
  return updated;
}

export function computeMigrationChecksum(step: MigrationStep): string {
  const str = `${step.version}:${step.name}:${step.description}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `sha1_${Math.abs(hash).toString(16)}`;
}
