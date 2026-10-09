import type { FeatureBranch } from "./types";

export const organizationBranches: FeatureBranch[] = [
  {
    id: "kas",
    label: "Kas Gotong Royong",
    summary: "Transparansi keuangan komunitas.",
    children: [
      {
        label: "Catat kas masuk & keluar",
        status: "siap",
        note: "Saldo otomatis, grafik transparansi, dan ekspor data.",
      },
      {
        label: "Persetujuan Bendahara & slip WhatsApp",
        status: "siap",
      },
      {
        label: "Kuitansi digital berbasis QR",
        status: "rencana",
        note: "Belum ada generator QR; klaim ini masih di README saja.",
      },
      {
        label: "Unggah bukti transfer asli",
        status: "rencana",
        note: "Masih memakai placeholder, belum penyimpanan file nyata.",
      },
    ],
  },
  {
    id: "organisasi",
    label: "Organisasi & Kearsipan",
    summary: "Notulen, etik, kaderisasi, dan administrasi anggota.",
    children: [
      { label: "Notulen rembug & kopdar", status: "siap" },
      { label: "Dewan Etik & sidang disiplin", status: "siap" },
      { label: "Persetujuan anggota baru", status: "siap" },
      { label: "Direktori & inventaris basecamp", status: "siap" },
      {
        label: "Kaderisasi & jenjang",
        status: "sebagian",
        note: "Alur berjalan, sebagian angka penilaian masih data contoh.",
      },
      {
        label: "Screening calon anggota",
        status: "sebagian",
        note: "Bank soal penilaian masih kosong.",
      },
    ],
  },
  {
    id: "data",
    label: "Data & Infrastruktur",
    summary: "Penyimpanan, offline, dan kesiapan multi-perangkat.",
    children: [
      {
        label: "Penyimpanan local-first (peramban)",
        status: "siap",
        note: "Seluruh data hidup di localStorage perangkat ini.",
      },
      { label: "Cadangkan & pulihkan data (JSON)", status: "siap" },
      { label: "PWA installable + offline shell", status: "siap" },
      {
        label: "Sinkronisasi server & antar perangkat",
        status: "rencana",
        note: "Belum ada database pusat; outbox hanya simulasi.",
      },
      {
        label: "Notifikasi push SOS nyata",
        status: "sebagian",
        note: "Mekanisme peramban ada, endpoint server belum tersambung.",
      },
      { label: "Realtime multi-pengguna", status: "rencana" },
    ],
  },
];
