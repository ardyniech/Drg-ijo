import { useMemo } from "react";
import type { CommunityMission } from "@/shared/models/dashboard";

interface ProgressParams {
  hasSubmittedScreening?: boolean;
  hasCompletedProfile: boolean;
  hasShifts: boolean;
  hasTransactions: boolean;
  role: string | null;
}

export function useCommunityProgress({
  hasSubmittedScreening = false,
  hasCompletedProfile,
  hasShifts,
  hasTransactions,
  role,
}: ProgressParams) {
  const missions: CommunityMission[] = useMemo(() => {
    const list: CommunityMission[] = [];

    // Only show screening mission if user hasn't submitted yet, or if they are a driver/anggota
    if (role === "driver" || role === "anggota") {
      list.push({
        id: "screening",
        title: "Isi Kuesioner Screening",
        desc: "Kirim kuesioner pendaftaran untuk evaluasi berkas resmi oleh kaderisasi.",
        completed: hasSubmittedScreening,
        link: "/screening",
        actionText: "Mulai Screening",
      });
    }

    list.push(
      {
        id: "profile",
        title: "Lengkapi Profil Driver",
        desc: "Isi nama pangkalan, nomor darurat, dan nomor plat kendaraan.",
        completed: hasCompletedProfile,
        link: "/profil",
        actionText: "Lengkapi Profil",
      },
      {
        id: "piket",
        title: "Pilih Jadwal Piket Satgas",
        desc: "Ambil slot piket untuk menjaga keamanan rekan sesama driver.",
        completed: hasShifts,
        link: "/piket",
        actionText: "Ambil Slot Piket",
      },
      {
        id: "kas",
        title: "Transparansi Kas Komunitas",
        desc: "Pahami iuran sosial dan simpanan koperasi saling bantu.",
        completed: hasTransactions,
        link: "/kas",
        actionText: "Lihat Buku Kas",
      },
    );

    return list;
  }, [hasSubmittedScreening, hasCompletedProfile, hasShifts, hasTransactions, role]);

  const completedCount = missions.filter((m) => m.completed).length;
  const currentLevel = completedCount + 1;
  const nextMission = missions.find((m) => !m.completed) ?? null;
  const progressPercent =
    missions.length > 0 ? Math.round((completedCount / missions.length) * 100) : 0;

  return {
    missions,
    completedCount,
    currentLevel,
    nextMission,
    progressPercent,
    isFullyOnboarded: completedCount === missions.length,
    roleTitle: role ? role.toUpperCase() : "ANGGOTA",
  };
}
