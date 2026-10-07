import { describe, it, expect } from "vitest";
import {
  hashPassword,
  hashPasswordSync,
  verifyPassword,
  isBcryptHash,
} from "../logic/password-hasher";

describe("Password Hasher Utility (bcryptjs)", () => {
  it("generates valid bcrypt hashes asynchronously", async () => {
    const raw = "SuperSecret123";
    const hash = await hashPassword(raw);

    expect(isBcryptHash(hash)).toBe(true);
    expect(hash).not.toBe(raw);
  });

  it("generates valid bcrypt hashes synchronously for seeds", () => {
    const raw = "admin12345";
    const hash = hashPasswordSync(raw);

    expect(isBcryptHash(hash)).toBe(true);
  });

  it("correctly verifies matching password against bcrypt hash", async () => {
    const raw = "PasswordKuat2026!";
    const hash = await hashPassword(raw);

    const { isValid, needsRehash } = await verifyPassword(raw, hash);
    expect(isValid).toBe(true);
    expect(needsRehash).toBe(false);
  });

  it("rejects incorrect password", async () => {
    const raw = "PasswordKuat2026!";
    const hash = await hashPassword(raw);

    const { isValid } = await verifyPassword("SalahPassword", hash);
    expect(isValid).toBe(false);
  });

  it("supports legacy plaintext fallback with auto-rehash flag", async () => {
    const legacyPlain = "oldPlainPassword";
    const { isValid, needsRehash } = await verifyPassword("oldPlainPassword", legacyPlain);

    expect(isValid).toBe(true);
    expect(needsRehash).toBe(true);
  });
});
