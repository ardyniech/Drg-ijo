import { describe, it, expect, beforeEach } from "vitest";
import { KejadianStorage } from "../storage/kejadian-storage";

describe("KejadianStorage", () => {
  beforeEach(() => {
    KejadianStorage.saveIncidents([
      {
        id: "sos-test-01",
        driver_id: "user-budi",
        driver_name: "Budi Santoso",
        driver_phone: "081234567890",
        kategori: "kecelakaan",
        tingkat: "darurat_tinggi",
        deskripsi: "Senggolan motor",
        lat: -7.9482,
        lng: 112.6178,
        lokasi_teks: "Jl. Soekarno Hatta No. 12",
        status: "aktif",
        responders: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  });

  it("should return seed incidents when empty", () => {
    const incidents = KejadianStorage.getIncidents();
    expect(Array.isArray(incidents)).toBe(true);
    expect(incidents.length).toBeGreaterThanOrEqual(1);
    expect(incidents[0]).toHaveProperty("driver_name");
  });

  it("should support saving and retrieving incidents", () => {
    const initial = KejadianStorage.getIncidents();
    const testItem = {
      id: "test-sos-99",
      driver_id: "drv-99",
      driver_name: "Test Driver",
      driver_phone: "0812999999",
      kategori: "kecelakaan" as const,
      tingkat: "darurat_tinggi" as const,
      deskripsi: "Test incident description",
      lat: -7.9,
      lng: 112.6,
      lokasi_teks: "Malang Kota",
      status: "aktif" as const,
      responders: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    KejadianStorage.saveIncidents([testItem, ...initial]);
    const retrieved = KejadianStorage.getIncidents();
    expect(retrieved.some((i) => i.id === "test-sos-99")).toBe(true);
  });
});
