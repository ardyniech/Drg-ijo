import React from "react";
import { Bike, Shield, Flame, Crown, Sparkles } from "lucide-react";

export type CanonicalJenjangKey = "calon" | "muda" | "madya" | "purna";
export type KaderisasiLevelKey = "Calon" | "Muda" | "Madya" | "Utama" | "Kehormatan";

export interface OjolJenjangMeta {
  key: CanonicalJenjangKey;
  kaderisasiLevel: KaderisasiLevelKey;
  title: string;
  nickname: string;
  badgeLabel: string;
  badgeColor: string;
  borderClass: string;
  bgLightClass: string;
  icon: typeof Bike;
  description: string;
  roadQuote: string;
}

export const OJOL_JENJANG_REGISTRY: Record<string, OjolJenjangMeta> = {
  calon: {
    key: "calon",
    kaderisasiLevel: "Calon",
    title: "Driver Anyar",
    nickname: "Rookie Aspal",
    badgeLabel: "Anyar",
    badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300",
    borderClass: "border-slate-300 dark:border-slate-700",
    bgLightClass: "from-slate-50 to-slate-100/50 dark:from-slate-900/40 dark:to-slate-900/20",
    icon: Bike,
    description:
      "Driver anyar baru merapat di pangkalan, salam satu aspal, masa orientasi jalur & etika aspal.",
    roadQuote: "Pelan-pelan asal selamat, jangan lupa senyum sama penumpang.",
  },
  muda: {
    key: "muda",
    kaderisasiLevel: "Muda",
    title: "Pejuang Aspal",
    nickname: "Rider Jalur",
    badgeLabel: "Pejuang",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    borderClass: "border-emerald-300 dark:border-emerald-700",
    bgLightClass: "from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-emerald-900/20",
    icon: Shield,
    description:
      "Driver tangguh jam terbang padat, aktif piket satgas, gercep bantu dulur mogok di jalan.",
    roadQuote: "Gas tipis-tipis, aspal basah tetap santui, solidaritas dulur nomor satu.",
  },
  madya: {
    key: "madya",
    kaderisasiLevel: "Madya",
    title: "Suhu Gacor",
    nickname: "Jawara Aspal",
    badgeLabel: "Gacor",
    badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    borderClass: "border-amber-300 dark:border-amber-700",
    bgLightClass: "from-amber-50 to-orange-50/50 dark:from-amber-950/40 dark:to-amber-900/20",
    icon: Flame,
    description:
      "Senior panutan bintang lima, hafal jalan tikus, orderan gacor, disegani rekan se-pangkalan.",
    roadQuote: "Orderan boleh gacor melimpah, kopi hitam pangkalan pantang dingin.",
  },
  purna: {
    key: "purna",
    kaderisasiLevel: "Utama",
    title: "Sesepuh Aspal",
    nickname: "Tetua Pangkalan",
    badgeLabel: "Sesepuh",
    badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    borderClass: "border-purple-300 dark:border-purple-700",
    bgLightClass: "from-purple-50 to-indigo-50/50 dark:from-purple-950/40 dark:to-purple-900/20",
    icon: Crown,
    description:
      "Tetua pangkalan yang bijaksana, penengah senggolan jalur, penjaga marwah keluarga besar DRG.",
    roadQuote: "Jalanan keras kalau egois, tapi sejuk kalau saling jaga seduluran.",
  },
  kehormatan: {
    key: "purna",
    kaderisasiLevel: "Kehormatan",
    title: "Legenda Aspal",
    nickname: "Panglima Basecamp",
    badgeLabel: "Legenda",
    badgeColor: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    borderClass: "border-rose-300 dark:border-rose-700",
    bgLightClass: "from-rose-50 to-amber-50/50 dark:from-rose-950/40 dark:to-rose-900/20",
    icon: Sparkles,
    description: "Gelar kehormatan tertinggi pembina komunitas, penjaga marwah abadi satu aspal.",
    roadQuote: "Satu aspal, satu rasa, sampai akhir masa.",
  },
};

