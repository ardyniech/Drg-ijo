import { describe, it, expect } from "vitest";
import { SEED_SHELTERS, SEED_DRIVERS } from "../storage/peta-storage";

describe("Peta & Radar Data Storage", () => {
  it("has valid basecamp shelters with coordinates and facilities", () => {
    expect(SEED_SHELTERS.length).toBeGreaterThan(0);
    expect(SEED_SHELTERS[0]).toHaveProperty("lat");
    expect(SEED_SHELTERS[0]).toHaveProperty("lng");
    expect(SEED_SHELTERS[0].fasilitas.length).toBeGreaterThan(0);
  });

  it("handles empty initial active driver radar points in production", () => {
    expect(Array.isArray(SEED_DRIVERS)).toBe(true);
    expect(SEED_DRIVERS).toHaveLength(0);
  });
});
