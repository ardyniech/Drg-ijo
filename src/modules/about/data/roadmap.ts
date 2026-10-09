import rawRoadmapData from "./roadmap.json";

export interface RoadmapPhase {
  phase: string;
  title: string;
  progress: number;
  status: "selesai" | "jalan" | "rencana";
  items: string[];
  completedItems?: number;
  totalItems?: number;
}

export interface RoadmapDataPayload {
  generatedAt: string;
  source: string;
  phases: RoadmapPhase[];
}

export const roadmapData: RoadmapDataPayload = rawRoadmapData as RoadmapDataPayload;
export const roadmapPhases: RoadmapPhase[] = (rawRoadmapData.phases || []) as RoadmapPhase[];
