import { describe, it, expect, beforeEach } from "vitest";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { resolveLocalTableData } from "@/integrations/supabase/local-table-resolvers";

describe("Profile Biodata Persistence & Formatting", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("updates and retrieves comprehensive user profile fields via LocalAuthClient and resolvers", async () => {
    const signupRes = await LocalAuthClient.signUp({
      nama: "Driver Handal",
      email: "driver.handal@example.com",
      password: "password123",
      no_hp: "081234567890",
    });

    expect(signupRes.session).not.toBeNull();
    const userId = signupRes.session!.user.id;

    LocalAuthClient.updateUser(userId, {
      tanggal_lahir: "1992-05-15",
      jenis_kelamin: "L",
      golongan_darah: "O",
      plat_nomor: "N 5432 XYZ",
      jenis_kendaraan: "Sepeda Motor",
      merk_kendaraan: "Yamaha NMAX 155",
      nomor_stnk: "STNK-9988-2023",
      pangkalan: "Pangkalan Stasiun Kota",
      kontak_darurat_nama: "Siti Rahma",
      kontak_darurat_hp: "081987654321",
      kontak_darurat_hubungan: "Istri",
      alamat: "Jl. Ijen No. 45, Malang",
      bio: "Siap melayani dengan senyum.",
    });

    const user = LocalAuthClient.getUsers().find((u) => u.id === userId);
    expect(user).toBeDefined();
    expect(user?.plat_nomor).toBe("N 5432 XYZ");
    expect(user?.kontak_darurat_nama).toBe("Siti Rahma");
    expect(user?.kontak_darurat_hp).toBe("081987654321");
    expect(user?.golongan_darah).toBe("O");
    expect(user?.tanggal_lahir).toBe("1992-05-15");

    const tableData = resolveLocalTableData("profiles", userId);
    expect(tableData.data.length).toBe(1);
    const profile = tableData.data[0] as Record<string, unknown>;
    expect(profile.plat_nomor).toBe("N 5432 XYZ");
    expect(profile.merk_kendaraan).toBe("Yamaha NMAX 155");
    expect(profile.kontak_darurat_nama).toBe("Siti Rahma");
  });
});
