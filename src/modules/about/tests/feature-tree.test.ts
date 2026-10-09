import { describe, it, expect } from "vitest";
import { featureBranches, featureTreeData } from "../data/feature-tree";

describe("Feature Tree Automated Inspection Verification", () => {
  it("should have auto-generated feature tree data with counts and metadata", () => {
    expect(featureTreeData).toBeDefined();
    expect(featureTreeData.source).toContain("feature tree inspection");
    expect(featureTreeData.counts).toBeDefined();
    expect(featureTreeData.counts.siap).toBeGreaterThanOrEqual(20);
    expect(featureTreeData.counts.total).toBeGreaterThanOrEqual(24);
  });

  it("should contain all primary architectural branches", () => {
    const branchIds = featureBranches.map((b) => b.id);
    expect(branchIds).toContain("akun");
    expect(branchIds).toContain("jalur");
    expect(branchIds).toContain("kas");
    expect(branchIds).toContain("organisasi");
    expect(branchIds).toContain("data");
  });

  it("should verify completed features accurately", () => {
    const kasBranch = featureBranches.find((b) => b.id === "kas");
    expect(kasBranch).toBeDefined();

    const qrisFeat = kasBranch?.children.find((c) => c.label.includes("QRIS"));
    expect(qrisFeat).toBeDefined();
    expect(qrisFeat?.status).toBe("siap");

    const skKasFeat = kasBranch?.children.find((c) => c.label.includes("SK Kas"));
    expect(skKasFeat).toBeDefined();
    expect(skKasFeat?.status).toBe("siap");
  });
});
