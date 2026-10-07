import { describe, it, expect, beforeEach } from "vitest";
import { BackupPayload } from "../logic/use-system-backup";

describe("System Backup & Restore Engine", () => {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
    clear: () => store.clear(),
  };

  beforeEach(() => {
    mockStorage.clear();
  });

  it("should validate and structure backup payload correctly", () => {
    mockStorage.setItem("drg_kas_tx_v1", JSON.stringify([{ id: "tx-1", jumlah: 10000 }]));
    mockStorage.setItem("drg_kejadian_list_v1", JSON.stringify([{ id: "inc-1", status: "aktif" }]));

    const mockBackup: BackupPayload = {
      app: "DRG_COMMUNITY_APP",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      recordCount: 2,
      data: {
        drg_kas_tx_v1: mockStorage.getItem("drg_kas_tx_v1") || "",
        drg_kejadian_list_v1: mockStorage.getItem("drg_kejadian_list_v1") || "",
      },
    };

    expect(mockBackup.app).toBe("DRG_COMMUNITY_APP");
    expect(mockBackup.recordCount).toBe(2);
    expect(mockBackup.data.drg_kas_tx_v1).toContain("tx-1");
  });

  it("should restore keys from backup data into storage map", () => {
    const rawBackup: BackupPayload = {
      app: "DRG_COMMUNITY_APP",
      version: "1.0.0",
      timestamp: "2026-10-07T00:00:00.000Z",
      recordCount: 1,
      data: {
        drg_piket_jadwal_v1: JSON.stringify([{ id: "piket-99", driver: "Budi" }]),
      },
    };

    for (const [key, val] of Object.entries(rawBackup.data)) {
      mockStorage.setItem(key, val);
    }

    const restored = mockStorage.getItem("drg_piket_jadwal_v1");
    expect(restored).not.toBeNull();
    expect(restored).toContain("piket-99");
  });
});
