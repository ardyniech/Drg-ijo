import { describe, it, expect, beforeEach } from "vitest";
import { getEtikCases, addEtikCase, updateCaseStatus } from "../storage/etik-storage";

describe("Dewan Etik Storage & Logic (Production Mode)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("handles empty initial etik cases properly", () => {
    const cases = getEtikCases();
    expect(cases).toEqual([]);
  });

  it("adds new etik violation case and updates resolution", () => {
    const newCase = addEtikCase({
      reportedMemberName: "Test Driver",
      reportedMemberId: "DRG-999",
      category: "Pelanggaran Disiplin",
      severity: "Ringan",
      location: "Pangkalan A",
      incidentDate: "2026-05-15",
      description: "Tidak mengenakan seragam saat piket satgas.",
    });

    expect(newCase.id).toBeDefined();
    expect(newCase.status).toBe("investigating");

    const updated = updateCaseStatus(newCase.id, "resolved", "Selesai dibina");
    const target = updated.find((c) => c.id === newCase.id);
    expect(target?.status).toBe("resolved");
    expect(target?.sanctionSummary).toBe("Selesai dibina");
  });
});
