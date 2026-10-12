import { describe, it, expect } from "vitest";
import { CachedIncident, openIncidentDB, saveIncidentToLocalCache } from "./indexeddb";

describe("IndexedDB Offline Incident Cache", () => {
  it("should define valid CachedIncident interface fields", () => {
    const sampleIncident: CachedIncident = {
      id: "inc-99",
      userId: "user-123",
      status: "aktif",
      latitude: -6.2,
      longitude: 106.8,
      kategori: "Darurat Mesin",
      createdAt: "2026-10-12T00:00:00.000Z",
      updatedAt: "2026-10-12T00:00:00.000Z",
    };

    expect(sampleIncident.id).toBe("inc-99");
    expect(sampleIncident.status).toBe("aktif");
    expect(sampleIncident.latitude).toBe(-6.2);
  });

  it("should reject safely when IndexedDB is not available in environment", async () => {
    // In node/vitest without indexedDB polyfill, openIncidentDB should reject with a clear error
    if (typeof window === "undefined" || !window.indexedDB) {
      await expect(openIncidentDB()).rejects.toThrow(
        "IndexedDB is not supported in this environment",
      );
    }
  });

  it("should reject saveIncidentToLocalCache gracefully if database cannot open", async () => {
    if (typeof window === "undefined" || !window.indexedDB) {
      const mockIncident: CachedIncident = {
        id: "inc-100",
        userId: "user-test",
        status: "aktif",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await expect(saveIncidentToLocalCache(mockIncident)).rejects.toThrow();
    }
  });
});
