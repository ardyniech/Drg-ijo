import { z } from "zod";
import { LoanRecord, SimpananSummary } from "../types";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";

const LOANS_STORAGE_KEY = "drg_koperasi_loans_v1";

const LoanSchema = z.object({
  id: z.string(),
  no_pengajuan: z.string(),
  nama_peminjam: z.string(),
  kta_peminjam: z.string(),
  pangkalan: z.string(),
  keperluan: z.string(),
  nominal: z.number(),
  tenor_minggu: z.number(),
  cicilan_per_minggu: z.number(),
  terbayar: z.number(),
  status: z.enum(["diajukan", "disetujui", "lunas", "ditolak"]),
  tanggal_pengajuan: z.string(),
  disetujui_oleh: z.string().optional(),
  catatan: z.string().optional(),
});

const INITIAL_LOANS: LoanRecord[] = [
  {
    id: "loan-001",
    no_pengajuan: "SP-DRG/2026/X/001",
    nama_peminjam: "Agus Pratama",
    kta_peminjam: "DRG-MLG-089",
    pangkalan: "Posko Lawang Siaga",
    keperluan: "Servis CVT & Ganti Ban Belakang Habis On-Bit",
    nominal: 600000,
    tenor_minggu: 6,
    cicilan_per_minggu: 100000,
    terbayar: 300000,
    status: "disetujui",
    tanggal_pengajuan: "2026-10-01",
    disetujui_oleh: "Hj. Siti Rahmawati (Bendahara)",
    catatan: "Bunga 0% gotong royong persaudaraan DRG.",
  },
  {
    id: "loan-002",
    no_pengajuan: "SP-DRG/2026/X/002",
    nama_peminjam: "Budi Santoso",
    kta_peminjam: "DRG-MLG-045",
    pangkalan: "Basecamp Arjosari Guyub",
    keperluan: "Perpanjangan STNK & Pajak Motor Operasional",
    nominal: 500000,
    tenor_minggu: 5,
    cicilan_per_minggu: 100000,
    terbayar: 500000,
    status: "lunas",
    tanggal_pengajuan: "2026-09-15",
    disetujui_oleh: "H. Hendra Wijaya (Ketua)",
    catatan: "Lunas tepat waktu, track record amanah sangat baik.",
  },
];

export const KoperasiStorage = {
  getLoans(): LoanRecord[] {
    return safeReadStorage(LOANS_STORAGE_KEY, z.array(LoanSchema), INITIAL_LOANS);
  },
  saveLoans(loans: LoanRecord[]): boolean {
    return safeWriteStorage(LOANS_STORAGE_KEY, loans);
  },
  createLoan(
    data: Omit<LoanRecord, "id" | "no_pengajuan" | "terbayar" | "cicilan_per_minggu">,
  ): LoanRecord {
    const list = this.getLoans();
    const pad = String(list.length + 1).padStart(3, "0");
    const cicilan_per_minggu = Math.ceil(data.nominal / Math.max(1, data.tenor_minggu));
    const newRecord: LoanRecord = {
      ...data,
      id: `loan-${Date.now().toString(36)}`,
      no_pengajuan: `SP-DRG/2026/X/${pad}`,
      cicilan_per_minggu,
      terbayar: 0,
    };
    this.saveLoans([newRecord, ...list]);
    return newRecord;
  },
  updateLoanStatus(
    id: string,
    status: LoanRecord["status"],
    disetujui_oleh?: string,
  ): LoanRecord | null {
    const list = this.getLoans();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], status, ...(disetujui_oleh ? { disetujui_oleh } : {}) };
    this.saveLoans(list);
    return list[idx];
  },
  payInstallment(id: string, nominal: number): LoanRecord | null {
    const list = this.getLoans();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    const current = list[idx];
    const newTerbayar = Math.min(current.nominal, current.terbayar + nominal);
    const newStatus = newTerbayar >= current.nominal ? "lunas" : current.status;
    list[idx] = { ...current, terbayar: newTerbayar, status: newStatus };
    this.saveLoans(list);
    return list[idx];
  },
  getSummary(): SimpananSummary {
    const loans = this.getLoans();
    const dana_bergulir = loans
      .filter((l) => l.status === "disetujui")
      .reduce((acc, l) => acc + (l.nominal - l.terbayar), 0);
    return {
      simpanan_pokok_total: 12500000,
      simpanan_wajib_total: 8400000,
      dana_bergulir_aktif: dana_bergulir,
      sisa_kas_koperasi: 12500000 + 8400000 - dana_bergulir,
    };
  },
};
