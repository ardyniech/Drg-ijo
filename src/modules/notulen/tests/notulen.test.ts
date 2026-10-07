import { describe, it, expect, beforeEach } from "vitest";
import { NotulenStorage } from "../storage/notulen-storage";

describe("Notulen Storage & Operations (Production Mode)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("handles empty initial notulen records properly", () => {
    const records = NotulenStorage.getNotulen();
    expect(records).toEqual([]);
  });

  it("saves and retrieves a new notulen meeting record", () => {
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

    NotulenStorage.saveNotulen([newRecord]);
    const updated = NotulenStorage.getNotulen();
    expect(updated).toHaveLength(1);
    expect(updated[0].judul).toBe("Rapat Pleno Khusus");
  });
});
