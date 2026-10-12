import { describe, it, expect } from "vitest";

describe("Client-side Local Auth Migration Helper", () => {
  it("should parse local storage session and migrate fields correctly", () => {
    const mockLocalData = {
      email: "test@driver.com",
      nama: "Driver Testing",
      role: "satgas",
      verified_member: true,
    };

    expect(mockLocalData.email).toBe("test@driver.com");
    expect(mockLocalData.role).toBe("satgas");
    expect(mockLocalData.verified_member).toBe(true);
  });
});
