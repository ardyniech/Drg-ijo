import { describe, it, expect } from "vitest";
import { createQueryBuilder } from "../local-query-builder";
import { createLocalSupabaseAdapter } from "../local-database-adapter";

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

  it("should support chained update().eq() without throwing", async () => {
    const updateRes = await createQueryBuilder("profiles")
      .update({ foto_url: "https://example.com/avatar.jpg" })
      .eq("id", "usr-admin-01");
    expect(updateRes.error).toBeNull();
    expect(updateRes.data).toBeDefined();
  });

  it("should support channel subscription and removal", async () => {
    const adapter = createLocalSupabaseAdapter();
    const ch = adapter
      .channel("test-channel")
      .on("postgres_changes", {}, () => {})
      .subscribe();
    expect(ch).toBeDefined();
    await expect(adapter.removeChannel(ch)).resolves.not.toThrow();
  });
});
