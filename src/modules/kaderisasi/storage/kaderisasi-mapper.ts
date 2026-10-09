import { MemberKaderisasi, JenjangLevel } from "../types";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import {
  getStoredKasTransactions,
  getStoredPiketShifts,
} from "@/integrations/supabase/local-tx-store";
import { getEtikCases } from "@/modules/etik/storage/etik-storage";

export const PIKET_TARGET = 4;
export const COMPLIANCE_MONTHS = 6;

export function mapUsersToKaderisasi(): MemberKaderisasi[] {
  const users = LocalAuthClient.getUsers();
  const shifts = typeof window !== "undefined" ? getStoredPiketShifts() : [];
  const trx = typeof window !== "undefined" ? getStoredKasTransactions() : [];
  const etikCases = getEtikCases();

  const now = new Date();
  const monthKeys = Array.from({ length: COMPLIANCE_MONTHS }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  return users.map((u) => {
    const raw = (u.jenjang || "calon").toLowerCase();
    const currentLevel: JenjangLevel =
      raw === "purna" ? "Utama" : raw === "madya" ? "Madya" : raw === "muda" ? "Muda" : "Calon";
    const targetLevel: JenjangLevel =
      currentLevel === "Calon"
        ? "Muda"
        : currentLevel === "Muda"
          ? "Madya"
          : currentLevel === "Madya"
            ? "Utama"
            : "Kehormatan";

    const attendance = shifts.filter((s) => String(s.user_id) === u.id).length;

    const iuranMonths = new Set(
      trx
        .filter(
          (t) =>
            String(t.created_by) === u.id &&
            t.jenis === "masuk" &&
            t.status === "disetujui" &&
            typeof t.tanggal === "string" &&
            monthKeys.includes(String(t.tanggal).slice(0, 7)),
        )
        .map((t) => String(t.tanggal).slice(0, 7)),
    );
    const kasCompliancePercent =
      iuranMonths.size > 0 ? Math.round((iuranMonths.size / COMPLIANCE_MONTHS) * 100) : 0;

    const violations = etikCases.filter(
      (c) => c.reportedMemberId === u.id && (c.status === "sanctioned" || c.status === "resolved"),
    ).length;

    const attendanceScore = Math.min(100, Math.round((attendance / PIKET_TARGET) * 50));
    const kasScore = Math.round((kasCompliancePercent / 100) * 30);
    const conductScore = violations === 0 ? 20 : 0;
    const points = Math.min(100, attendanceScore + kasScore + conductScore);

    const req1Met = attendance >= PIKET_TARGET;
    const req2Met = kasCompliancePercent >= 80;
    const req3Met = violations === 0;

    const status: MemberKaderisasi["status"] =
      req1Met && req2Met && req3Met && attendance > 0
        ? "eligible"
        : attendance > 0 || kasCompliancePercent > 0
          ? "in_review"
          : "needs_improvement";

    return {
      id: u.id,
      memberId: u.nomor_anggota || `DRG-2026-${String(users.indexOf(u) + 1).padStart(3, "0")}`,
      fullName: u.nama,
      currentLevel,
      targetLevel,
      joinedAt: u.created_at.split("T")[0],
      piketAttendanceCount: attendance,
      kasCompliancePercent,
      points,
      status,
      requirements: [
        {
          id: "req-1",
          label: `Piket pantau pangkalan & satgas (target minimal ${PIKET_TARGET} shift)`,
          met: req1Met,
          score: Math.min(100, attendance * 25),
        },
        {
          id: "req-2",
          label: `Iuran kas aspal tertib (${COMPLIANCE_MONTHS} bulan terakhir)`,
          met: req2Met,
          score: kasCompliancePercent,
        },
        {
          id: "req-3",
          label: "Tertib lalu lintas & nihil pelanggaran etik jalur",
          met: req3Met,
          score: violations === 0 ? 100 : 0,
        },
      ],
    };
  });
}
