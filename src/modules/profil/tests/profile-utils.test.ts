import { describe, it, expect } from "vitest";
import { getInitials, NOTIF_CONFIGS } from "../types";

describe("getInitials helper", () => {
  it("extracts 2-letter initials from full name", () => {
    expect(getInitials("Budi Santoso")).toBe("BS");
    expect(getInitials("Ardy Syafii")).toBe("AS");
  });

  it("extracts initial from single word name or email", () => {
    expect(getInitials("Ardy")).toBe("A");
    expect(getInitials("admin@drg.id")).toBe("AD");
  });

  it("handles null or undefined safely", () => {
    expect(getInitials(null)).toBe("?");
    expect(getInitials(undefined)).toBe("?");
    expect(getInitials("")).toBe("?");
  });
});

describe("NOTIF_CONFIGS definition", () => {
  it("contains 4 required notification toggle keys", () => {
    expect(NOTIF_CONFIGS.length).toBe(4);
    const keys = NOTIF_CONFIGS.map((c) => c.key);
    expect(keys).toContain("notif_sos");
    expect(keys).toContain("notif_kas");
    expect(keys).toContain("notif_pengumuman");
    expect(keys).toContain("notif_email");
  });
});
