import { z } from "zod";
import { ActivityLogEntry, ActivityModule } from "../types";
import type { UserRole } from "@/hooks/use-me";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { generatePrefixedId } from "@/shared/utils/id-generator";

const STORAGE_KEY = "drg_system_activity_logs_v1";
const MAX_LOGS = 150;

const userRoles = [
  "ketua",
  "sekretaris",
  "bendahara",
  "admin",
  "super_admin",
  "korlap",
  "satgas",
  "dewan_etik",
  "anggota",
  "driver",
] as const satisfies readonly UserRole[];

const activityModules = [
  "roles",
  "kas",
  "kejadian",
  "piket",
  "notulen",
  "etik",
  "persetujuan",
  "auth",
  "anggota",
  "organisasi",
] as const satisfies readonly ActivityModule[];

const ActivityLogSchema = z.object({
  id: z.string(),
  actorId: z.string(),
  actorName: z.string(),
  actorRole: z.enum(userRoles),
  action: z.string(),
  module: z.enum(activityModules),
  description: z.string(),
  targetId: z.string().optional(),
  timestamp: z.string(),
});

const INITIAL_ACTIVITY_LOGS: ActivityLogEntry[] = [];

let inMemoryLogs: ActivityLogEntry[] = [...INITIAL_ACTIVITY_LOGS];

export function resetActivityLogs(): void {
  inMemoryLogs = [];
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getActivityLogs(): ActivityLogEntry[] {
  const logs = safeReadStorage(STORAGE_KEY, z.array(ActivityLogSchema), inMemoryLogs);
  inMemoryLogs = logs;
  return logs;
}

export function recordActivityLog(entry: Omit<ActivityLogEntry, "id" | "timestamp">) {
  const current = getActivityLogs();
  const newEntry: ActivityLogEntry = {
    ...entry,
    actorId: entry.actorId || "usr-anon",
    actorName: (entry.actorName || "Anggota DRG").trim(),
    action: (entry.action || "Aktivitas Organisasi").trim(),
    description: (entry.description || "").trim(),
    id: generatePrefixedId("act"),
    timestamp: new Date().toISOString(),
  };
  const updated = [newEntry, ...current].slice(0, MAX_LOGS);
  inMemoryLogs = updated;
  safeWriteStorage(STORAGE_KEY, updated);
  return updated;
}
