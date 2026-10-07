import { describe, it, expect, beforeEach } from "vitest";
import {
  getKaderisasiList,
  updateMemberStatus,
  saveKaderisasiList,
} from "../storage/kaderisasi-storage";

describe("Kaderisasi Storage & Logic (Production Mode)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("handles empty initial kaderisasi list", () => {
    const list = getKaderisasiList();
    expect(list).toEqual([]);
  });

  it("updates member status to promoted and upgrades level", () => {
    const sample = {
      id: "kad-test",
      memberId: "DRG-001",
      fullName: "Driver Test",
      currentLevel: "Calon" as const,
      targetLevel: "Muda" as const,
      joinedAt: "2026-01-01",
      piketAttendanceCount: 10,
      kasCompliancePercent: 100,
      points: 90,
      status: "eligible" as const,
      requirements: [],
    };
    saveKaderisasiList([sample]);

    const updated = updateMemberStatus("kad-test", "promoted", "Lulus sidang pleno");
    const target = updated.find((m) => m.id === "kad-test");
    expect(target?.status).toBe("promoted");
    expect(target?.currentLevel).toBe("Muda");
    expect(target?.evaluatorNotes).toBe("Lulus sidang pleno");
  });
});
