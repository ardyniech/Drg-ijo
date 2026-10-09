export type FeatureStatus = "siap" | "sebagian" | "rencana";

export interface FeatureNode {
  label: string;
  status: FeatureStatus;
  note?: string;
  children?: FeatureNode[];
}

export interface FeatureBranch {
  id: string;
  label: string;
  summary: string;
  children: FeatureNode[];
}
