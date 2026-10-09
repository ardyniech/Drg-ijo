import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoanRecord, LoanStatus } from "../types";
import { KoperasiStorage } from "../storage/koperasi-storage";
import { recordActivityLog } from "@/modules/activity-log";
import { enqueueOperation } from "@/core/sync";

export function useKoperasi() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const loansQuery = useQuery({
    queryKey: ["koperasi", "loans"],
    queryFn: async () => KoperasiStorage.getLoans(),
  });

  const summaryQuery = useQuery({
    queryKey: ["koperasi", "summary"],
    queryFn: async () => KoperasiStorage.getSummary(),
  });

  const createLoan = useMutation({
    mutationFn: async (
      payload: Omit<LoanRecord, "id" | "no_pengajuan" | "terbayar" | "cicilan_per_minggu">,
    ) => KoperasiStorage.createLoan(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["koperasi"] });
      enqueueOperation({
        idempotencyKey: `loan-apply-${data.id}`,
        action: "Pengajuan Pinjaman Koperasi",
        module: "kas",
        payload: { id: data.id, nominal: data.nominal },
      });
      recordActivityLog({
        actorId: "driver-peminjam",
        actorName: data.nama_peminjam,
        actorRole: "driver",
        action: "Pengajuan Pinjaman Koperasi",
        module: "kas",
        description: `Pengajuan pinjaman darurat ${data.no_pengajuan} sebesar Rp${data.nominal.toLocaleString("id-ID")} untuk ${data.keperluan}.`,
      });
      toast.success(`Pengajuan pinjaman ${data.no_pengajuan} berhasil dikirim`);
    },
  });

  const approveLoan = useMutation({
    mutationFn: async ({ id, approver }: { id: string; approver: string }) => {
      const updated = KoperasiStorage.updateLoanStatus(id, "disetujui", approver);
      if (!updated) throw new Error("Pinjaman tidak ditemukan");
      return updated;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["koperasi"] });
      recordActivityLog({
        actorId: "usr-bendahara",
        actorName: data.disetujui_oleh || "Pengurus Koperasi",
        actorRole: "bendahara",
        action: "Persetujuan Pinjaman Koperasi",
        module: "kas",
        description: `Menyetujui pinjaman ${data.no_pengajuan} Rp${data.nominal.toLocaleString("id-ID")} (${data.nama_peminjam}).`,
      });
      toast.success(`Pinjaman ${data.no_pengajuan} telah disetujui`);
    },
  });

  const payInstallment = useMutation({
    mutationFn: async ({ id, nominal }: { id: string; nominal: number }) => {
      const updated = KoperasiStorage.payInstallment(id, nominal);
      if (!updated) throw new Error("Data pinjaman tidak ditemukan");
      return updated;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["koperasi"] });
      toast.success(
        data.status === "lunas"
          ? `Alhamdulillah! Pinjaman ${data.no_pengajuan} telah LUNAS.`
          : `Cicilan Rp${data.cicilan_per_minggu.toLocaleString("id-ID")} berhasil dibayar.`,
      );
    },
  });

  const allLoans = loansQuery.data ?? [];
  const filteredLoans = allLoans.filter((l) => {
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchSearch =
      !search ||
      l.nama_peminjam.toLowerCase().includes(search.toLowerCase()) ||
      l.keperluan.toLowerCase().includes(search.toLowerCase()) ||
      l.no_pengajuan.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return {
    loans: filteredLoans,
    summary: summaryQuery.data ?? KoperasiStorage.getSummary(),
    isLoading: loansQuery.isLoading,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    createLoan,
    approveLoan,
    payInstallment,
  };
}
