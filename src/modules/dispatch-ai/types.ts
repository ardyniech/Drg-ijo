export type IncidentSeverity = "tinggi" | "sedang" | "rendah";

export interface AiDispatchAnalysis {
  severity: IncidentSeverity;
  priorityTitle: string;
  emergencySteps: string[];
  dispatchRecommendation: string;
  nearestShelterAdvice: string;
  isAiGenerated: boolean;
  note?: string;
}

export interface AnalyzeDispatchParams {
  category: string;
  location: string;
  description: string;
  driverName?: string;
}
