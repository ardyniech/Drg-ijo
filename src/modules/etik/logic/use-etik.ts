import { useState, useMemo, useEffect } from "react";
import { EtikCase, NewEtikCasePayload } from "../types";
import { getEtikCases, addEtikCase, updateCaseStatus } from "../storage/etik-storage";
import { recordActivityLog } from "@/modules/activity-log";
import { toast } from "sonner";

export function useEtik() {
  const [cases, setCases] = useState<EtikCase[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCase, setSelectedCase] = useState<EtikCase | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    setCases(getEtikCases());
  }, []);

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const matchSearch =
        item.reportedMemberName.toLowerCase().includes(search.toLowerCase()) ||
        item.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [cases, search, statusFilter]);

  const handleCreateCase = (payload: NewEtikCasePayload) => {
    const newEntry = addEtikCase(payload);
    setCases(getEtikCases());
    setIsReportOpen(false);
    recordActivityLog({
      actorId: "pelapor-etik",
      actorName: payload.reporterName,
      actorRole: "anggota",
      action: "Laporan Pelanggaran Etik",
      module: "etik",
      description: `Melaporkan perkara aduan ${newEntry.caseNumber} kategori ${payload.category}.`,
    });
    toast.success(`Laporan aduan ${newEntry.caseNumber} berhasil diregistrasi ke Dewan Etik.`);
  };

  const handleUpdateStatus = (id: string, status: EtikCase["status"], notes?: string) => {
    const updated = updateCaseStatus(id, status, notes);
    setCases(updated);
    setSelectedCase(null);
    recordActivityLog({
      actorId: "usr-etik-01",
      actorName: "Doni Iskandar",
      actorRole: "dewan_etik",
      action: "Putusan Sidang Dewan Etik",
      module: "etik",
      description: `Memperbarui status perkara #${id} menjadi ${status.replace("_", " ")}.`,
    });
    toast.success("Status perkara Dewan Etik berhasil diperbarui.");
  };

  return {
    cases: filteredCases,
    rawCases: cases,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedCase,
    setSelectedCase,
    isReportOpen,
    setIsReportOpen,
    handleCreateCase,
    handleUpdateStatus,
  };
}
