import { describe, it, expect } from "vitest";
import {
  calculateTrendData,
  calculateCategoryBreakdown,
  calculateStatsSummary,
} from "../logic/use-kas-transparency-data";
import { Tx } from "../types";

describe("Kas Transparency Data Calculations (Production Clean)", () => {
  it("provides clean empty results for production when no transactions exist", () => {
    const trend = calculateTrendData([]);
    expect(trend).toEqual([]);

    const categories = calculateCategoryBreakdown([]);
    expect(categories).toEqual([]);

    const stats = calculateStatsSummary([]);
    expect(stats.totalSocial).toBe(0);
    expect(stats.totalCooperative).toBe(0);
    expect(stats.totalRelief).toBe(0);
    expect(stats.activeContributors).toBe(0);
  });

  it("correctly aggregates social and cooperative ledger sums from real transactions", () => {
    const realTx: Tx[] = [
      {
        id: "tx-real-1",
        ledger: "sosial",
        jenis: "masuk",
        jumlah: 1000000,
        kategori: "Iuran Sukarela",
        deskripsi: "Sumbangan Duka",
        bukti_path: null,
        tanggal: "2026-03-01",
        created_by: "user-1",
        status: "disetujui",
        approved_by: "admin-1",
        approved_at: "2026-03-01",
        catatan_approver: null,
      },
      {
        id: "tx-real-2",
        ledger: "umum",
        jenis: "masuk",
        jumlah: 2000000,
        kategori: "Iuran Wajib",
        deskripsi: "Iuran Koperasi Maret",
        bukti_path: null,
        tanggal: "2026-03-02",
        created_by: "user-2",
        status: "disetujui",
        approved_by: "admin-1",
        approved_at: "2026-03-02",
        catatan_approver: null,
      },
    ];

    const categories = calculateCategoryBreakdown(realTx);
    expect(categories.length).toBe(2);
    expect(categories.find((c) => c.name === "Iuran Sukarela")?.value).toBe(1000000);
    expect(categories.find((c) => c.name === "Iuran Wajib")?.value).toBe(2000000);

    const stats = calculateStatsSummary(realTx);
    expect(stats.totalSocial).toBe(1000000);
    expect(stats.totalCooperative).toBe(2000000);
    expect(stats.activeContributors).toBe(2);
  });
});
