import type { FeatureBranch } from "./types";
import rawFeatureTreeData from "./feature-tree.json";

export type { FeatureStatus, FeatureNode, FeatureBranch } from "./types";
export { featureStatusMeta } from "./status-meta";

export const featureTreeData = rawFeatureTreeData;
export const featureBranches: FeatureBranch[] = (rawFeatureTreeData.branches ||
  []) as FeatureBranch[];
