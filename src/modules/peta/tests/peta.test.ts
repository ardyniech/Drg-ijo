import { describe, it, expect } from "vitest";
import { getShelters, saveShelters, getActiveDrivers } from "../storage/peta-storage";

describe("Peta & Radar Data Storage", () => {
  it("starts with empty shelter list in production (no fabricated basecamps)", () => {
    expect(getShelters()).toEqual([]);
  });

  it("persists shelters added by pengurus and returns them on read", () => {
    const shelter = {
      id: "sh-01",
      nama: "Basecamp Uji",
      alamat: "Jl. Uji No. 1",
      lat: -7.9485,
      lng: 112.6175,
      korlap_nama: "Korlap Uji",
      korlap_phone: "08120000000",
      kapasitas: 10,
      fasilitas: ["P3K"],
    };
    saveShelters([shelter]);
    const stored = getShelters();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toHaveProperty("lat");
    expect(stored[0]).toHaveProperty("lng");
    expect(stored[0].fasilitas.length).toBeGreaterThan(0);
  });

  it("handles empty initial active driver radar points in production", () => {
    expect(Array.isArray(getActiveDrivers())).toBe(true);
    expect(getActiveDrivers()).toHaveLength(0);
  });
});
