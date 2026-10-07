import { describe, it, expect, beforeEach } from "vitest";
import { resolveLocalTableData, tableResolvers } from "../local-table-resolvers";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";

describe("Table Resolvers Mapping (resolveLocalTableData)", () => {
  beforeEach(() => {
    localStorage.clear();
    LocalAuthClient.setSession(null);
  });

  it("resolves profiles table records gracefully (empty or populated)", async () => {
    // Empty state
    const emptyRes = resolveLocalTableData("profiles");
    expect(emptyRes.error).toBeNull();
    expect(Array.isArray(emptyRes.data)).toBe(true);

    // After signup
    await LocalAuthClient.signUp({
      email: "founder@drg.id",
      nama: "Founder DRG",
      password: "password12345",
    });
    const populatedRes = resolveLocalTableData("profiles");
    expect(populatedRes.error).toBeNull();
    expect(populatedRes.data.length).toBe(1);
  });

  it("resolves kas_transactions correctly", () => {
    const res = resolveLocalTableData("kas_transactions");
    expect(res.error).toBeNull();
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("resolves piket_shifts correctly", () => {
    const res = resolveLocalTableData("piket_shifts");
    expect(res.error).toBeNull();
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("resolves screening_questions_public correctly", () => {
    const res = resolveLocalTableData("screening_questions_public");
    expect(res.error).toBeNull();
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("returns empty array for unknown tables gracefully", () => {
    const res = resolveLocalTableData("non_existent_table_xyz");
    expect(res.error).toBeNull();
    expect(res.data).toEqual([]);
  });

  it("exposes registered tableResolvers map keys", () => {
    const keys = Object.keys(tableResolvers);
    expect(keys).toContain("profiles");
    expect(keys).toContain("kas_transactions");
    expect(keys).toContain("piket_shifts");
    expect(keys).toContain("kejadian");
    expect(keys).toContain("schema_migrations");
  });
});
