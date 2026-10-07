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

export function resolveLocalTableData(
  table: string,
  filterId: string | null,
  inIds: string[] | null,
) {
  const session = LocalAuthClient.getSession();
  const users = LocalAuthClient.getUsers();
  const currentUserId = filterId || session?.user?.id || users[0]?.id;

  if (table === "profiles") {
    const allProfiles = users.map((u) => ({
      id: u.id,
      nama: u.id === session?.user?.id ? (session?.user?.user_metadata?.nama ?? u.nama) : u.nama,
      pangkalan: "Pangkalan Utama DRG",
      foto_url: null,
      role: u.role,
      jenjang: u.jenjang,
      status: u.status,
      bio: "Driver Komunitas Riang Gembira.",
      notif_sos: true,
      notif_kas: true,
      notif_pengumuman: true,
      notif_email: false,
      created_at: u.created_at,
    }));
    if (inIds && inIds.length > 0) {
      return { data: allProfiles.filter((p) => inIds!.includes(p.id)), error: null };
    }
    if (filterId) {
      const matched = allProfiles.find((p) => p.id === currentUserId);
      return { data: matched ? [matched] : [], error: null };
    }
    return { data: allProfiles, error: null };
  }

  if (table === "kas_transactions") return { data: getStoredKasTransactions(), error: null };
  if (table === "piket_shifts") return { data: getStoredPiketShifts(), error: null };

  if (table === "kejadian") {
    const incidents = KejadianStorage.getIncidents().map((inc) => ({
      id: inc.id,
      tipe: inc.kategori,
      status: inc.status,
      deskripsi: inc.deskripsi,
      alamat_text: inc.lokasi_teks,
      dibuat_at: inc.created_at,
    }));
    return { data: incidents, error: null };
  }

  if (table === "screening_applications") {
    return { data: getStoredScreeningApplications(), error: null };
  }

  if (table === "screening_answers" && filterId) {
    return { data: getStoredScreeningAnswers(filterId), error: null };
  }

  if (table === "screening_audit_log" && filterId) {
    return { data: getStoredScreeningAuditLogs(filterId), error: null };
  }

  if (table === "user_roles") {
    const role = session?.user?.user_metadata?.role ?? "anggota";
    return { data: [{ role }], error: null };
  }

  if (table === "screening_questions_public") {
    return { data: MOCK_SCREENING_QUESTIONS, error: null };
  }

  if (table === "schema_migrations") {
    const ctx = createBrowserMigrationContext();
    return { data: getAppliedMigrations(ctx), error: null };
  }

  return { data: [], error: null };
}
