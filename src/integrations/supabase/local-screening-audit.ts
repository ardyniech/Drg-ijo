import { ScreeningAuditItem } from "@/modules/screening/types";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";

export const AUDIT_KEY = "drg_screening_audit_v2";

export function getStoredScreeningAuditLogs(appId: string): ScreeningAuditItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[appId] ?? [];
  } catch {
    return [];
  }
}

export function addScreeningAuditLog(
  appId: string,
  oldStatus: string,
  newStatus: string,
  note: string,
) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const current = all[appId] ?? [];

    const session = LocalAuthClient.getSession();
    const actorId = session?.user.id ?? "usr-anon";
    const actorName = session?.user.user_metadata?.nama || "Anggota DRG";

    const newAudit: ScreeningAuditItem = {
      id: `audit-${Date.now()}`,
      old_status: oldStatus,
      new_status: newStatus,
      note,
      created_at: new Date().toISOString(),
      actor_id: actorId,
      profiles: {
        nama: actorName,
      },
    };

    all[appId] = [newAudit, ...current];
    localStorage.setItem(AUDIT_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}
