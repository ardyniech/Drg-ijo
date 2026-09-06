import { describe, it, expect } from "vitest";
import { buildScreeningCsv, ScreeningApplication } from "../types";

describe("Screening CSV Export Utility", () => {
  const sampleApps: ScreeningApplication[] = [
    {
      id: "app-1",
      nama: "Budi Santoso",
      no_hp: "08123456789",
      email: "budi@example.com",
      alamat: "Jl. Ijen No. 10",
      kota: "Malang",
      motivasi: "Ingin membantu sesama anggota",
      status: "direkomendasikan",
      skor_total: 85,
      catatan_pic: "Komunikatif dan siap piket",
      created_at: "2026-09-01T10:00:00Z",
      email_verified: true,
    },
    {
      id: "app-2",
      nama: "Joko Widodo",
      no_hp: "08987654321",
      email: null,
      alamat: null,
      kota: "Batu",
      motivasi: null,
      status: "menunggu",
      skor_total: null,
      catatan_pic: null,
      created_at: "2026-09-02T12:00:00Z",
      email_verified: false,
    },
  ];

  it("generates CSV with proper headers and escaping", () => {
    const csv = buildScreeningCsv(sampleApps);
    expect(csv).toContain('"Nama","No HP","Email","Kota","Status","Email Verified","Skor","Tgl Submit","Catatan PIC"');
    expect(csv).toContain('"Budi Santoso","08123456789","budi@example.com","Malang","direkomendasikan","yes","85"');
    expect(csv).toContain('"Joko Widodo","08987654321","","Batu","menunggu","no","0"');
  });

  it("handles empty list without error", () => {
    const csv = buildScreeningCsv([]);
    expect(csv).toBe('"Nama","No HP","Email","Kota","Status","Email Verified","Skor","Tgl Submit","Catatan PIC"');
  });
});
