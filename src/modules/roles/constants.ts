import { RoleDefinition } from "./types";
export { PERMISSIONS_LIST } from "./permissions-constants";

export const AVAILABLE_ROLES: RoleDefinition[] = [
  {
    id: "ketua",
    name: "Ketua Umum",
    title: "Ketua Pengurus Komunitas",
    category: "pengurus_inti",
    level: 1,
    description:
      "Pemimpin tertinggi komunitas dengan mandat pengesahan SK, kebijakan strategis, dan pengawasan umum.",
    badgeClass: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    permissions: [
      "manage_roles",
      "sign_sk",
      "manage_notulen",
      "approve_finance",
      "manage_piket",
      "handle_sos",
      "manage_ethics",
      "verify_members",
    ],
  },
  {
    id: "sekretaris",
    name: "Sekretaris",
    title: "Sekretaris Jenderal",
    category: "pengurus_inti",
    level: 2,
    description:
      "Penanggung jawab tata kelola administrasi, surat menyurat resmi, notulen musyawarah, dan arsip keanggotaan.",
    badgeClass: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    permissions: ["manage_notulen", "sign_sk", "verify_members", "manage_roles"],
  },
  {
    id: "bendahara",
    name: "Bendahara",
    title: "Bendahara Keuangan",
    category: "pengurus_inti",
    level: 2,
    description:
      "Pemegang otoritas pencatatan, transparansi kas sosial, kas koperasi, verifikasi bukti transfer, dan laporan neraca.",
    badgeClass: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    permissions: ["approve_finance", "verify_members"],
  },
  {
    id: "admin",
    name: "Admin Sistem",
    title: "Administrator Platform",
    category: "pengurus_inti",
    level: 2,
    description:
      "Pengelola teknis akun, konfigurasi database, sinkronisasi data, dan pemeliharaan server.",
    badgeClass: "bg-purple-500/15 text-purple-600 border-purple-500/30",
    permissions: ["manage_roles", "verify_members", "manage_notulen", "manage_piket"],
  },
  {
    id: "super_admin",
    name: "Super Administrator",
    title: "Super Administrator",
    category: "pengurus_inti",
    level: 1,
    description:
      "Hak akses tertinggi mutlak untuk seluruh sistem, administrasi, kaderisasi, keuangan, dan tata kelola pengurus.",
    badgeClass: "bg-red-500/15 text-red-600 border-red-500/30 font-bold",
    permissions: [
      "manage_roles",
      "sign_sk",
      "manage_notulen",
      "approve_finance",
      "manage_piket",
      "handle_sos",
      "manage_ethics",
      "verify_members",
    ],
  },
  {
    id: "korlap",
    name: "Korlap Satgas",
    title: "Koordinator Lapangan",
    category: "lapangan",
    level: 3,
    description:
      "Koordinator pangkalan, penanggung jawab jadwal piket wilayah, dan pengarah tim siaga.",
    badgeClass: "bg-orange-500/15 text-orange-600 border-orange-500/30",
    permissions: ["manage_piket", "handle_sos", "verify_members"],
  },
  {
    id: "satgas",
    name: "Satgas Lapangan",
    title: "Satgas Reaksi Cepat",
    category: "lapangan",
    level: 3,
    description:
      "Petugas siaga tanggap darurat 24 jam untuk laka lantas, mogok kendaraan, dan pengawalan medis.",
    badgeClass: "bg-rose-500/15 text-rose-600 border-rose-500/30",
    permissions: ["handle_sos", "manage_piket"],
  },
  {
    id: "dewan_etik",
    name: "Dewan Etik",
    title: "Dewan Kehormatan & Disiplin",
    category: "pengawas",
    level: 2,
    description:
      "Badan independen penyelesai perselisihan antar driver, penegak kode etik, dan mediasi sanksi.",
    badgeClass: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30",
    permissions: ["manage_ethics", "sign_sk"],
  },
  {
    id: "anggota",
    name: "Driver / Anggota",
    title: "Anggota Driver Aktif",
    category: "anggota",
    level: 4,
    description:
      "Anggota resmi driver ber-KTA dengan hak iuran transparan, klaim bantuan sosial, dan sinyal darurat.",
    badgeClass: "bg-muted text-muted-foreground border-border",
    permissions: [],
  },
];
