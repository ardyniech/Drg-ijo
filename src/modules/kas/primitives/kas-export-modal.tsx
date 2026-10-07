import { useState } from "react";
import { Tx } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Share2 } from "lucide-react";
import { toast } from "sonner";

interface KasExportModalProps {
  rows: Tx[];
}

export function KasExportModal({ rows }: KasExportModalProps) {
  const [open, setOpen] = useState(false);

  const handleExportCsv = () => {
    if (!rows.length) {
      toast.error("Tidak ada data transaksi untuk diekspor");
      return;
    }

    const headers = ["Tanggal", "Buku Kas", "Tipe", "Kategori", "Jumlah", "Status", "Deskripsi"];
    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.tanggal,
          r.ledger,
          r.tipe,
          `"${(r.kategori ?? "").replace(/"/g, '""')}"`,
          r.jumlah,
          r.status,
          `"${(r.deskripsi ?? "").replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_kas_drg_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("File CSV Laporan Kas berhasil diunduh");
    setOpen(false);
  };

  const handleCopySummary = () => {
    const totalMasuk = rows
      .filter((r) => r.tipe === "masuk" && r.status === "disetujui")
      .reduce((sum, r) => sum + Number(r.jumlah || 0), 0);
    const totalKeluar = rows
      .filter((r) => r.tipe === "keluar" && r.status === "disetujui")
      .reduce((sum, r) => sum + Number(r.jumlah || 0), 0);

    const summaryText = `*REKAPITULASI KAS KOMUNITAS DRG*\nTanggal: ${new Date().toLocaleDateString("id-ID")}\nTotal Pemasukan: Rp ${totalMasuk.toLocaleString("id-ID")}\nTotal Pengeluaran: Rp ${totalKeluar.toLocaleString("id-ID")}\nSaldo Bersih: Rp ${(totalMasuk - totalKeluar).toLocaleString("id-ID")}\nTotal Transaksi: ${rows.length} entri\n\n_Transparansi Keuangan Driver Riang Gembira_`;

    navigator.clipboard.writeText(summaryText);
    toast.success("Ringkasan kas disalin ke clipboard untuk WhatsApp!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl text-xs">
          <FileSpreadsheet className="h-4 w-4" />
          Ekspor Rekap
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Ekspor Laporan Transparansi Kas
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Unduh format tabel CSV untuk pembukuan Excel atau salin ringkasan singkat ke grup
            WhatsApp.
          </p>
        </DialogHeader>

        <div className="space-y-3 my-3">
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5">
            <p className="text-xs font-semibold text-foreground">Data Siap Ekspor:</p>
            <p className="text-xs text-muted-foreground mt-1">
              Sebanyak <strong>{rows.length} transaksi</strong> sesuai filter aktif saat ini.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={handleCopySummary}
            className="gap-2 rounded-xl text-xs"
          >
            <Share2 className="h-4 w-4" />
            Salin Teks WhatsApp
          </Button>
          <Button onClick={handleExportCsv} className="gap-2 rounded-xl text-xs bg-primary">
            <Download className="h-4 w-4" />
            Unduh CSV (.csv)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
