import { z } from "zod";
import { KasSkRecord } from "../types";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";

const STORAGE_KEY = "drg_kas_sk_records_v1";

const KasSkSchema = z.object({
  id: z.string(),
  no_sk: z.string(),
  tanggal: z.string(),
  kategori: z.enum([
    "santunan_laka",
    "santunan_duka",
    "bantuan_kesehatan",
    "bantuan_kendaraan",
    "modal_koperasi",
  ]),
  judul: z.string(),
  nominal: z.number(),
  penerima_nama: z.string(),
  penerima_kta: z.string(),
  penerima_pangkalan: z.string(),
  alasan: z.string(),
  dasar_keputusan: z.string(),
  nama_ketua: z.string(),
  nama_bendahara: z.string(),
  status: z.enum(["disahkan", "diajukan", "dicairkan"]),
  created_at: z.string(),
});

const INITIAL_SK_RECORDS: KasSkRecord[] = [
  {
    id: "sk-kas-001",
    no_sk: "014/SK-KAS/DRG-MLG/X/2026",
    tanggal: "2026-10-06",
    kategori: "santunan_laka",
    judul: "Santunan Gotong Royong Musibah Laka Lantas Jalur Lawang",
    nominal: 1500000,
    penerima_nama: "Agus Pratama",
    penerima_kta: "DRG-MLG-089",
    penerima_pangkalan: "Posko Lawang Siaga",
    alasan:
      "Bantuan biaya perbaikan rem motor dan pengobatan jalan akibat laka lantas saat on-bit.",
    dasar_keputusan: "Musyawarah Kilat Korlap & Pasal 8 AD/ART Dana Sosial Gotong Royong DRG.",
    nama_ketua: "H. Hendra Wijaya",
    nama_bendahara: "Hj. Siti Rahmawati",
    status: "dicairkan",
    created_at: "2026-10-06T14:30:00Z",
  },
  {
    id: "sk-kas-002",
    no_sk: "015/SK-KAS/DRG-MLG/X/2026",
    tanggal: "2026-10-08",
    kategori: "santunan_duka",
    judul: "Dana Tali Asih Duka Cita Dulur Pangkalan Arjosari",
    nominal: 2000000,
    penerima_nama: "Keluarga Alm. Cak Bambang",
    penerima_kta: "DRG-MLG-012",
    penerima_pangkalan: "Basecamp Arjosari Guyub",
    alasan:
      "Santunan duka cita wafatnya anggota sesepuh pangkalan untuk keluarga yang ditinggalkan.",
    dasar_keputusan: "Rembug Pengurus Harian & Mandat Kas Kesejahteraan Sosial.",
    nama_ketua: "H. Hendra Wijaya",
    nama_bendahara: "Hj. Siti Rahmawati",
    status: "disahkan",
    created_at: "2026-10-08T09:15:00Z",
  },
];

export const KasSkStorage = {
  getAll(): KasSkRecord[] {
    return safeReadStorage(STORAGE_KEY, z.array(KasSkSchema), INITIAL_SK_RECORDS);
  },
  saveAll(records: KasSkRecord[]): boolean {
    return safeWriteStorage(STORAGE_KEY, records);
  },
  create(entry: Omit<KasSkRecord, "id" | "no_sk" | "created_at">): KasSkRecord {
    const list = this.getAll();
    const padNum = String(list.length + 1).padStart(3, "0");
    const no_sk = `${padNum}/SK-KAS/DRG-MLG/X/2026`;
    const newRecord: KasSkRecord = {
      ...entry,
      id: `sk-kas-${Date.now().toString(36)}`,
      no_sk,
      created_at: new Date().toISOString(),
    };
    const updated = [newRecord, ...list];
    this.saveAll(updated);
    return newRecord;
  },
  updateStatus(id: string, status: KasSkRecord["status"]): KasSkRecord | null {
    const list = this.getAll();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], status };
    this.saveAll(list);
    return list[idx];
  },
};
