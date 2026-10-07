import { describe, it, expect, beforeEach } from "vitest";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { MemberRecord } from "../types";

describe("Anggota Storage & Directory Logic (Dynamic Production Mode)", () => {
  beforeEach(() => {
    localStorage.clear();
    LocalAuthClient.setSession(null);
  });

  it("handles empty initial members directory gracefully", () => {
    const users = LocalAuthClient.getUsers();
    expect(users).toHaveLength(0);
  });

  it("maps registered users into verified drivers with valid KTA numbers", async () => {
    // Register first user (Super Admin)
    await LocalAuthClient.signUp({
      email: "founder@drg.id",
      nama: "Founder Super Admin",
      password: "password12345",
    });

    // Register second user (Member)
    await LocalAuthClient.signUp({
      email: "driver1@drg.id",
      nama: "Driver Satu",
      password: "password12345",
    });

    const users = LocalAuthClient.getUsers();
    expect(users).toHaveLength(2);

    const members: MemberRecord[] = users.map((u, idx) => ({
      id: u.id,
      nama: u.nama,
      no_kta: `DRG-2026-${String(idx + 1).padStart(3, "0")}`,
      no_hp: u.no_hp || "-",
      pangkalan: "Pangkalan Utama",
      role: (u.role || "driver") as MemberRecord["role"],
      jenjang: u.jenjang || "Calon",
      status: (u.status === "aktif" ? "aktif" : "pending_review") as MemberRecord["status"],
      bergabung_sejak: new Date(u.created_at).toLocaleDateString("id-ID"),
      plat_nomor: "N 2026 DRG",
      jenis_kendaraan: "Sepeda Motor",
      email: u.email,
    }));

    expect(members[0].role).toBe("super_admin");
    expect(members[0].no_kta).toBe("DRG-2026-001");
    expect(members[1].role).toBe("anggota");
    expect(members[1].no_kta).toBe("DRG-2026-002");
  });

  it("correctly filters and sorts dynamic driver list", () => {
    const mockList: MemberRecord[] = [
      {
        id: "usr-1",
        nama: "Budi Santoso",
        no_kta: "DRG-2026-001",
        no_hp: "0812345",
        pangkalan: "Pangkalan Suhat",
        role: "super_admin",
        jenjang: "Utama",
        status: "aktif",
        bergabung_sejak: "01 Jan 2026",
        plat_nomor: "N 1234 AB",
        jenis_kendaraan: "Honda Vario",
      },
      {
        id: "usr-2",
        nama: "Agus Pratama",
        no_kta: "DRG-2026-002",
        no_hp: "0812346",
        pangkalan: "Pangkalan Dinoyo",
        role: "anggota",
        jenjang: "Calon",
        status: "pending_review",
        bergabung_sejak: "02 Jan 2026",
        plat_nomor: "N 2345 BC",
        jenis_kendaraan: "Yamaha NMAX",
      },
    ];

    const verified = mockList.filter((m) => m.status === "aktif");
    const pending = mockList.filter((m) => m.status === "pending_review");
    expect(verified).toHaveLength(1);
    expect(pending).toHaveLength(1);

    const sortedAlpha = [...mockList].sort((a, b) => a.nama.localeCompare(b.nama));
    expect(sortedAlpha[0].nama).toBe("Agus Pratama");
  });
});
