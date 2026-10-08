import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MemberRecord, MemberSortOption, MemberViewMode } from "../types";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { normalizeOjolJenjangKey } from "@/lib/ojol-jenjang";
import { useMe } from "@/hooks/use-me";
import { canManageAnggota, canVerifyAnggota } from "./member-permissions";
import { useMemberMutations } from "./use-member-mutations";
import { exportMembersToCsv } from "./export-members-csv";

export function useAnggota() {
  const { data: me } = useMe();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPangkalan, setSelectedPangkalan] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedJenjang, setSelectedJenjang] = useState("all");
  const [viewMode, setViewMode] = useState<MemberViewMode>("grid");
  const [sortBy, setSortBy] = useState<MemberSortOption>("terbaru");

  const canManage = canManageAnggota(me?.role);
  const canVerify = canVerifyAnggota(me?.role);
  const mutations = useMemberMutations(me?.role, me?.id);

  const query = useQuery({
    queryKey: ["anggota", "list"],
    queryFn: async (): Promise<MemberRecord[]> => {
      const users = LocalAuthClient.getUsers();
      return users.map((u, idx) => ({
        id: u.id,
        nama: u.nama,
        no_kta: u.nomor_anggota || `DRG-2026-${String(idx + 1).padStart(3, "0")}`,
        no_hp: u.no_hp || "-",
        pangkalan: u.pangkalan || "Pangkalan Utama",
        role: (u.role || "driver") as MemberRecord["role"],
        jenjang: u.jenjang || "calon",
        status: (u.status === "aktif"
          ? "aktif"
          : u.status === "cuti"
            ? "nonaktif"
            : "pending_review") as MemberRecord["status"],
        bergabung_sejak: new Date(u.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        plat_nomor: u.plat_nomor || "N 2026 DRG",
        jenis_kendaraan: u.jenis_kendaraan || "Sepeda Motor",
        email: u.email,
        alamat: u.alamat || "",
        catatan: u.bio || "",
      }));
    },
  });

  const allMembers = useMemo(() => query.data ?? [], [query.data]);
  const pangkalanOptions = useMemo(() => {
    return Array.from(new Set(allMembers.map((m) => m.pangkalan))).filter(Boolean);
  }, [allMembers]);

  const stats = useMemo(() => {
    const verified = allMembers.filter((m) => m.status === "aktif").length;
    const pending = allMembers.filter((m) => m.status === "pending_review").length;
    return { total: allMembers.length, verified, pending, pangkalan: pangkalanOptions.length };
  }, [allMembers, pangkalanOptions]);

  const filteredMembers = useMemo(() => {
    return allMembers
      .filter((m) => {
        const matchesSearch =
          !search ||
          m.nama.toLowerCase().includes(search.toLowerCase()) ||
          m.no_kta.toLowerCase().includes(search.toLowerCase()) ||
          m.plat_nomor.toLowerCase().includes(search.toLowerCase()) ||
          m.pangkalan.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = selectedStatus === "all" || m.status === selectedStatus;
        const matchesPangkalan = selectedPangkalan === "all" || m.pangkalan === selectedPangkalan;
        const matchesRole = selectedRole === "all" || m.role === selectedRole;
        const matchesJenjang =
          selectedJenjang === "all" ||
          normalizeOjolJenjangKey(m.jenjang) === normalizeOjolJenjangKey(selectedJenjang);
        return matchesSearch && matchesStatus && matchesPangkalan && matchesRole && matchesJenjang;
      })
      .sort((a, b) => {
        if (sortBy === "nama_asc") return a.nama.localeCompare(b.nama);
        if (sortBy === "nama_desc") return b.nama.localeCompare(a.nama);
        if (sortBy === "kta") return a.no_kta.localeCompare(b.no_kta);
        return b.id.localeCompare(a.id);
      });
  }, [
    allMembers,
    search,
    selectedStatus,
    selectedPangkalan,
    selectedRole,
    selectedJenjang,
    sortBy,
  ]);

  return {
    members: filteredMembers,
    totalCount: allMembers.length,
    stats,
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    selectedPangkalan,
    setSelectedPangkalan,
    selectedRole,
    setSelectedRole,
    selectedJenjang,
    setSelectedJenjang,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    pangkalanOptions,
    exportCsv: () => exportMembersToCsv(filteredMembers),
    resetFilters: () => {
      setSearch("");
      setSelectedStatus("all");
      setSelectedPangkalan("all");
      setSelectedRole("all");
      setSelectedJenjang("all");
      setSortBy("terbaru");
    },
    isLoading: query.isLoading,
    canManage,
    canVerify,
    ...mutations,
  };
}
