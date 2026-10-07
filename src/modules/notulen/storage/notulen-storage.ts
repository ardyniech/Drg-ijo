import { NotulenRecord } from "../types";

const STORAGE_KEY = "drg_notulen_records";
let inMemoryNotulen: NotulenRecord[] | null = null;

const SEED_NOTULEN: NotulenRecord[] = [
  {
    id: "not-01",
    judul: "Rapat Koordinasi Satgas & Penertiban Iuran Kas",
    tanggal: "28 Agustus 2026",
    lokasi: "Basecamp Utama Suhat",
    pemimpin_rapat: "Hendra Wijaya (Ketua)",
    notulis: "Siti Rahma",
    peserta_count: 32,
    agenda: "Evaluasi piket malam satgas & penetapan transparansi saldo kas koperasi.",
    poin_keputusan: [
      "Piket malam satgas dibagi 2 shift: 20:00 - 01:00 dan 01:00 - 05:00.",
      "Uang kas duka cita dinaikkan menjadi Rp 500.000 per kejadian.",
      "Setiap shelter wajib menyimpan minimal 1 kotak P3K lengkap.",
    ],
    status: "disahkan",
    created_at: new Date().toISOString(),
  },
  {
    id: "not-02",
    judul: "Musyawarah Pembentukan Korlap Wilayah Timur",
    tanggal: "15 Juli 2026",
    lokasi: "Shelter Sawojajar",
    pemimpin_rapat: "Rudi Hartono (Korlap)",
    notulis: "Budi Santoso",
    peserta_count: 24,
    agenda: "Pembentukan struktur korlap Sawojajar & alokasi HT satgas.",
    poin_keputusan: [
      "Penunjukan rekan Bambang sebagai Korlap Shelter Sawojajar.",
      "Pengadaan 3 unit HT Baofeng untuk frekuensi darurat DRG.",
    ],
    status: "disahkan",
    created_at: new Date().toISOString(),
  },
];

export const NotulenStorage = {
  getNotulen(): NotulenRecord[] {
    if (typeof window === "undefined" || !window.localStorage) {
      return inMemoryNotulen ?? SEED_NOTULEN;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_NOTULEN));
      return SEED_NOTULEN;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_NOTULEN;
    }
  },
  saveNotulen(items: NotulenRecord[]) {
    inMemoryNotulen = items;
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  },
};
