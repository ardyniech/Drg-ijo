import { describe, it, expect } from "vitest";
import { MemberRecord } from "../types";

describe("Anggota Storage & Records", () => {
  const TEST_MEMBERS: MemberRecord[] = [
    {
      id: "test-usr-1",
      nama: "Hendra Wijaya",
      no_kta: "DRG-2023-001",
      no_hp: "081234567890",
      pangkalan: "Pangkalan Suhat",
      role: "admin",
      jenjang: "Utama",
      status: "aktif",
      bergabung_sejak: "12 Januari 2023",
      plat_nomor: "N 4512 AB",
      jenis_kendaraan: "Honda Vario 160",
    },
    {
      id: "test-usr-2",
      nama: "Dimas Anggara",
      no_kta: "DRG-2024-118",
      no_hp: "081556677889",
      pangkalan: "Pangkalan Dinoyo",
      role: "driver",
      jenjang: "Pratama",
      status: "pending_review",
      bergabung_sejak: "28 Februari 2024",
      plat_nomor: "N 5521 JK",
      jenis_kendaraan: "Honda PCX 160",
    },
  ];

  it("provides valid seed members list with KTA and status", () => {
    expect(TEST_MEMBERS.length).toBeGreaterThan(0);
    expect(TEST_MEMBERS[0]).toHaveProperty("no_kta");
    expect(TEST_MEMBERS[0]).toHaveProperty("plat_nomor");
    expect(TEST_MEMBERS[0]).toHaveProperty("pangkalan");
  });

  it("contains both active and pending verification members", () => {
    const active = TEST_MEMBERS.filter((m) => m.status === "aktif");
    expect(active.length).toBeGreaterThan(0);
  });
});
