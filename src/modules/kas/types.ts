export type Tx = {
  id: string;
  ledger: "sosial" | "umum";
  jenis: "masuk" | "keluar";
  jumlah: number;
  kategori: string | null;
  deskripsi: string | null;
  bukti_path: string | null;
  tanggal: string;
  created_by: string | null;
  status: "menunggu" | "disetujui" | "ditolak";
  approved_by: string | null;
  approved_at: string | null;
  catatan_approver: string | null;
};

export type Tier = {
  label: string;
  role: "bendahara" | "admin" | "super_admin";
  tone: string;
};

export function tierOf(jumlah: number): Tier | null {
  if (jumlah < 500000) return null;
  if (jumlah < 2000000) {
    return { label: "Kuning · bendahara", role: "bendahara", tone: "bg-warn text-warn-foreground" };
  }
  if (jumlah < 5000000) {
    return { label: "Oranye · admin", role: "admin", tone: "bg-signal/20 text-signal" };
  }
  return {
    label: "Merah · super admin",
    role: "super_admin",
    tone: "bg-destructive/20 text-destructive",
  };
}

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export type KasSkCategory =
  | "santunan_laka"
  | "santunan_duka"
  | "bantuan_kesehatan"
  | "bantuan_kendaraan"
  | "modal_koperasi";

export interface KasSkRecord {
  id: string;
  no_sk: string;
  tanggal: string;
  kategori: KasSkCategory;
  judul: string;
  nominal: number;
  penerima_nama: string;
  penerima_kta: string;
  penerima_pangkalan: string;
  alasan: string;
  dasar_keputusan: string;
  nama_ketua: string;
  nama_bendahara: string;
  status: "disahkan" | "diajukan" | "dicairkan";
  created_at: string;
}
