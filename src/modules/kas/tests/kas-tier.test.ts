import { describe, it, expect } from "vitest";
import { tierOf, rupiah } from "../types";

describe("tierOf logic", () => {
  it("returns null for amounts under 500,000 (auto-approved)", () => {
    expect(tierOf(499999)).toBeNull();
    expect(tierOf(0)).toBeNull();
  });

  it("returns bendahara tier for amounts between 500,000 and 1,999,999", () => {
    const tier = tierOf(500000);
    expect(tier).not.toBeNull();
    expect(tier?.role).toBe("bendahara");
  });

  it("returns admin tier for amounts between 2,000,000 and 4,999,999", () => {
    const tier = tierOf(2000000);
    expect(tier?.role).toBe("admin");
  });

  it("returns super_admin tier for amounts >= 5,000,000", () => {
    const tier = tierOf(5000000);
    expect(tier?.role).toBe("super_admin");
  });
});

describe("rupiah formatting", () => {
  it("formats numbers to IDR correctly", () => {
    const formatted = rupiah(500000);
    expect(formatted).toContain("500.000");
  });
});
