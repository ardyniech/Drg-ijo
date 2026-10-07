import { describe, it, expect } from "vitest";
import { NotulenStorage } from "../storage/notulen-storage";

describe("Notulen Storage & Operations", () => {
  it("fetches seed notulen records properly", () => {
    const records = NotulenStorage.getNotulen();
    expect(records.length).toBeGreaterThan(0);
    expect(records[0]).toHaveProperty("judul");
    expect(records[0]).toHaveProperty("poin_keputusan");
  });

  it("saves a new notulen meeting record", () => {
    const records = NotulenStorage.getNotulen();
    const newRecord = {
      id: "not-test",
      judul: "Rapat Pleno Khusus",
      tanggal: "1 September 2026",
      lokasi: "Pangkalan Utama",
      pemimpin_rapat: "Ketua Dewan",
      notulis: "Sekretaris",
      peserta_count: 15,
      agenda: "Penyusunan anggaran triwulan 4",
      poin_keputusan: ["Pengadaan atribut baru"],
      status: "disahkan" as const,
      created_at: new Date().toISOString(),
    };

    NotulenStorage.saveNotulen([newRecord, ...records]);
    const updated = NotulenStorage.getNotulen();
    expect(updated.find((r) => r.id === "not-test")).toBeDefined();
  });
});
