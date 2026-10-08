import { describe, it, expect, beforeEach } from "vitest";
import { MemberManagementService } from "../storage/member-management-service";
import { canManageAnggota, canVerifyAnggota, canDeleteAnggota } from "../logic/member-permissions";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";

describe("Member Permissions RBAC", () => {
  it("allows admin, super_admin, ketua, sekretaris, and dewan_etik to manage and verify members", () => {
    expect(canManageAnggota("super_admin")).toBe(true);
    expect(canManageAnggota("admin")).toBe(true);
    expect(canManageAnggota("ketua")).toBe(true);
    expect(canManageAnggota("sekretaris")).toBe(true);
    expect(canManageAnggota("dewan_etik")).toBe(true);

    expect(canVerifyAnggota("sekretaris")).toBe(true);
    expect(canVerifyAnggota("ketua")).toBe(true);

    expect(canManageAnggota("anggota")).toBe(false);
    expect(canManageAnggota("driver")).toBe(false);
    expect(canManageAnggota("satgas")).toBe(false);
    expect(canManageAnggota("bendahara")).toBe(false);
    expect(canManageAnggota(null)).toBe(false);
    expect(canManageAnggota(undefined)).toBe(false);
  });

  it("prevents self-deletion even for admin", () => {
    expect(canDeleteAnggota("usr_123", "usr_123", "admin")).toBe(false);
    expect(canDeleteAnggota("usr_123", "usr_456", "admin")).toBe(true);
  });
});

describe("MemberManagementService Storage Operations", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds, updates, verifies, and deletes member entries with role authorization", () => {
    // 1. Tambah anggota oleh admin
    const newMember = MemberManagementService.addMember(
      {
        nama: "Driver Satu",
        email: "driver1@drg.id",
        no_hp: "0811111111",
        role: "anggota",
        jenjang: "calon",
        status: "pending_review",
        pangkalan: "Pangkalan Arjosari",
        plat_nomor: "N 1111 AA",
      },
      "admin",
    );

    expect(newMember.id).toBeDefined();
    expect(newMember.nama).toBe("Driver Satu");
    expect(newMember.nomor_anggota).toContain("DRG-2026-");
    expect(newMember.status).toBe("pending_review");

    // 2. Verifikasi status driver oleh sekretaris
    MemberManagementService.verifyMember(newMember.id, "sekretaris");
    const verifiedUser = LocalAuthClient.getUsers().find((u) => u.id === newMember.id);
    expect(verifiedUser?.status).toBe("aktif");

    // 3. Reject non-authorized role
    expect(() =>
      MemberManagementService.addMember(
        {
          nama: "Driver Dua",
          email: "driver2@drg.id",
          no_hp: "0822222222",
          role: "anggota",
          jenjang: "calon",
          status: "aktif",
        },
        "satgas",
      ),
    ).toThrowError(/Akses ditolak/);

    // 4. Update entri anggota oleh dewan_etik
    MemberManagementService.updateMember(
      newMember.id,
      {
        jenjang: "muda",
        pangkalan: "Pangkalan Gadang",
      },
      "dewan_etik",
    );

    const updated = LocalAuthClient.getUsers().find((u) => u.id === newMember.id);
    expect(updated?.jenjang).toBe("muda");
    expect(updated?.pangkalan).toBe("Pangkalan Gadang");

    // 5. Hapus entri anggota oleh ketua
    MemberManagementService.deleteMember(newMember.id, "current_admin_id", "ketua");
    const afterDelete = LocalAuthClient.getUsers().find((u) => u.id === newMember.id);
    expect(afterDelete).toBeUndefined();
  });
});
