import { useState, useCallback } from "react";
import { auth } from "@/lib/firebase-client";
import { AiDispatchAnalysis, AnalyzeDispatchParams } from "./types";
import { createDefaultSafetyFallback } from "./safety-engine";

export function useSafetyIntelligence() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AiDispatchAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeIncident = useCallback(async (params: AnalyzeDispatchParams) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/ai/dispatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as AiDispatchAnalysis;
      setAnalysis(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghubungi modul analisis";
      setError(msg);
      const fallback = createDefaultSafetyFallback(params.category, params.location);
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
