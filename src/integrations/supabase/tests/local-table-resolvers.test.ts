import { describe, it, expect } from "vitest";
import { resolveLocalTableData, tableResolvers } from "../local-table-resolvers";

describe("Table Resolvers Mapping (resolveLocalTableData)", () => {
  it("resolves profiles table records", () => {
    const res = resolveLocalTableData("profiles");
    expect(res.error).toBeNull();
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
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
    expect(res.data.length).toBeGreaterThan(0);
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
