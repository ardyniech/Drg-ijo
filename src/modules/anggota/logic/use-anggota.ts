import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SEED_MEMBERS } from "../storage/anggota-storage";
import { MemberRecord } from "../types";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";

export function useAnggota() {
  const [search, setSearch] = useState("");
  const [selectedPangkalan, setSelectedPangkalan] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");

  const query = useQuery({
    queryKey: ["anggota", "list"],
    queryFn: async (): Promise<MemberRecord[]> => {
      const extraUsers = LocalAuthClient.getUsers()
        .filter(
          (u) =>
            !SEED_MEMBERS.some(
              (s) => s.id === u.id || s.nama.toLowerCase() === u.nama.toLowerCase(),
            ),
        )
        .map((u, idx) => ({
          id: u.id,
          nama: u.nama,
          no_kta: `DRG-2026-${String(120 + idx).padStart(3, "0")}`,
          no_hp: u.no_hp || "08123456789",
          pangkalan: "Pangkalan Utama Suhat",
          role: (u.role || "driver") as MemberRecord["role"],
          jenjang: u.jenjang || "Pratama",
          status: (u.status === "aktif" ? "aktif" : "pending_review") as MemberRecord["status"],
          bergabung_sejak: new Date(u.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          plat_nomor: "N 2026 DRG",
          jenis_kendaraan: "Sepeda Motor",
        }));
      return [...SEED_MEMBERS, ...extraUsers];
    },
  });

  const resetFilters = () => {
    setSearch("");
    setSelectedPangkalan("all");
    setSelectedRole("all");
  };

  const allMembers = query.data ?? [];
  const filteredMembers = allMembers.filter((m) => {
    const matchesSearch =
      m.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.no_kta.toLowerCase().includes(search.toLowerCase()) ||
      m.plat_nomor.toLowerCase().includes(search.toLowerCase());
    const matchesPangkalan = selectedPangkalan === "all" || m.pangkalan === selectedPangkalan;
    const matchesRole = selectedRole === "all" || m.role === selectedRole;
    return matchesSearch && matchesPangkalan && matchesRole;
  });

  return {
    members: filteredMembers,
    totalCount: allMembers.length,
    search,
    setSearch,
    selectedPangkalan,
    setSelectedPangkalan,
    selectedRole,
    setSelectedRole,
    resetFilters,
    isLoading: query.isLoading,
  };
}
