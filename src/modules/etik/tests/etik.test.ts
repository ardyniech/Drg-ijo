import { describe, it, expect } from "vitest";
import { getEtikCases, addEtikCase, updateCaseStatus } from "../storage/etik-storage";

describe("Dewan Etik Storage & Logic", () => {
  it("loads initial etik cases properly", () => {
    const cases = getEtikCases();
    expect(cases.length).toBeGreaterThan(0);
    expect(cases[0]).toHaveProperty("caseNumber");
  });

  it("adds new etik violation case and updates resolution", () => {
    const newCase = addEtikCase({
      reportedMemberName: "Test Driver",
      reportedMemberId: "DRG-999",
      category: "Pelanggaran Disiplin",
      severity: "Ringan",
      location: "Pangkalan A",
      incidentDate: "2024-05-15",
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
