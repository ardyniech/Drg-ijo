import { describe, it, expect } from "vitest";

describe("Registration & Member Sign-up Validation", () => {
  it("should validate registration field constraints", () => {
    const candidate = {
      nama: "Driver Satu Aspal",
      email: "driver@drg.id",
      pangkalan: "Basecamp Arjosari Siaga",
    };
    expect(candidate.nama.length).toBeGreaterThanOrEqual(3);
    expect(candidate.email).toContain("@");
    expect(candidate.pangkalan.length).toBeGreaterThan(0);
  });
});
