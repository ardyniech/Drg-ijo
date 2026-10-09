import { describe, it, expect, beforeEach } from "vitest";
import { KasSkStorage } from "@/modules/kas/storage/kas-sk-storage";
import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { getMemberRoleRecords } from "@/modules/roles/storage/roles-storage";
import { getActivityLogs } from "@/modules/activity-log";
import { MemberManagementService } from "@/modules/anggota/storage/member-management-service";

describe("Organization Module Storage & Data Flow", () => {
  beforeEach(async () => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("drg_kas_sk_records_v1");
      window.localStorage.clear();
    }
    await LocalAuthClient.signUp({
      email: "org_member@drg.id",
      nama: "Dulur Organisasi",
      password: "password12345",
    });
  });

  it("should retrieve organization members and roles", () => {
    const users = LocalAuthClient.getUsers();
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThanOrEqual(1);

    const roleRecords = getMemberRoleRecords();
    expect(roleRecords).toBeDefined();
    expect(roleRecords.length).toBeGreaterThanOrEqual(1);
    expect(roleRecords[0].nama).toBe("Dulur Organisasi");
  });

  it("should retrieve active SK Kas Gotong Royong records", () => {
    const records = KasSkStorage.getAll();
    expect(records.length).toBeGreaterThanOrEqual(2);
    expect(records[0].no_sk).toContain("SK-KAS");
  });

  it("should disburse SK Kas and record transparent audit log", () => {
    const records = KasSkStorage.getAll();
    const target = records[0];

    const updated = KasSkStorage.updateStatus(target.id, "dicairkan");
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("dicairkan");

    const logs = getActivityLogs();
    const auditMatch = logs.find((l) => l.action.includes("SK Kas") && l.module === "kas");
    expect(auditMatch).toBeDefined();
    expect(auditMatch?.description).toContain(target.no_sk);
  });

  it("should log activity when member status is modified or verified", () => {
    const users = LocalAuthClient.getUsers();
    const targetUser = users[0];

    MemberManagementService.verifyMember(targetUser.id, "admin");

    const logs = getActivityLogs();
    const verifyLog = logs.find((l) => l.action.includes("Verifikasi") && l.module === "anggota");
    expect(verifyLog).toBeDefined();
    expect(verifyLog?.targetId).toBe(targetUser.id);
  });
});
