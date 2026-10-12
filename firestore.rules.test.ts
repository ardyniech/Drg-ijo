import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import fs from "fs";

let testEnv: RulesTestEnvironment;

beforeEach(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "drg-app-test",
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
      host: "localhost",
      port: 8080,
    },
  });
});

afterEach(async () => {
  await testEnv.cleanup();
});

describe("Firestore Security Rules", () => {
  it("should allow owner to read their own incident", async () => {
    const context = testEnv.authenticatedContext("user1", { role: "member" });
    const db = context.firestore();
    await testEnv.withSecurityRulesDisabled(async (adminDb) => {
      await adminDb.doc("incidents/inc1").set({
        userId: "user1",
        status: "aktif",
      });
    });
    await expect(db.doc("incidents/inc1").get()).resolves.toBeDefined();
  });

  it("should NOT allow member to read other member's incident", async () => {
    const context = testEnv.authenticatedContext("user2", { role: "member" });
    const db = context.firestore();
    await testEnv.withSecurityRulesDisabled(async (adminDb) => {
      await adminDb.doc("incidents/inc1").set({
        userId: "user1",
        status: "aktif",
      });
    });
    await expect(db.doc("incidents/inc1").get()).rejects.toThrow();
  });

  it("should allow satgas to read any incident", async () => {
    const context = testEnv.authenticatedContext("satgas1", { role: "satgas" });
    const db = context.firestore();
    await testEnv.withSecurityRulesDisabled(async (adminDb) => {
      await adminDb.doc("incidents/inc1").set({
        userId: "user1",
        status: "aktif",
      });
    });
    await expect(db.doc("incidents/inc1").get()).resolves.toBeDefined();
  });

  it("should NOT allow client create incident", async () => {
    const context = testEnv.authenticatedContext("user1", { role: "member" });
    const db = context.firestore();
    await expect(
      db.collection("incidents").add({
        userId: "user1",
        status: "aktif",
      })
    ).rejects.toThrow();
  });

  it("should NOT allow owner to change responders", async () => {
    const context = testEnv.authenticatedContext("user1", { role: "member" });
    const db = context.firestore();
    await testEnv.withSecurityRulesDisabled(async (adminDb) => {
      await adminDb.doc("incidents/inc1").set({
        userId: "user1",
        status: "aktif",
        responders: [],
      });
    });
    await expect(
      db.doc("incidents/inc1").update({
        responders: ["satgas1"],
      })
    ).rejects.toThrow();
  });

  it("should allow owner to cancel their own incident", async () => {
    const context = testEnv.authenticatedContext("user1", { role: "member" });
    const db = context.firestore();
    await testEnv.withSecurityRulesDisabled(async (adminDb) => {
      await adminDb.doc("incidents/inc1").set({
        userId: "user1",
        status: "aktif",
      });
    });
    await expect(
      db.doc("incidents/inc1").update({
        status: "dibatalkan",
      })
    ).resolves.toBeDefined();
  });

  it("should NOT allow delete incident", async () => {
    const context = testEnv.authenticatedContext("satgas1", { role: "satgas" });
    const db = context.firestore();
    await testEnv.withSecurityRulesDisabled(async (adminDb) => {
      await adminDb.doc("incidents/inc1").set({
        userId: "user1",
        status: "aktif",
      });
    });
    await expect(db.doc("incidents/inc1").delete()).rejects.toThrow();
  });

  it("should NOT allow user to change their own role or verified_member", async () => {
    const context = testEnv.authenticatedContext("user1", { role: "member" });
    const db = context.firestore();
    await testEnv.withSecurityRulesDisabled(async (adminDb) => {
      await adminDb.doc("users/user1").set({
        email: "user1@example.com",
        role: "member",
        verified_member: false,
      });
    });
    await expect(
      db.doc("users/user1").update({
        role: "satgas",
        verified_member: true,
      })
    ).rejects.toThrow();
  });
});
