import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { MOCK_SCREENING_QUESTIONS } from "./local-mock-data";
import { getStoredKasTransactions, getStoredPiketShifts } from "./local-tx-store";
import { KejadianStorage } from "@/modules/kejadian/storage/kejadian-storage";
import {
  getStoredScreeningApplications,
  getStoredScreeningAnswers,
  getStoredScreeningAuditLogs,
} from "./local-screening-store";
import { getAppliedMigrations, createBrowserMigrationContext } from "@/core/migrations";

export type TableResolverResult = { data: unknown[]; error: unknown };
export type TableResolverFn = (
  filterId: string | null,
  inIds: string[] | null,
) => TableResolverResult;

export const tableResolvers: Record<string, TableResolverFn> = {
  profiles: (filterId, inIds) => {
    const session = LocalAuthClient.getSession();
    const users = LocalAuthClient.getUsers();
    const currentUserId = filterId || session?.user?.id || users[0]?.id;
    const allProfiles = users.map((u) => ({
      id: u.id,
      nama: u.id === session?.user?.id ? (session?.user?.user_metadata?.nama ?? u.nama) : u.nama,
      email: u.email,
      no_hp: u.no_hp || null,
      alamat: u.alamat || null,
      bio: u.bio || "Driver Komunitas Riang Gembira.",
      foto_url: u.foto_url || null,
      role: u.role,
      jenjang: u.jenjang,
      status: u.status,
      tanggal_lahir: u.tanggal_lahir || null,
      jenis_kelamin: u.jenis_kelamin || null,
      golongan_darah: u.golongan_darah || null,
      plat_nomor: u.plat_nomor || null,
      jenis_kendaraan: u.jenis_kendaraan || null,
      merk_kendaraan: u.merk_kendaraan || null,
      nomor_stnk: u.nomor_stnk || null,
      pangkalan: u.pangkalan || "Pangkalan Utama DRG",
      nomor_anggota: u.nomor_anggota || `DRG-${u.id.slice(-4).toUpperCase()}`,
      kontak_darurat_nama: u.kontak_darurat_nama || null,
      kontak_darurat_hp: u.kontak_darurat_hp || null,
      kontak_darurat_hubungan: u.kontak_darurat_hubungan || null,
      notif_sos: u.notif_sos ?? true,
      notif_kas: u.notif_kas ?? true,
      notif_pengumuman: u.notif_pengumuman ?? true,
      notif_email: u.notif_email ?? false,
      created_at: u.created_at,
    }));
    if (inIds && inIds.length > 0) {
      return { data: allProfiles.filter((p) => inIds.includes(p.id)), error: null };
    }
    if (filterId) {
      const matched = allProfiles.find((p) => p.id === currentUserId);
      return { data: matched ? [matched] : [], error: null };
    }
    return { data: allProfiles, error: null };
  },

  kas_transactions: () => ({ data: getStoredKasTransactions(), error: null }),
  piket_shifts: () => ({ data: getStoredPiketShifts(), error: null }),

  kejadian: () => ({
    data: KejadianStorage.getIncidents().map((inc) => ({
      id: inc.id,
      tipe: inc.kategori,
      status: inc.status,
      deskripsi: inc.deskripsi,
      alamat_text: inc.lokasi_teks,
      dibuat_at: inc.created_at,
    })),
    error: null,
  }),

  screening_applications: () => ({ data: getStoredScreeningApplications(), error: null }),
  screening_answers: (filterId) => ({
    data: filterId ? getStoredScreeningAnswers(filterId) : [],
    error: null,
  }),
  screening_audit_log: (filterId) => ({
    data: filterId ? getStoredScreeningAuditLogs(filterId) : [],
    error: null,
  }),
  user_roles: () => ({
    data: [{ role: LocalAuthClient.getSession()?.user?.user_metadata?.role ?? "anggota" }],
    error: null,
  }),
  screening_questions_public: () => ({ data: MOCK_SCREENING_QUESTIONS, error: null }),
  schema_migrations: () => ({
    data: getAppliedMigrations(createBrowserMigrationContext()),
    error: null,
  }),
};

export function resolveLocalTableData(
  table: string,
  filterId: string | null = null,
  inIds: string[] | null = null,
): TableResolverResult {
  const resolver = tableResolvers[table];
  return resolver ? resolver(filterId, inIds) : { data: [], error: null };
}
