import { MemberSortOption } from "../types";
import { OJOL_JENJANG_FILTER_OPTIONS } from "@/lib/ojol-jenjang";

export const STATUS_OPTS = [
  { val: "all", label: "Semua Dulur" },
  { val: "aktif", label: "Sah Satu Aspal" },
  { val: "pending_review", label: "Menunggu PIC" },
  { val: "nonaktif", label: "Rehat Jalur" },
];

export const JENJANG_OPTS = OJOL_JENJANG_FILTER_OPTIONS;

export const ROLE_OPTS = [
  { val: "all", label: "Semua Amanah" },
  { val: "driver", label: "Rider Jalur" },
  { val: "satgas", label: "Satgas Lapangan" },
  { val: "korlap", label: "Korlap Wilayah" },
  { val: "sekretaris", label: "Juru Tulis Rembug" },
  { val: "bendahara", label: "Bendahara Kas" },
  { val: "ketua", label: "Ketua Paguyuban" },
  { val: "admin", label: "Pengurus Basecamp" },
];

export const SORT_OPTS: Array<{ val: MemberSortOption; label: string }> = [
  { val: "terbaru", label: "Terbaru" },
  { val: "nama_asc", label: "Nama (A-Z)" },
  { val: "nama_desc", label: "Nama (Z-A)" },
  { val: "kta", label: "No KTA" },
];
