import { z } from "zod";
import {
  LocalSession,
  LocalUser,
  LocalUserSchema,
  LocalSessionSchema,
  createLocalSession,
} from "./local-auth-store";
import { hashPassword, verifyPassword } from "./password-hasher";
import { safeReadStorage, safeWriteStorage } from "@/shared/utils/safe-storage";
import { generatePrefixedId } from "@/shared/utils/id-generator";

const USERS_KEY = "drg_local_users_v1";
const SESSION_KEY = "drg_local_session_v1";
type AuthListener = (session: LocalSession | null) => void;
const listeners = new Set<AuthListener>();

let inMemoryUsers: LocalUser[] = [];
let inMemorySession: LocalSession | null = null;

export class LocalAuthClient {
  static getUsers(): LocalUser[] {
    inMemoryUsers = safeReadStorage(USERS_KEY, z.array(LocalUserSchema), []);
    return inMemoryUsers;
  }

  static updateUser(userId: string, patch: Partial<LocalUser>) {
    inMemoryUsers = this.getUsers().map((u) => (u.id === userId ? { ...u, ...patch } : u));
    safeWriteStorage(USERS_KEY, inMemoryUsers);
    const cur = this.getSession();
    if (cur?.user.id === userId) {
      if (patch.nama) cur.user.user_metadata.nama = patch.nama;
      if (patch.role) cur.user.user_metadata.role = patch.role;
      this.setSession(cur);
    }
  }

  static getSession(): LocalSession | null {
    const parsed = safeReadStorage<LocalSession | null>(
      SESSION_KEY,
      LocalSessionSchema.nullable(),
      inMemorySession,
    );
    if (parsed?.expires_at && parsed.expires_at < Math.floor(Date.now() / 1000)) {
      this.setSession(null);
      return null;
    }
    inMemorySession = parsed;
    return parsed;
  }

  static setSession(session: LocalSession | null) {
    inMemorySession = session;
    if (session) safeWriteStorage(SESSION_KEY, session);
    else if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
    listeners.forEach((fn) => fn(session));
  }

  static onAuthStateChange(callback: AuthListener) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  static async signIn(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) return { session: null, error: new Error("Akun email ini belum terdaftar.") };

    const { isValid, needsRehash } = await verifyPassword(password, user.passwordHash);
    if (!isValid) return { session: null, error: new Error("Kata sandi salah.") };

    if (needsRehash) {
      user.passwordHash = await hashPassword(password);
      this.updateUser(user.id, { passwordHash: user.passwordHash });
    }

    const session = createLocalSession(user);
    this.setSession(session);
    return { session, error: null };
  }

  static async signUp(payload: { email: string; password: string; nama: string; no_hp?: string }) {
    const cleanEmail = payload.email.trim().toLowerCase();
    const cleanName = payload.nama.trim();
    if (!cleanName) return { session: null, error: new Error("Nama lengkap wajib diisi.") };
    if (payload.password.length < 6)
      return { session: null, error: new Error("Kata sandi minimal 6 karakter.") };

    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        session: null,
        error: new Error("Email ini sudah terdaftar. Silakan langsung masuk."),
      };
    }

    const isFirstUser = users.length === 0;
    const passwordHash = await hashPassword(payload.password);
    const newUser: LocalUser = {
      id: generatePrefixedId("usr"),
      email: cleanEmail,
      nama: cleanName,
      no_hp: payload.no_hp || "",
      role: isFirstUser ? "super_admin" : "anggota",
      jenjang: isFirstUser ? "purna" : "calon",
      status: "aktif",
      passwordHash,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    inMemoryUsers = users;
    safeWriteStorage(USERS_KEY, users);

    const session = createLocalSession(newUser);
    this.setSession(session);
    return { session, error: null };
  }

  static async signOut() {
    this.setSession(null);
  }
}
