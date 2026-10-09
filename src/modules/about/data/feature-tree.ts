import type { FeatureBranch } from "./types";
import { operationalBranches } from "./branches-operational";
import { organizationBranches } from "./branches-organization";

export type { FeatureStatus, FeatureNode, FeatureBranch } from "./types";
export { featureStatusMeta } from "./status-meta";

export const featureBranches: FeatureBranch[] = [...operationalBranches, ...organizationBranches];
