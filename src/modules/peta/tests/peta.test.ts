import { describe, it, expect } from "vitest";
import { SEED_SHELTERS, SEED_DRIVERS } from "../storage/peta-storage";

describe("Peta & Radar Data Storage", () => {
  it("has valid seed shelters with coordinates and facilities", () => {
    expect(SEED_SHELTERS.length).toBeGreaterThan(0);
    expect(SEED_SHELTERS[0]).toHaveProperty("lat");
    expect(SEED_SHELTERS[0]).toHaveProperty("lng");
    expect(SEED_SHELTERS[0].fasilitas.length).toBeGreaterThan(0);
  });

  it("has active driver radar points with status and distances", () => {
    expect(SEED_DRIVERS.length).toBeGreaterThan(0);
    expect(SEED_DRIVERS[0]).toHaveProperty("status");
    expect(SEED_DRIVERS[0]).toHaveProperty("distance_km");
  });
});
