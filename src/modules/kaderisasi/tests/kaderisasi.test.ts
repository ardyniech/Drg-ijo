import { describe, it, expect } from "vitest";
import {
  getKaderisasiList,
  updateMemberStatus,
  saveKaderisasiList,
} from "../storage/kaderisasi-storage";

describe("Kaderisasi Storage & Logic", () => {
  it("loads initial kaderisasi members properly", () => {
    const list = getKaderisasiList();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty("fullName");
    expect(list[0]).toHaveProperty("currentLevel");
  });

  it("updates member status to promoted and upgrades level", () => {
    const list = getKaderisasiList();
    const candidate = list.find((m) => m.currentLevel === "Calon");
    if (!candidate) return;

    const updated = updateMemberStatus(candidate.id, "promoted", "Lulus sidang pleno");
    const target = updated.find((m) => m.id === candidate.id);
    expect(target?.status).toBe("promoted");
    expect(target?.currentLevel).toBe(candidate.targetLevel);
    expect(target?.evaluatorNotes).toBe("Lulus sidang pleno");
  });
});
