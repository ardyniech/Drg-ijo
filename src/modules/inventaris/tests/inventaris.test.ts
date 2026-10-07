import { describe, it, expect } from "vitest";
import { InventarisStorage } from "../storage/inventaris-storage";

describe("InventarisStorage", () => {
  it("should return seed items correctly", () => {
    const items = InventarisStorage.getItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty("kode_alat");
    expect(items[0]).toHaveProperty("status");
  });

  it("should persist item modifications", () => {
    const items = InventarisStorage.getItems();
    const updated = items.map((item, idx) =>
      idx === 0 ? { ...item, status: "dipinjam" as const } : item,
    );
    InventarisStorage.saveItems(updated);
    const result = InventarisStorage.getItems();
    expect(result[0].status).toBe("dipinjam");
  });
});
