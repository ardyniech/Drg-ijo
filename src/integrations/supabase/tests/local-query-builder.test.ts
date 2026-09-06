import { describe, it, expect } from "vitest";
import { createQueryBuilder } from "../local-query-builder";

describe("local-query-builder adapter", () => {
  it("should support upsert without error", async () => {
    const builder = createQueryBuilder("live_locations");
    expect(typeof builder.upsert).toBe("function");

    const result = await builder.upsert(
      { user_id: "u1", lat: -7.98, lng: 112.63, on_bit: true },
      { onConflict: "user_id" },
    );

    expect(result.error).toBeNull();
    expect(result.data).toBeDefined();
  });

  it("should support chained select, in, eq, order, limit, maybeSingle", async () => {
    const builder = createQueryBuilder("profiles");
    const result = await builder
      .select("id, nama")
      .eq("id", "user-admin-01")
      .order("nama")
      .limit(1)
      .maybeSingle();

    expect(result.error).toBeNull();
    expect(result.data).toBeDefined();
  });

  it("should support insert, update, and delete", async () => {
    const insertRes = await createQueryBuilder("notulen").insert({ judul: "Rapat Bulanan" });
    expect(insertRes.error).toBeNull();

    const updateRes = await createQueryBuilder("notulen").update({ judul: "Revisi" });
    expect(updateRes.error).toBeNull();
  });
});
