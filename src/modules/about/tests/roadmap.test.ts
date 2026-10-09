import { describe, it, expect } from "vitest";
import { roadmapPhases, roadmapData } from "../data/roadmap";

describe("Roadmap Progress Dynamic Verification", () => {
  it("should have auto-generated roadmap data with source metadata", () => {
    expect(roadmapData).toBeDefined();
    expect(roadmapData.source).toBe("codebase feature inspection");
    expect(roadmapData.phases.length).toBeGreaterThanOrEqual(4);
  });

  it("should reflect 100% completion for Fase 1 and Fase 2", () => {
    const fase1 = roadmapPhases.find((p) => p.phase === "Fase 1");
    const fase2 = roadmapPhases.find((p) => p.phase === "Fase 2");

    expect(fase1).toBeDefined();
    expect(fase1?.progress).toBe(100);
    expect(fase1?.status).toBe("selesai");

    expect(fase2).toBeDefined();
    expect(fase2?.progress).toBe(100);
    expect(fase2?.status).toBe("selesai");
    expect(fase2?.completedItems).toBe(6);
  });

  it("should correctly compute Fase 3 progress", () => {
    const fase3 = roadmapPhases.find((p) => p.phase === "Fase 3");
    expect(fase3).toBeDefined();
    expect(fase3?.progress).toBe(100);
    expect(fase3?.completedItems).toBe(5);
  });
});
