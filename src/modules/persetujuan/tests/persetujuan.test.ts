import { describe, it, expect, beforeEach } from "vitest";
import {
  getApprovalsList,
  resolveApproval,
  saveApprovalsList,
} from "../storage/persetujuan-storage";

describe("Persetujuan Akun Storage & Logic", () => {
  beforeEach(() => {
    saveApprovalsList([
      {
        id: "test-appr-1",
        type: "registrasi_baru",
        applicantName: "Rizky Ramadhan",
        applicantPhone: "081298765432",
        applicantEmail: "rizky@drg.app",
        plateNumber: "N 1234 AB",
        appliedBase: "Suhat",
        appliedRole: "Calon Anggota",
        status: "pending",
        appliedAt: new Date().toISOString(),
      },
    ]);
  });

  it("fetches approvals list correctly", () => {
    const list = getApprovalsList();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty("applicantName");
    expect(list[0]).toHaveProperty("status");
  });

  it("approves pending application", () => {
    const list = getApprovalsList();
    const pendingItem = list.find((i) => i.status === "pending");
    expect(pendingItem).toBeDefined();
    if (!pendingItem) return;

    const updated = resolveApproval(pendingItem.id, "approved", "Dokumen lengkap");
    const target = updated.find((i) => i.id === pendingItem.id);
    expect(target?.status).toBe("approved");
    expect(target?.reviewNotes).toBe("Dokumen lengkap");
    expect(target?.reviewedBy).toBe("Admin Pusat");
  });
});
