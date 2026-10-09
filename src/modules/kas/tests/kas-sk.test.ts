import { describe, it, expect, beforeEach } from "vitest";
import { KasSkStorage } from "../storage/kas-sk-storage";

describe("Kas SK Gotong Royong Storage & Logic", () => {
  beforeEach(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("drg_kas_sk_records_v1");
    }
  });

  it("should retrieve initial demo SK records", () => {
    const list = KasSkStorage.getAll();
    expect(list.length).toBeGreaterThanOrEqual(2);
    expect(list[0].no_sk).toContain("SK-KAS");
  });

  it("should create a new SK record with valid serial number", () => {
    const created = KasSkStorage.create({
      tanggal: "2026-10-09",
      kategori: "santunan_laka",
      judul: "Santunan Bantuan Rem Rusak Dulur",
      nominal: 750000,
      penerima_nama: "Pak Joko",
      penerima_kta: "DRG-MLG-034",
      penerima_pangkalan: "Posko Sawojajar",
      alasan: "Kerusakan rem mendadak saat bertugas.",
      dasar_keputusan: "Rembug Pangkalan",
      nama_ketua: "H. Hendra Wijaya",
      nama_bendahara: "Hj. Siti Rahmawati",
      status: "disahkan",
    });

    expect(created.id).toBeDefined();
    expect(created.no_sk).toContain("/SK-KAS/DRG-MLG/X/2026");
    expect(created.nominal).toBe(750000);

    const all = KasSkStorage.getAll();
    expect(all.some((r) => r.id === created.id)).toBe(true);
  });

  it("should update SK status to dicairkan", () => {
    const list = KasSkStorage.getAll();
    const target = list[0];
    const updated = KasSkStorage.updateStatus(target.id, "dicairkan");

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("dicairkan");
  });
});
