import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SEED_MEMBERS } from "../storage/anggota-storage";
import { MemberRecord, MemberSortOption } from "../types";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { toast } from "sonner";

export function useAnggota() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPangkalan, setSelectedPangkalan] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortBy, setSortBy] = useState<MemberSortOption>("terbaru");

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
          pangkalan: "Pangkalan Suhat",
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

  const verifyMutation = useMutation({
    mutationFn: async (memberId: string) => {
      LocalAuthClient.updateUser(memberId, { status: "aktif" });
      return memberId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anggota", "list"] });
      toast.success("Driver berhasil diverifikasi!");
    },
  });

  const allMembers = useMemo(() => query.data ?? [], [query.data]);

  const pangkalanOptions = useMemo(() => {
    return Array.from(new Set(allMembers.map((m) => m.pangkalan))).filter(Boolean);
  }, [allMembers]);

  const stats = useMemo(() => {
    const verified = allMembers.filter((m) => m.status === "aktif").length;
    const pending = allMembers.filter((m) => m.status === "pending_review").length;
    const pangkalan = pangkalanOptions.length;
    return { total: allMembers.length, verified, pending, pangkalan };
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
        return matchesSearch && matchesStatus && matchesPangkalan && matchesRole;
      })
      .sort((a, b) => {
        if (sortBy === "nama_asc") return a.nama.localeCompare(b.nama);
        if (sortBy === "nama_desc") return b.nama.localeCompare(a.nama);
        if (sortBy === "kta") return a.no_kta.localeCompare(b.no_kta);
        return b.id.localeCompare(a.id);
      });
  }, [allMembers, search, selectedStatus, selectedPangkalan, selectedRole, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setSelectedStatus("all");
    setSelectedPangkalan("all");
    setSelectedRole("all");
    setSortBy("terbaru");
  };

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
    sortBy,
    setSortBy,
    pangkalanOptions,
    resetFilters,
    isLoading: query.isLoading,
    verifyMember: (id: string) => verifyMutation.mutate(id),
  };
}