/**
 * Normalizes any level string (e.g. 'Calon', 'calon', 'pratama', 'muda', 'Madya', 'Utama', 'purna')
 * into canonical key ('calon' | 'muda' | 'madya' | 'purna').
 */
export function normalizeOjolJenjangKey(raw?: string | null): CanonicalJenjangKey {
  if (!raw) return "calon";
  const s = raw.toLowerCase().trim();
  if (s === "calon" || s === "pratama" || s.includes("anyar") || s.includes("rookie"))
    return "calon";
  if (s === "muda" || s.includes("pejuang") || s.includes("rider")) return "muda";
  if (s === "madya" || s.includes("suhu") || s.includes("gacor") || s.includes("jawara"))
    return "madya";
  if (
    s === "purna" ||
    s === "utama" ||
    s === "kehormatan" ||
    s.includes("sesepuh") ||
    s.includes("legenda") ||
    s.includes("tetua")
  ) {
    return "purna";
  }
  return "calon";
}

/**
 * Retrieve metadata for any given jenjang string.
 */
export function getOjolJenjang(raw?: string | null): OjolJenjangMeta {
  if (!raw) return OJOL_JENJANG_REGISTRY.calon;
  const s = raw.toLowerCase().trim();
  if (s === "kehormatan" || s.includes("legenda")) {
    return OJOL_JENJANG_REGISTRY.kehormatan;
  }
  if (s === "utama" || s === "purna" || s.includes("sesepuh")) {
    return OJOL_JENJANG_REGISTRY.purna;
  }
  if (s === "madya" || s.includes("suhu") || s.includes("gacor")) {
    return OJOL_JENJANG_REGISTRY.madya;
  }
  if (s === "muda" || s.includes("pejuang")) {
    return OJOL_JENJANG_REGISTRY.muda;
  }
  return OJOL_JENJANG_REGISTRY.calon;
}

/**
 * Formatted title for display, e.g. "Pejuang Aspal (Rider Jalur)"
 */
export function getOjolJenjangTitle(raw?: string | null): string {
  const meta = getOjolJenjang(raw);
  return `${meta.title} (${meta.nickname})`;
}

/**
 * Standard select options for User/Member forms (persisting 'calon' | 'muda' | 'madya' | 'purna')
 */
export const OJOL_JENJANG_SELECT_OPTIONS: Array<{
  value: CanonicalJenjangKey;
  label: string;
  nickname: string;
}> = [
  { value: "calon", label: "Driver Anyar", nickname: "Rookie Aspal" },
  { value: "muda", label: "Pejuang Aspal", nickname: "Rider Jalur" },
  { value: "madya", label: "Suhu Gacor", nickname: "Jawara Aspal" },
  { value: "purna", label: "Sesepuh Aspal", nickname: "Tetua Pangkalan" },
];

/**
 * Standard filter options for Member and Kaderisasi filters
 */
export const OJOL_JENJANG_FILTER_OPTIONS = [
  { val: "all", label: "Semua Tingkat Aspal" },
  { val: "calon", label: "Driver Anyar (Rookie)" },
  { val: "muda", label: "Pejuang Aspal (Rider)" },
  { val: "madya", label: "Suhu Gacor (Jawara)" },
  { val: "purna", label: "Sesepuh Aspal (Tetua)" },
];

/**
 * Kaderisasi filter options (matches currentLevel: 'Calon' | 'Muda' | 'Madya' | 'Utama')
 */
export const OJOL_KADERISASI_FILTER_OPTIONS = [
  { val: "all", label: "Semua Tingkat Aspal" },
  { val: "Calon", label: "Driver Anyar (Rookie Aspal)" },
  { val: "Muda", label: "Pejuang Aspal (Rider Jalur)" },
  { val: "Madya", label: "Suhu Gacor (Jawara Aspal)" },
  { val: "Utama", label: "Sesepuh Aspal (Tetua Pangkalan)" },
];
