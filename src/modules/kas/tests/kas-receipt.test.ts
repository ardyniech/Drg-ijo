import { describe, it, expect } from "vitest";
import { rupiah } from "../types";

describe("Kas Receipt Generator", () => {
  it("formats Indonesian Rupiah correctly for receipts", () => {
    expect(rupiah(50000)).toContain("50.000");
    expect(rupiah(50000)).toContain("Rp");
    expect(rupiah(1500000)).toContain("1.500.000");
  });

  it("generates deterministic receipt registration numbers", () => {
    const txId = "tx-kas-2026-99";
    const noKwitansi = `KW-DRG-${txId
      .replace(/[^0-9a-zA-Z]/g, "")
      .slice(0, 8)
      .toUpperCase()}`;
    expect(noKwitansi).toBe("KW-DRG-TXKAS202");
  });
});
