import { describe, it, expect } from "vitest";
import {
  calculateTrendData,
  calculateCategoryBreakdown,
  calculateStatsSummary,
} from "../logic/use-kas-transparency-data";
import { Tx } from "../types";

describe("Kas Transparency Data Calculations", () => {
  it("provides valid historical trend data when no transactions exist", () => {
    const trend = calculateTrendData([]);
    expect(trend.length).toBeGreaterThan(0);

    const stats = calculateStatsSummary([]);
    expect(stats.totalSocial).toBeGreaterThan(0);
    expect(stats.totalCooperative).toBeGreaterThan(0);
  });

  it("correctly aggregates social and cooperative ledger sums", () => {
    const mockTx: Tx[] = [
      {
        id: "tx-1",
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
        id: "tx-2",
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

    const categories = calculateCategoryBreakdown(mockTx);
    expect(categories.length).toBeGreaterThan(0);

    const stats = calculateStatsSummary(mockTx);
    expect(stats.totalSocial).toBe(1000000);
    expect(stats.totalCooperative).toBe(2000000);
  });
});
