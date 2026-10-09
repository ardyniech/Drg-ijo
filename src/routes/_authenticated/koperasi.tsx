import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useIs } from "@/hooks/use-my-role";
import {
  useKoperasi,
  KoperasiOverviewCards,
  KoperasiLoansTable,
  NewLoanDialog,
  QrisIuranDialog,
} from "@/modules/koperasi";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/koperasi")({
  head: () => ({ meta: [{ title: "Koperasi Guyub — DRG App" }] }),
  component: KoperasiPage,
});

function KoperasiPage() {
  const isPengurus = useIs(["bendahara", "admin", "super_admin", "ketua"]);
  const {
    loans,
    summary,
    isLoading,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    approveLoan,
    payInstallment,
  } = useKoperasi();

  return (
    <PageShell
      eyebrow="Kemandirian Ekonomi Sedulur"
      title="Koperasi Simpan Pinjam Guyub DRG"
      description="Simpanan pokok/wajib anggota dan pinjaman darurat 0% bunga untuk perbaikan kendaraan atau kebutuhan mendesak on-bit."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <QrisIuranDialog />
          <NewLoanDialog />
        </div>
      }
    >
      <div className="space-y-6">
        <KoperasiOverviewCards summary={summary} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari peminjam / no. pengajuan..."
              className="h-8 pl-8 text-xs rounded-lg"
            />
          </div>

          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="diajukan">Menunggu Persetujuan</SelectItem>
                <SelectItem value="disetujui">Pinjaman Berjalan</SelectItem>
                <SelectItem value="lunas">Sudah Lunas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat data simpan pinjam...</p>
        ) : (
          <KoperasiLoansTable
            loans={loans}
            canManage={isPengurus}
            onApprove={(id) => approveLoan.mutate({ id, approver: "Pengurus Koperasi DRG" })}
            onPayInstallment={(id, nominal) => payInstallment.mutate({ id, nominal })}
          />
        )}
      </div>
    </PageShell>
  );
}
