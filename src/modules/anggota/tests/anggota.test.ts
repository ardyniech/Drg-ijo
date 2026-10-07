import { describe, it, expect } from "vitest";
import { SEED_MEMBERS } from "../storage/anggota-storage";
import { MemberRecord } from "../types";

describe("Anggota Storage & Directory Logic", () => {
  it("provides valid seed members list with KTA and valid statuses", () => {
    expect(SEED_MEMBERS.length).toBeGreaterThan(0);
    SEED_MEMBERS.forEach((member) => {
      expect(member.id).toBeTruthy();
      expect(member.nama).toBeTruthy();
      expect(member.no_kta).toMatch(/^DRG-\d{4}-\d{3}$/);
      expect(["aktif", "pending_review", "nonaktif"]).toContain(member.status);
      expect(member.pangkalan).toBeTruthy();
      expect(member.plat_nomor).toBeTruthy();
    });
  });

  it("contains both verified and pending review drivers in seed dataset", () => {
    const verified = SEED_MEMBERS.filter((m) => m.status === "aktif");
    const pending = SEED_MEMBERS.filter((m) => m.status === "pending_review");

    expect(verified.length).toBeGreaterThan(0);
    expect(pending.length).toBeGreaterThan(0);
  });

  it("accurately filters drivers by status and pangkalan", () => {
    const pangkalanSuhat = SEED_MEMBERS.filter((m) => m.pangkalan === "Pangkalan Suhat");
    expect(pangkalanSuhat.length).toBeGreaterThan(0);

    const pendingInSawojajar = SEED_MEMBERS.filter(
      (m) => m.pangkalan === "Pangkalan Sawojajar" && m.status === "pending_review",
    );
    expect(pendingInSawojajar.length).toBeGreaterThanOrEqual(1);
    expect(pendingInSawojajar[0].nama).toBe("Dedi Prasetyo");
  });

  it("correctly sorts members alphabetically and by recent id", () => {
    const sortedAlpha = [...SEED_MEMBERS].sort((a, b) => a.nama.localeCompare(b.nama));
    expect(sortedAlpha[0].nama).toBe("Ardy Syafii");

    const sortedReverse = [...SEED_MEMBERS].sort((a, b) => b.nama.localeCompare(a.nama));
    expect(sortedReverse[0].nama).toBe("Hendra Kurniawan");
  });
});
