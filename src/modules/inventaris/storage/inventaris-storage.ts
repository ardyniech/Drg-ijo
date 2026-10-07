import { InventarisItem } from "../types";

const STORAGE_KEY = "drg_inventaris_records";

const SEED_INVENTARIS: InventarisItem[] = [
  {
    id: "inv-01",
    kode_alat: "HT-DRG-01",
    nama_barang: "Handie Talkie (HT) Baofeng UV-5R #01",
    kategori: "Komunikasi",
    kondisi: "Sangat Baik",
    status: "tersedia",
    lokasi_pos: "Basecamp Utama Suhat",
  },
  {
    id: "inv-02",
    kode_alat: "HT-DRG-02",
    nama_barang: "Handie Talkie (HT) Baofeng UV-5R #02",
    kategori: "Komunikasi",
    kondisi: "Baik",
    status: "dipinjam",
    lokasi_pos: "Pos Pantau Dinoyo",
    peminjam_nama: "Rudi Hartono (Korlap Dinoyo)",
    peminjam_phone: "081987654321",
    tgl_pinjam: "04 September 2026",
  },
  {
    id: "inv-03",
    kode_alat: "P3K-DRG-01",
    nama_barang: "Tas Medis P3K Lapangan Lengkap",
    kategori: "P3K",
    kondisi: "Sangat Baik",
    status: "tersedia",
    lokasi_pos: "Basecamp Utama Suhat",
  },
  {
    id: "inv-04",
    kode_alat: "RMP-DRG-12",
    nama_barang: "Rompi Satgas Fosfor Hijau DRG (Pack 5 pcs)",
    kategori: "Keselamatan",
    kondisi: "Sangat Baik",
    status: "tersedia",
    lokasi_pos: "Shelter Sawojajar",
  },
  {
    id: "inv-05",
    kode_alat: "KMP-DRG-01",
    nama_barang: "Kompresor Mini Portabel 12V",
    kategori: "Perlengkapan Pos",
    kondisi: "Baik",
    status: "tersedia",
    lokasi_pos: "Basecamp Utama Suhat",
  },
];

let inMemoryCache: InventarisItem[] = [...SEED_INVENTARIS];

export const InventarisStorage = {
  getItems(): InventarisItem[] {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          // ignore
        }
      }
    }
    return inMemoryCache;
  },
  saveItems(items: InventarisItem[]) {
    inMemoryCache = items;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  },
};
