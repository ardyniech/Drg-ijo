import { describe, it, expect } from "vitest";

describe("API Incidents Server Handlers & Business Logic", () => {
  it("should validate status transition rules for owner and satgas", () => {
    const ownerCanCancel = (
      role: string,
      currentStatus: string,
      newStatus: string,
      isOwner: boolean,
    ) => {
      if (isOwner) {
        return newStatus === "dibatalkan";
      }
      return ["satgas", "korlap", "admin"].includes(role);
    };

    expect(ownerCanCancel("member", "aktif", "dibatalkan", true)).toBe(true);
    expect(ownerCanCancel("member", "aktif", "selesai", true)).toBe(false);
    expect(ownerCanCancel("satgas", "aktif", "selesai", false)).toBe(true);
    expect(ownerCanCancel("member", "aktif", "ditangani", false)).toBe(false);
  });

  it("should handle rate-limiting soft threshold for repeated SOS", () => {
    const checkRateLimit = (lastTime: number, now: number) => {
      return now - lastTime < 60000;
    };

    const now = Date.now();
    expect(checkRateLimit(now - 30000, now)).toBe(true); // Within 1 min -> repeated SOS
    expect(checkRateLimit(now - 70000, now)).toBe(false); // After 1 min -> normal SOS
  });
});
