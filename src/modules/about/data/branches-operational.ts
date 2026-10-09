import type { FeatureBranch } from "./types";

export const operationalBranches: FeatureBranch[] = [
  {
    id: "akun",
    label: "Akun, Peran & Tata Kelola",
    summary: "Registrasi, login, hirarki pengurus, dan jejak aktivitas.",
    children: [
      {
        label: "Login & registrasi anggota",
        status: "siap",
        note: "Berbasis perangkat (local-first). Kata sandi di-hash bcrypt.",
      },
      {
        label: "8 peran kepengurusan + nomor SK",
        status: "sebagian",
        note: "Peran & matriks izin tersedia, namun otorisasi masih di sisi antarmuka, belum di server.",
      },
      {
        label: "Penerbitan SK Pengurus & mandat",
        status: "siap",
      },
      {
        label: "Log aktivitas lintas peran",
        status: "sebagian",
        note: "Tersimpan per perangkat, belum anti-manipulasi dan belum lintas perangkat.",
      },
      {
        label: "Audit trail yang tidak bisa diubah",
        status: "rencana",
        note: "Butuh penyimpanan server append-only.",
      },
    ],
  },
  {
    id: "jalur",
    label: "Operasional Jalan & Satgas",
    summary: "SOS, penanganan kejadian, radar pangkalan, dan piket.",
    children: [
      {
        label: "Tombol SOS & penanganan kejadian",
        status: "siap",
        note: "Banner darurat, suara alarm, tautan WhatsApp, dan riwayat status.",
      },
      {
        label: "Penugasan Satgas",
        status: "sebagian",
        note: "Masih ambil-tugas sendiri, belum sistem cari personel terdekat otomatis.",
      },
      {
        label: "Radar Dulur & pangkalan",
        status: "sebagian",
        note: "Tampilan radar + data pangkalan contoh; peta Leaflet asli belum dipasang.",
      },
      {
        label: "Lokasi anggota On-Bit (GPS live)",
        status: "rencana",
        note: "Pengiriman posisi dibuang karena sinkronisasi server belum ada.",
      },
      {
        label: "Piket basecamp",
        status: "siap",
        note: "Jadwal piket wilayah tersimpan per perangkat.",
      },
      {
        label: "Tukar shift piket",
        status: "rencana",
        note: "Formulir pengajuan ada, tetapi permohonan belum benar-benar tersimpan.",
      },
    ],
  },
];
