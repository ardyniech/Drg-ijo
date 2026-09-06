import { describe, it, expect } from "vitest";
import { startOfWeek, addDays, toIso } from "../types";

describe("Piket Date Utilities", () => {
  it("calculates startOfWeek (Monday start)", () => {
    // 2026-09-06 is Sunday
    const sunday = new Date("2026-09-06T12:00:00Z");
    const monday = startOfWeek(sunday);
    // Sunday's preceding Monday should be 2026-08-31
    expect(toIso(monday)).toBe("2026-08-31");
  });

  it("adds days correctly", () => {
    const base = new Date("2026-09-01T12:00:00Z");
    const nextWeek = addDays(base, 7);
    expect(toIso(nextWeek)).toBe("2026-09-08");
  });

  it("formats date to ISO YYYY-MM-DD", () => {
    const d = new Date("2026-10-15T08:30:00Z");
    expect(toIso(d)).toBe("2026-10-15");
  });
});
