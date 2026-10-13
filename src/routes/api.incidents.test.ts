import { describe, it, expect } from "vitest";
import { evaluateIncidentUpdatePermission } from "@/modules/kejadian/server/incident-rules";

describe("API incidents POST/PATCH authorization", () => {
  it("allows owners to cancel but not resolve", () => {
    expect(
      evaluateIncidentUpdatePermission({
        userId: "u1",
        ownerId: "u1",
        role: "member",
        newStatus: "dibatalkan",
      }).allowed,
    ).toBe(true);
    expect(
      evaluateIncidentUpdatePermission({
        userId: "u1",
        ownerId: "u1",
        role: "member",
        newStatus: "dalam_penanganan",
      }).allowed,
    ).toBe(false);
  });

  it("treats super_admin as an incident manager (regression: previously omitted)", () => {
    expect(
      evaluateIncidentUpdatePermission({
        userId: "u2",
        ownerId: "u1",
        role: "super_admin",
        newStatus: "selesai",
      }).allowed,
    ).toBe(true);
  });

  it("rejects unrelated regular members", () => {
    expect(
      evaluateIncidentUpdatePermission({
        userId: "u2",
        ownerId: "u1",
        role: "member",
        newStatus: "dibatalkan",
      }).allowed,
    ).toBe(false);
  });
});
