export const BACKUP_STORAGE_KEYS = [
  "drg_local_users_v1",
  "drg_local_session_v1",
  "drg_kas_tx_v2",
  "drg_piket_shifts_v2",
  "drg_shelters_v1",
  "drg_etik_cases_v1",
  "drg_incidents_data",
  "drg_inventaris_records",
  "drg_notulen_records",
  "drg_approvals_data_v1",
  "drg_role_audit_logs_v1",
  "drg_system_activity_logs_v1",
  "drg_screening_apps_v2",
  "drg_screening_answers_v2",
  "drg_screening_audit_v2",
  "drg_kaderisasi_data_v2",
  "drg_outbox_queue_v1",
];

export interface BackupPayload {
  app: "DRG_COMMUNITY_APP";
  version: "1.0.0";
  timestamp: string;
  recordCount: number;
  data: Record<string, string>;
}

export function hasLocalAppData(): boolean {
  if (typeof window === "undefined" || !window.localStorage) return false;
  return BACKUP_STORAGE_KEYS.some((key) => {
    try {
      const val = localStorage.getItem(key);
      if (!val) return false;
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.length > 0;
      return true;
    } catch {
      return false;
    }
  });
}
