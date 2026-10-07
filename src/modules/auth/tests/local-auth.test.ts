import { describe, it, expect, beforeEach } from "vitest";
import { LocalAuthClient } from "../logic/local-auth-client";

describe("LocalAuthClient - Clean Dynamic Bootstrap", () => {
  beforeEach(() => {
    localStorage.clear();
    LocalAuthClient.setSession(null);
  });

  it("assigns super_admin role to the first user registered (bootstrap)", async () => {
    expect(LocalAuthClient.getUsers()).toHaveLength(0);

    const firstEmail = `owner_${Date.now()}@drg.id`;
    const { session, error } = await LocalAuthClient.signUp({
      email: firstEmail,
      password: "passwordOwner123",
      nama: "Super Admin Founder",
    });

    expect(error).toBeNull();
    expect(session).not.toBeNull();
    expect(session?.user.user_metadata.role).toBe("super_admin");

    const users = LocalAuthClient.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].role).toBe("super_admin");
    expect(users[0].jenjang).toBe("purna");
    expect(users[0].passwordHash.startsWith("$2")).toBe(true);
  });

  it("assigns anggota role to subsequent users registered", async () => {
    // 1st User (super_admin)
    await LocalAuthClient.signUp({
      email: `founder_${Date.now()}@drg.id`,
      password: "password12345",
      nama: "Founder DRG",
    });

    // 2nd User (regular member)
    const memberEmail = `driver_${Date.now()}@drg.id`;
    const { session, error } = await LocalAuthClient.signUp({
      email: memberEmail,
      password: "driverPassword123",
      nama: "Driver Reguler",
    });

    expect(error).toBeNull();
    expect(session).not.toBeNull();
    expect(session?.user.user_metadata.role).toBe("anggota");

    const users = LocalAuthClient.getUsers();
    expect(users).toHaveLength(2);
    const memberUser = users.find((u) => u.email === memberEmail);
    expect(memberUser?.role).toBe("anggota");
    expect(memberUser?.jenjang).toBe("calon");
  });

  it("successfully signs in registered user with bcrypt verification", async () => {
    const userEmail = `login_${Date.now()}@drg.id`;
    await LocalAuthClient.signUp({
      email: userEmail,
      password: "mySecretPassword",
      nama: "User Login Test",
    });

    const { session, error } = await LocalAuthClient.signIn(userEmail, "mySecretPassword");
    expect(error).toBeNull();
    expect(session).not.toBeNull();
    expect(session?.user.email).toBe(userEmail);
  });

  it("rejects invalid passwords and non-existent users", async () => {
    const userEmail = `auth_test_${Date.now()}@drg.id`;
    await LocalAuthClient.signUp({
      email: userEmail,
      password: "validPassword123",
      nama: "Auth Test",
    });

    const wrongPassRes = await LocalAuthClient.signIn(userEmail, "wrongPass");
    expect(wrongPassRes.session).toBeNull();
    expect(wrongPassRes.error?.message).toContain("Kata sandi salah");

    const nonExistRes = await LocalAuthClient.signIn("unregistered@drg.id", "validPassword123");
    expect(nonExistRes.session).toBeNull();
    expect(nonExistRes.error?.message).toContain("belum terdaftar");
  });
});
