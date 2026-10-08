import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { UserRole } from "@/hooks/use-me";
import { enqueueOperation } from "@/core/sync";
import { MemberRoleRecord, RoleAuditLog } from "../types";
import { INITIAL_AUDIT_LOGS } from "./initial-roles";

const AUDIT_STORAGE_KEY = "drg_role_audit_logs_v1";

let inMemoryLogs: RoleAuditLog[] = [...INITIAL_AUDIT_LOGS];

export function getRoleAuditLogs(): RoleAuditLog[] {
  if (typeof window === "undefined") return inMemoryLogs;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(inMemoryLogs));
      return inMemoryLogs;
    }
    return JSON.parse(raw);
  } catch {
    return inMemoryLogs;
  }
}

export function appendRoleAuditLog(entry: RoleAuditLog) {
  const current = getRoleAuditLogs();
  const updated = [entry, ...current];
  inMemoryLogs = updated;
  if (typeof window !== "undefined") {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getMemberRoleRecords(): MemberRoleRecord[] {
  const users = LocalAuthClient.getUsers();
  return users.map((u) => ({
    id: u.id,
    nama: u.nama,
    email: u.email,
    no_hp: u.no_hp || "-",
    pangkalan: u.pangkalan || "Pangkalan Utama",
    role: u.role as UserRole,
    jenjang: u.jenjang || "calon",
    status: (u.status === "aktif" ? "aktif" : "pending_review") as MemberRoleRecord["status"],
    assignedAt: u.created_at,
  }));
}

export function assignMemberRole(
  targetUserId: string,
  newRole: UserRole,
  actor: { id: string; nama: string },
  skNumber?: string,
  notes?: string,
) {
  const users = LocalAuthClient.getUsers();
  const target = users.find((u) => u.id === targetUserId);
  if (!target) throw new Error("Pengguna tidak ditemukan");

  const fromRole = target.role as UserRole;
  LocalAuthClient.updateUser(targetUserId, { role: newRole });

  const auditEntry: RoleAuditLog = {
    id: `log-${Date.now()}`,
    targetUserId,
    targetUserName: target.nama,
    fromRole,
    toRole: newRole,
    changedBy: actor.id,
    changedByName: actor.nama,
    timestamp: new Date().toISOString(),
    skNumber: skNumber?.trim() || `SK-PENGURUS/${Date.now().toString().slice(-4)}`,
    notes: notes?.trim() || "Penetapan dan perubahan struktur peran pengurus komunitas.",
  };

  appendRoleAuditLog(auditEntry);
  enqueueOperation({
    idempotencyKey: `role-assign-${targetUserId}-${Date.now()}`,
    action: `Penetapan Peran (${newRole})`,
    module: "roles",
    payload: { targetUserId, fromRole, toRole: newRole, skNumber: auditEntry.skNumber },
  });

  return getMemberRoleRecords();
}
