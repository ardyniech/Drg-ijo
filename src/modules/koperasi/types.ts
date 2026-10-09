export type LoanStatus = "diajukan" | "disetujui" | "lunas" | "ditolak";

export interface LoanRecord {
  id: string;
  no_pengajuan: string;
  nama_peminjam: string;
  kta_peminjam: string;
  pangkalan: string;
  keperluan: string;
  nominal: number;
  tenor_minggu: number;
  cicilan_per_minggu: number;
  terbayar: number;
  status: LoanStatus;
  tanggal_pengajuan: string;
  disetujui_oleh?: string;
  catatan?: string;
}

export interface SimpananSummary {
  simpanan_pokok_total: number;
  simpanan_wajib_total: number;
  dana_bergulir_aktif: number;
  sisa_kas_koperasi: number;
}

export interface QrisInvoice {
  id: string;
  ref_code: string;
  nominal: number;
  nama_anggota: string;
  kta: string;
  peruntukan: string;
  expired_at: string;
  qris_payload: string;
}
