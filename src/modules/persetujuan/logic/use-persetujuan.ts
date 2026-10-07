import { useState, useMemo, useEffect } from "react";
import { ApprovalItem } from "../types";
import { getApprovalsList, resolveApproval } from "../storage/persetujuan-storage";
import { toast } from "sonner";

export function usePersetujuan() {
  const [list, setList] = useState<ApprovalItem[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);

  useEffect(() => {
    setList(getApprovalsList());
  }, []);

  const filtered = useMemo(() => {
    return list.filter((item) => {
      const matchSearch =
        item.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        item.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.appliedBase.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || item.type === typeFilter;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [list, search, typeFilter, statusFilter]);

  const handleApprove = (id: string, notes?: string) => {
    const updated = resolveApproval(id, "approved", notes);
    setList(updated);
    setSelectedItem(null);
    toast.success("Pengajuan berhasil disetujui & diverifikasi.");
  };

  const handleReject = (id: string, notes?: string) => {
    const updated = resolveApproval(id, "rejected", notes);
    setList(updated);
    setSelectedItem(null);
    toast.error("Pengajuan telah ditolak.");
  };

  return {
    list: filtered,
    rawList: list,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    selectedItem,
    setSelectedItem,
    handleApprove,
    handleReject,
  };
}
