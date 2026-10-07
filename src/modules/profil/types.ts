export type ProfileRow = {
  id: string;
  nama: string;
  no_hp: string | null;
  alamat: string | null;
  bio: string | null;
  email: string | null;
  foto_url: string | null;
  jenjang: "calon" | "muda" | "madya" | "purna";
  status: "aktif" | "nonaktif" | "cuti";
  notif_sos: boolean;
  notif_kas: boolean;
  notif_pengumuman: boolean;
  notif_email: boolean;
};

export function getInitials(nameOrEmail: string | null | undefined): string {
  if (!nameOrEmail || !nameOrEmail.trim()) return "?";
  const res = nameOrEmail
    .trim()
    .split(/[\s@]/)
    .filter(Boolean)
    .map((s) => s[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
  return res || "?";
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
