import { MigrationStep, MigrationContext } from "./types";

function enrichCollectionWithSopV4Metadata(
  ctx: MigrationContext,
  key: string,
  nowIso: string,
): void {
  const raw = ctx.getItem(key);
  if (!raw) return;

  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return;

    let modified = false;
    const enriched = list.map((item, idx) => {
      if (!item || typeof item !== "object") return item;

      const record = { ...item };
      if (!record.id) {
        record.id = `${key.replace("drg_", "").replace("_v1", "")}-${Date.now()}-${idx}`;
        modified = true;
      }
      if (typeof record.version !== "number") {
        record.version = 1;
        modified = true;
      }
      if (!record.updated_at) {
        record.updated_at = record.created_at || nowIso;
        modified = true;
      }
      if (record.deleted_at === undefined) {
        record.deleted_at = null;
        modified = true;
      }
      return record;
    });

    if (modified) {
      ctx.setItem(key, JSON.stringify(enriched));
    }
  } catch {
    // Abaikan jika bukan format valid
  }
}

export const MIGRATION_STEPS: MigrationStep[] = [
  {
    version: 1,
    name: "v1_base_schema_verification",
    description: "Memverifikasi struktur kunci dasar storage DRG",
    up: (ctx: MigrationContext) => {
      const usersRaw = ctx.getItem("drg_local_users_v1");
      if (!usersRaw) {
        // Jangan timpa jika belum ada, biarkan auth-client inisialisasi
        return;
      }
    },
  },
  {
    version: 2,
    name: "v2_normalize_array_keys",
    description: "Memastikan kunci array (antrean, audit, log) tersimpan sebagai list valid",
    up: (ctx: MigrationContext) => {
      ["drg_role_audit_logs_v1", "drg_outbox_queue_v1", "drg_approvals_data_v1"].forEach((k) => {
        const raw = ctx.getItem(k);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) ctx.setItem(k, JSON.stringify([]));
          } catch {
            ctx.setItem(k, JSON.stringify([]));
          }
        }
      });
    },
  },
  {
    version: 3,
    name: "v3_sop_v4_entity_integrity",
    description: "Standardisasi entitas lokal dengan versioning, timestamps, dan soft-delete",
    up: (ctx: MigrationContext) => {
      const nowIso = new Date().toISOString();
      const targetKeys = [
        "drg_local_users_v1",
        "drg_kas_transactions_v1",
        "drg_incident_records_v1",
        "drg_piket_schedule_v1",
        "drg_screening_apps_v2",
      ];
      targetKeys.forEach((key) => enrichCollectionWithSopV4Metadata(ctx, key, nowIso));
    },
  },
];
