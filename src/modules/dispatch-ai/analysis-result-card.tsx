import { AlertTriangle } from "lucide-react";
import { AiDispatchAnalysis } from "./types";

interface AnalysisResultCardProps {
  analysis: AiDispatchAnalysis;
}

export function AnalysisResultCard({ analysis }: AnalysisResultCardProps) {
  return (
    <div className="mt-4 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
      <div className="flex items-center justify-between font-bold text-foreground">
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          {analysis.priorityTitle}
        </span>
        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] uppercase">
          Tingkat: {analysis.severity}
        </span>
      </div>
      <div className="space-y-1 pt-1">
        <div className="font-semibold text-foreground">Langkah Penyelamatan:</div>
        <ul className="list-inside list-disc space-y-0.5 text-muted-foreground">
          {analysis.emergencySteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
      <div className="border-t border-primary/20 pt-2 text-[11px]">
        <div className="font-semibold text-foreground">Rekomendasi Satgas:</div>
        <p className="text-muted-foreground">{analysis.dispatchRecommendation}</p>
      </div>
      {analysis.nearestShelterAdvice && (
        <div className="pt-1 text-[11px]">
          <div className="font-semibold text-foreground">Shelter Terdekat:</div>
          <p className="text-muted-foreground">{analysis.nearestShelterAdvice}</p>
        </div>
      )}
    </div>
  );
}
