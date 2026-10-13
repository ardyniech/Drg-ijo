import { z } from "zod";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
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

const InventarisSchema: z.ZodType<InventarisItem> = z.any();
const InventarisListSchema = z.array(InventarisSchema);

let inMemoryCache: InventarisItem[] = [...SEED_INVENTARIS];

export const InventarisStorage = {
  getItems(): InventarisItem[] {
    const items = safeReadStorage(STORAGE_KEY, InventarisListSchema, inMemoryCache);
    inMemoryCache = items;
    return items;
  },
  saveItems(items: InventarisItem[]) {
    inMemoryCache = items;
    safeWriteStorage(STORAGE_KEY, items);
  },
  resetForTest() {
    inMemoryCache = [...SEED_INVENTARIS];
    safeWriteStorage(STORAGE_KEY, inMemoryCache);
  },
};
