import {
  CanonicalJenjangKey,
  KaderisasiLevelKey,
  OjolJenjangMeta,
  OJOL_JENJANG_REGISTRY,
  OJOL_JENJANG_SELECT_OPTIONS,
  OJOL_JENJANG_FILTER_OPTIONS,
  OJOL_KADERISASI_FILTER_OPTIONS,
} from "./ojol-jenjang-registry";

export type { CanonicalJenjangKey, KaderisasiLevelKey, OjolJenjangMeta };
export {
  OJOL_JENJANG_REGISTRY,
  OJOL_JENJANG_SELECT_OPTIONS,
  OJOL_JENJANG_FILTER_OPTIONS,
  OJOL_KADERISASI_FILTER_OPTIONS,
};

/**
 * Normalizes any level string into canonical key ('calon' | 'muda' | 'madya' | 'purna').
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
