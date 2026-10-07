import { useState, useMemo, useEffect } from "react";
import { MemberKaderisasi, JenjangLevel } from "../types";
import { getKaderisasiList, updateMemberStatus } from "../storage/kaderisasi-storage";
import { toast } from "sonner";

export function useKaderisasi() {
  const [list, setList] = useState<MemberKaderisasi[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<MemberKaderisasi | null>(null);

  useEffect(() => {
    setList(getKaderisasiList());
  }, []);

  const filtered = useMemo(() => {
    return list.filter((item) => {
      const matchSearch =
        item.fullName.toLowerCase().includes(search.toLowerCase()) ||
        item.memberId.toLowerCase().includes(search.toLowerCase());
      const matchLevel = levelFilter === "all" || item.currentLevel === levelFilter;
      return matchSearch && matchLevel;
    });
  }, [list, search, levelFilter]);

  const handlePromote = (id: string, notes?: string) => {
    const updated = updateMemberStatus(id, "promoted", notes);
    setList(updated);
    setSelectedMember(null);
    toast.success("Anggota berhasil dinaikkan jenjang kaderisasinya!");
  };

  const handleReject = (id: string, notes?: string) => {
    const updated = updateMemberStatus(id, "needs_improvement", notes);
    setList(updated);
    setSelectedMember(null);
    toast.info("Status kaderisasi diperbarui: Perlu pembinaan lanjutan");
  };

  return {
    list: filtered,
    rawList: list,
    search,
    setSearch,
    levelFilter,
    setLevelFilter,
    selectedMember,
    setSelectedMember,
    handlePromote,
    handleReject,
  };
}
