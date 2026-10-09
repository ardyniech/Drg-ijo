import { describe, it, expect, beforeEach } from "vitest";
import { InventarisStorage } from "../storage/inventaris-storage";

describe("InventarisStorage (Production Mode)", () => {
  beforeEach(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.clear();
    }
    InventarisStorage.saveItems([]);
  });

  it("should return empty array when no items exist", () => {
    const items = InventarisStorage.getItems();
    expect(items).toEqual([]);
  });

  it("should persist item creations and modifications", () => {
    const newItem = {
      id: "inv-1",
      kode_alat: "HT-01",
      nama_barang: "Handie Talkie",
      kategori: "Komunikasi" as const,
      kondisi: "Baik" as const,
      status: "tersedia" as const,
      lokasi_pos: "Basecamp Suhat",
    };

    InventarisStorage.saveItems([newItem]);
    const result = InventarisStorage.getItems();
    expect(result).toHaveLength(1);
    expect(result[0].nama_barang).toBe("Handie Talkie");
  });
});
