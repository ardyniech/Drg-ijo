import { describe, it, expect, beforeEach } from "vitest";
import { LocalAuthClient } from "../logic/local-auth-client";
import { DEFAULT_USERS } from "../logic/local-auth-store";

describe("LocalAuthClient", () => {
  beforeEach(() => {
    LocalAuthClient.setSession(null);
  });

  it("should successfully sign in with seeded default users using plain password against bcrypt hash", async () => {
    const admin = DEFAULT_USERS[0];
    const { session, error } = await LocalAuthClient.signIn(admin.email, "admin12345");

    expect(error).toBeNull();
    expect(session).not.toBeNull();
    expect(session?.user.email).toBe(admin.email);
    expect(session?.user.user_metadata.nama).toBe(admin.nama);
  });

  it("should reject invalid passwords", async () => {
    const admin = DEFAULT_USERS[0];
    const { session, error } = await LocalAuthClient.signIn(admin.email, "wrongpassword");

    expect(session).toBeNull();
    expect(error?.message).toContain("Kata sandi salah");
  });

  it("should reject non-existent users", async () => {
    const { session, error } = await LocalAuthClient.signIn("ghost@drg.id", "admin12345");

    expect(session).toBeNull();
    expect(error?.message).toContain("belum terdaftar");
  });

  it("should successfully register a new local user with bcrypt hashed password and create session", async () => {
    const uniqueEmail = `test_${Date.now()}@drg.id`;
    const { session, error } = await LocalAuthClient.signUp({
      email: uniqueEmail,
      password: "securepassword123",
      nama: "Driver Testing Baru",
    });

    expect(error).toBeNull();
    expect(session).not.toBeNull();
    expect(session?.user.email).toBe(uniqueEmail);
    expect(session?.user.user_metadata.nama).toBe("Driver Testing Baru");

    const currentSession = LocalAuthClient.getSession();
    expect(currentSession?.user.email).toBe(uniqueEmail);

    // Verify user password in storage is bcrypt hashed, not plaintext
    const createdUser = LocalAuthClient.getUsers().find((u) => u.email === uniqueEmail);
    expect(createdUser).toBeDefined();
    expect(createdUser?.passwordHash).not.toBe("securepassword123");
    expect(createdUser?.passwordHash.startsWith("$2")).toBe(true);
  });
});
