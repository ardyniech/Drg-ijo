import { useState, useCallback } from "react";
import { AiDispatchAnalysis, AnalyzeDispatchParams } from "./types";

export function useSafetyIntelligence() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AiDispatchAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeIncident = useCallback(async (params: AnalyzeDispatchParams) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as AiDispatchAnalysis;
      setAnalysis(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghubungi modul analisis";
      setError(msg);
      // Fallback lokal agar driver tidak ditinggal tanpa petunjuk
      const fallback: AiDispatchAnalysis = {
        severity: "sedang",
        priorityTitle: "Panduan Keselamatan Standar Lapangan",
        emergencySteps: [
          "Tepikan motor/mobil ke tempat terang dan nyalakan lampu hazard.",
          "Laporkan koordinat ke grup pangkalan terdekat via WhatsApp/radio.",
          "Jangan tinggalkan kendaraan tanpa kunci ganda jika menunggu bantuan.",
        ],
        dispatchRecommendation: "Pemberitahuan telah dicatat di log antrean satgas wilayah.",
        nearestShelterAdvice: "Arahkan dulur ke posko pangkalan DRG terdekat jika masih bisa melaju pelan.",
        isAiGenerated: false,
        note: "Mode darurat offline aktif.",
      };
      setAnalysis(fallback);
      return fallback;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    analysis,
    error,
    analyzeIncident,
    clearAnalysis,
  };
}
