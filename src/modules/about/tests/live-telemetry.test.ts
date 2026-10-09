import { describe, it, expect } from "vitest";
import rawTelemetry from "../data/live-code-telemetry.json";

describe("Live Codebase Telemetry Verification", () => {
  it("should have valid code introspection metrics", () => {
    expect(rawTelemetry).toBeDefined();
    expect(rawTelemetry.totalModules).toBeGreaterThanOrEqual(14);
    expect(rawTelemetry.totalRoutes).toBeGreaterThanOrEqual(15);
    expect(rawTelemetry.totalStorageSchemas).toBeGreaterThanOrEqual(10);
    expect(rawTelemetry.localFirstOutboxActive).toBe(true);
    expect(rawTelemetry.zeroMockPolicy).toBe(true);
  });

  it("should verify essential local-first storage keys", () => {
    const keys = rawTelemetry.storageKeys;
    expect(keys.some((k: string) => k.includes("drg_"))).toBe(true);
  });
});
