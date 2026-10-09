import { describe, it, expect, beforeEach } from "vitest";
import { KoperasiStorage } from "../storage/koperasi-storage";

describe("Koperasi Simpan Pinjam Guyub DRG", () => {
  beforeEach(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("drg_koperasi_loans_v1");
    }
  });

  it("should get initial loans and correct summary calculation", () => {
    const loans = KoperasiStorage.getLoans();
    expect(loans.length).toBeGreaterThanOrEqual(2);

    const summary = KoperasiStorage.getSummary();
    expect(summary.simpanan_pokok_total).toBeGreaterThan(0);
    expect(summary.sisa_kas_koperasi).toBeGreaterThan(0);
  });

  it("should create a new loan application with 0% interest calculation", () => {
    const created = KoperasiStorage.createLoan({
      nama_peminjam: "Slamet Santoso",
      kta_peminjam: "DRG-MLG-102",
      pangkalan: "Basecamp Sawojajar Siaga",
      keperluan: "Ganti Oli & Busi Rutin",
      nominal: 300000,
      tenor_minggu: 3,
      status: "diajukan",
      tanggal_pengajuan: "2026-10-09",
    });

    expect(created.id).toBeDefined();
    expect(created.cicilan_per_minggu).toBe(100000);
    expect(created.status).toBe("diajukan");

    const loans = KoperasiStorage.getLoans();
    expect(loans.some((l) => l.id === created.id)).toBe(true);
  });

  it("should pay installment and mark loan as lunas when paid in full", () => {
    const loans = KoperasiStorage.getLoans();
    const active = loans.find((l) => l.status === "disetujui") || loans[0];

    const updated = KoperasiStorage.payInstallment(active.id, active.nominal);
    expect(updated).not.toBeNull();
    expect(updated?.terbayar).toBe(active.nominal);
    expect(updated?.status).toBe("lunas");
  });
});
