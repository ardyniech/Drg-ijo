import { describe, it, expect } from "vitest";
import { AVAILABLE_ROLES, PERMISSIONS_LIST } from "../constants";
import { getMemberRoleRecords, assignMemberRole, getRoleAuditLogs } from "../storage/roles-storage";

describe("Roles Management Module", () => {
  it("should define all primary organizational roles", () => {
    const roleIds = AVAILABLE_ROLES.map((r) => r.id);
    expect(roleIds).toContain("ketua");
    expect(roleIds).toContain("sekretaris");
    expect(roleIds).toContain("bendahara");
    expect(roleIds).toContain("admin");
    expect(roleIds).toContain("korlap");
    expect(roleIds).toContain("satgas");
    expect(roleIds).toContain("dewan_etik");
    expect(roleIds).toContain("anggota");
  });

  it("should have comprehensive permissions configured", () => {
    expect(PERMISSIONS_LIST.length).toBeGreaterThanOrEqual(6);
    const ketua = AVAILABLE_ROLES.find((r) => r.id === "ketua");
    expect(ketua?.permissions).toContain("sign_sk");
    expect(ketua?.permissions).toContain("approve_finance");
  });

  it("should read and assign member roles with audit logging", () => {
    const initialLogsCount = getRoleAuditLogs().length;
    const members = getMemberRoleRecords();
    expect(members.length).toBeGreaterThan(0);

    const updated = assignMemberRole(
      members[0].id,
      "sekretaris",
      { id: "admin-sys", nama: "Super Admin" },
      "SK-TEST/2026",
      "Penetapan Sekretaris Baru",
    );

    expect(updated).toBeDefined();
    const newLogs = getRoleAuditLogs();
    expect(newLogs.length).toBe(initialLogsCount + 1);
    expect(newLogs[0].toRole).toBe("sekretaris");
  });
});
