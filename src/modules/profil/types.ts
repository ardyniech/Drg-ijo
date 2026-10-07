export type ProfileRow = {
  id: string;
  nama: string;
  no_hp: string | null;
  alamat: string | null;
  bio: string | null;
  email: string | null;
  foto_url: string | null;
  jenjang: "calon" | "muda" | "madya" | "purna";
  status: "aktif" | "nonaktif" | "cuti" | "pending_review";
  role?: string;
  created_at?: string;
  tanggal_lahir?: string | null;
  jenis_kelamin?: "L" | "P" | null;
  golongan_darah?: "A" | "B" | "AB" | "O" | "-" | null;
  plat_nomor?: string | null;
  jenis_kendaraan?: string | null;
  merk_kendaraan?: string | null;
  nomor_stnk?: string | null;
  pangkalan?: string | null;
  nomor_anggota?: string | null;
  kontak_darurat_nama?: string | null;
  kontak_darurat_hp?: string | null;
  kontak_darurat_hubungan?: string | null;
  notif_sos?: boolean;
  notif_kas?: boolean;
  notif_pengumuman?: boolean;
  notif_email?: boolean;
};

export function getInitials(nameOrEmail: string | null | undefined): string {
  if (!nameOrEmail || !nameOrEmail.trim()) return "?";
  return (
    nameOrEmail
      .trim()
      .split(/[\s@]/)
      .filter(Boolean)
      .map((s) => s[0]!.toUpperCase())
      .slice(0, 2)
      .join("") || "?"
  );
}

export const NOTIF_CONFIGS = [
  {
    key: "notif_sos" as const,
    label: "SOS & Kejadian Darurat",
    desc: "Broadcast panggilan darurat dari anggota lain.",
  },
  {
    key: "notif_kas" as const,
    label: "Aktivitas Kas",
    desc: "Transaksi masuk/keluar & pengingat iuran.",
  },
  {
    key: "notif_pengumuman" as const,
    label: "Pengumuman & Notulen",
    desc: "Rapat, jadwal piket, dan pengumuman pengurus.",
  },
  {
    key: "notif_email" as const,
    label: "Ringkasan Email Mingguan",
    desc: "Rangkuman aktivitas komunitas dikirim ke email.",
  },
];
