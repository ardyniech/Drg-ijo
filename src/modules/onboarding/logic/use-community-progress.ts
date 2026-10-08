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
        title: "Isi Kuesioner Kenalan Merapat",
        desc: "Kirim kuesioner dulur anyar untuk saling kenal dan evaluasi ramah oleh dewan pangkalan.",
        completed: hasSubmittedScreening,
        link: "/screening",
        actionText: "Mulai Kenalan",
      });
    }

    list.push(
      {
        id: "profile",
        title: "Lengkapi Profil Dulur",
        desc: "Isi pangkalan andalan, kontak darurat keluarga, dan plat nomor motor.",
        completed: hasCompletedProfile,
        link: "/profil",
        actionText: "Lengkapi Profil",
      },
      {
        id: "piket",
        title: "Pilih Jadwal Jaga Jalur",
        desc: "Ambil slot piket santui di basecamp untuk saling jaga sedulur di jalan.",
        completed: hasShifts,
        link: "/piket",
        actionText: "Pilih Jadwal Piket",
      },
      {
        id: "kas",
        title: "Pahami Kas Gotong Royong",
        desc: "Cek keterbukaan iuran sosial & santunan dulur saling bantu satu aspal.",
        completed: hasTransactions,
        link: "/kas",
        actionText: "Lihat Kas Seduluran",
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
