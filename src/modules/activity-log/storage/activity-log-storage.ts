import { z } from "zod";
import { ActivityLogEntry } from "../types";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { generatePrefixedId } from "@/shared/utils/id-generator";

const STORAGE_KEY = "drg_system_activity_logs_v1";
const MAX_LOGS = 150;

const ActivityLogSchema = z.object({
  id: z.string(),
  actorId: z.string(),
  actorName: z.string(),
  actorRole: z.string(),
  action: z.string(),
  module: z.string(),
  description: z.string(),
  timestamp: z.string(),
});

const INITIAL_ACTIVITY_LOGS: ActivityLogEntry[] = [
  {
    id: "act-1",
    actorId: "usr-ketua-01",
    actorName: "H. Hendra Wijaya",
    actorRole: "ketua",
    action: "Pengesahan SK Pengurus",
    module: "roles",
    description: "Menerbitkan SK-KETUA/DRG/02/2026 pengangkatan Sekretaris & Bendahara Jenderal.",
    timestamp: "2026-10-06T18:30:00Z",
  },
  {
    id: "act-2",
    actorId: "usr-sekretaris-01",
    actorName: "Siti Rahmawati",
    actorRole: "sekretaris",
    action: "Penerbitan Notulen Musyawarah",
    module: "notulen",
    description: "Mengesahkan Notulen Musyawarah Pleno Pangkalan Suhat & Sawojajar.",
    timestamp: "2026-10-06T17:15:00Z",
  },
  {
    id: "act-3",
    actorId: "usr-bendahara-01",
    actorName: "Ahmad Fauzi",
    actorRole: "bendahara",
    action: "Approval Pencairan Kas Sosial",
    module: "kas",
    description: "Menyerahkan santunan musibah kecelakaan Rp 1.500.000 kepada Bang Parjo.",
    timestamp: "2026-10-06T16:00:00Z",
  },
  {
    id: "act-4",
    actorId: "usr-etik-01",
    actorName: "Doni Iskandar",
    actorRole: "dewan_etik",
    action: "Mediasi & Sidang Disiplin",
    module: "etik",
    description: "Menyelesaikan mediasi sengketa selisih paham tarif pangkalan antardriver.",
    timestamp: "2026-10-06T14:20:00Z",
  },
  {
    id: "act-5",
    actorId: "usr-satgas-01",
    actorName: "Rudi Hartono",
    actorRole: "satgas",
    action: "Penanganan Sinyal SOS Darurat",
    module: "kejadian",
    description: "Merespon kejadian mogok rantai putus di Jl. Soekarno Hatta dan penawalan lokasi.",
    timestamp: "2026-10-06T12:00:00Z",
  },
  {
    id: "act-6",
    actorId: "usr-admin-01",
    actorName: "Admin Utama DRG",
    actorRole: "admin",
    action: "Persetujuan Verifikasi Akun",
    module: "persetujuan",
    description: "Memvalidasi berkas KTA dan plat nomor calon anggota driver baru.",
    timestamp: "2026-10-06T10:45:00Z",
  },
];

let inMemoryLogs: ActivityLogEntry[] = [...INITIAL_ACTIVITY_LOGS];

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
