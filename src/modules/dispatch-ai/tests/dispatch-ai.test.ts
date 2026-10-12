import { describe, it, expect } from "vitest";
import { createDefaultSafetyFallback, validateDispatchParams } from "../safety-engine";

describe("AI Safety Intelligence & Dispatch Engine", () => {
  it("determines 'tinggi' severity for crash or medical emergencies", () => {
    const crashFallback = createDefaultSafetyFallback("senggolan jalur", "Jl. Dinoyo");
    expect(crashFallback.severity).toBe("tinggi");
    expect(crashFallback.priorityTitle).toContain("Dinoyo");
    expect(crashFallback.emergencySteps.length).toBeGreaterThan(0);
    expect(crashFallback.isAiGenerated).toBe(false);

    const medicalFallback = createDefaultSafetyFallback("darurat medis", "Lowokwaru");
    expect(medicalFallback.severity).toBe("tinggi");
  });

  it("determines 'sedang' severity for standard mechanical breakdowns", () => {
    const breakdownFallback = createDefaultSafetyFallback("mogok rantai", "Gadang");
    expect(breakdownFallback.severity).toBe("sedang");
    expect(breakdownFallback.priorityTitle).toContain("Gadang");
  });

  it("validates incident parameters and rejects empty inputs", () => {
    expect(validateDispatchParams({ location: "", category: "mogok" })).toBe(false);
    expect(validateDispatchParams({ location: "Suhat", category: "" })).toBe(false);
    expect(validateDispatchParams({ location: "Suhat", category: "mogok" })).toBe(true);
    expect(validateDispatchParams({})).toBe(false);
  });
});
