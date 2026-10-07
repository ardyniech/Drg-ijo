import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMe, UserRole } from "@/hooks/use-me";
import { MemberRoleRecord } from "../types";
import { getMemberRoleRecords, getRoleAuditLogs, assignMemberRole } from "../storage/roles-storage";

export function useRoleManagement() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<MemberRoleRecord | null>(null);

  const membersQuery = useQuery({
    queryKey: ["roles", "members"],
    queryFn: async () => getMemberRoleRecords(),
  });

  const auditQuery = useQuery({
    queryKey: ["roles", "audit"],
    queryFn: async () => getRoleAuditLogs(),
  });

  const assignMutation = useMutation({
    mutationFn: async ({
      targetUserId,
      newRole,
      skNumber,
      notes,
    }: {
      targetUserId: string;
      newRole: UserRole;
      skNumber?: string;
      notes?: string;
    }) => {
      if (!me) throw new Error("Sesi pengguna tidak aktif");
      return assignMemberRole(targetUserId, newRole, { id: me.id, nama: me.nama }, skNumber, notes);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
      qc.invalidateQueries({ queryKey: ["anggota"] });
      setSelectedMember(null);
      toast.success("Peran pengurus berhasil diperbarui dan dicatat dalam audit log!");
    },
    onError: (err: Error) => {
      toast.error("Gagal mengubah peran", { description: err.message });
    },
  });

  const rawMembers = membersQuery.data;
  const members = useMemo(() => rawMembers ?? [], [rawMembers]);
  const auditLogs = auditQuery.data ?? [];

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.nama.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.pangkalan.toLowerCase().includes(search.toLowerCase());

      const isPengurus =
        m.role === "ketua" ||
        m.role === "sekretaris" ||
        m.role === "bendahara" ||
        m.role === "admin" ||
        m.role === "super_admin";
      const isLapangan = m.role === "korlap" || m.role === "satgas";
      const isPengawas = m.role === "dewan_etik";
      const isAnggota = m.role === "anggota" || m.role === "driver";

      const matchCategory =
        categoryFilter === "all" ||
        (categoryFilter === "pengurus_inti" && isPengurus) ||
        (categoryFilter === "lapangan" && isLapangan) ||
        (categoryFilter === "pengawas" && isPengawas) ||
        (categoryFilter === "anggota" && isAnggota);

      return matchSearch && matchCategory;
    });
  }, [members, search, categoryFilter]);

  const stats = useMemo(() => {
    return {
      total: members.length,
      pengurusInti: members.filter(
        (m) =>
          m.role === "ketua" ||
          m.role === "sekretaris" ||
          m.role === "bendahara" ||
          m.role === "admin" ||
          m.role === "super_admin",
      ).length,
      satgasLapangan: members.filter((m) => m.role === "satgas" || m.role === "korlap").length,
      dewanEtik: members.filter((m) => m.role === "dewan_etik").length,
      driverBiasa: members.filter((m) => m.role === "anggota" || m.role === "driver").length,
    };
  }, [members]);

  return {
    members: filteredMembers,
    allMembers: members,
    auditLogs,
    isLoading: membersQuery.isLoading,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    selectedMember,
    setSelectedMember,
    assignMutation,
    stats,
    currentActor: me,
  };
}
