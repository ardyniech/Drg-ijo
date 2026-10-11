import { AiDispatchAnalysis, AnalyzeDispatchParams } from "./types";

export function createDefaultSafetyFallback(
  category: string,
  location: string,
): AiDispatchAnalysis {
  const isMedisOrCrash =
    category.toLowerCase().includes("medis") ||
    category.toLowerCase().includes("senggol") ||
    category.toLowerCase().includes("darurat");

  return {
    severity: isMedisOrCrash ? "tinggi" : "sedang",
    priorityTitle: `Panduan Keselamatan Satgas — ${location || "Jalur Lapangan"}`,
    emergencySteps: [
      "Tepikan motor/mobil ke tempat aman dan nyalakan lampu hazard.",
      "Laporkan koordinat ke grup pangkalan terdekat via WhatsApp atau kanal radio.",
      "Jangan tinggalkan kendaraan tanpa kunci ganda jika menunggu bantuan relawan.",
    ],
    dispatchRecommendation: "Pemberitahuan telah dicatat di log antrean satgas wilayah terdekat.",
    nearestShelterAdvice:
      "Arahkan dulur ke posko pangkalan DRG terdekat jika masih bisa melaju pelan.",
    isAiGenerated: false,
    note: "Penyangga keselamatan darurat offline.",
  };
}

export function validateDispatchParams(params: Partial<AnalyzeDispatchParams>): boolean {
  if (!params) return false;
  if (!params.location || typeof params.location !== "string" || params.location.trim() === "") {
    return false;
  }
  if (!params.category || typeof params.category !== "string" || params.category.trim() === "") {
    return false;
  }
  return true;
}
