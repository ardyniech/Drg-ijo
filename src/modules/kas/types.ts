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
  return { label: "Merah · super admin", role: "super_admin", tone: "bg-destructive/20 text-destructive" };
}

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
