import { InventarisItem } from "../types";

const STORAGE_KEY = "drg_inventaris_records";

const SEED_INVENTARIS: InventarisItem[] = [
  {
    id: "inv-001",
    kode_alat: "HT-DRG-01",
    nama_barang: "Handie Talkie Baofeng UV-82 Dual Band",
    kategori: "Komunikasi",
    kondisi: "Sangat Baik",
    status: "tersedia",
    lokasi_pos: "Basecamp Arjosari Siaga",
  },
  {
    id: "inv-002",
    kode_alat: "RMP-DRG-02",
    nama_barang: "Rompi Scotlite Satgas Siaga 24 Jam",
    kategori: "Keselamatan",
    kondisi: "Baik",
    status: "dipinjam",
    lokasi_pos: "Posko Lawang Siaga",
    peminjam_nama: "Cak Rudi Satgas",
    peminjam_phone: "081234567890",
    tgl_pinjam: "8 Oktober 2026",
  },
  {
    id: "inv-003",
    kode_alat: "MED-DRG-03",
    nama_barang: "Tas Ransel P3K Tanggap Musibah & Oksigen Mini",
    kategori: "P3K",
    kondisi: "Sangat Baik",
    status: "tersedia",
    lokasi_pos: "Basecamp Sawojajar Siaga",
  },
  {
    id: "inv-004",
    kode_alat: "POS-DRG-04",
    nama_barang: "Toolkit Kunci Pas & Kompresor Ban Portabel",
    kategori: "Perlengkapan Pos",
    kondisi: "Baik",
    status: "tersedia",
    lokasi_pos: "Posko Gadang Siaga",
  },
];

let inMemoryCache: InventarisItem[] = [...SEED_INVENTARIS];

export const InventarisStorage = {
  getItems(): InventarisItem[] {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
  resetForTest() {
    inMemoryCache = [...SEED_INVENTARIS];
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};
