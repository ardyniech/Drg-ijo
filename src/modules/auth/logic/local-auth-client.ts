import { DEFAULT_USERS, LocalSession, LocalUser, createLocalSession } from "./local-auth-store";

const USERS_KEY = "drg_local_users_v1";
const SESSION_KEY = "drg_local_session_v1";
type AuthListener = (session: LocalSession | null) => void;
const listeners = new Set<AuthListener>();

let inMemoryUsers: LocalUser[] = [...DEFAULT_USERS];
let inMemorySession: LocalSession | null = null;

export class LocalAuthClient {
  static getUsers(): LocalUser[] {
    if (typeof window === "undefined") return inMemoryUsers;
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (!raw) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(raw);
    } catch {
      return inMemoryUsers;
    }
  }

  static updateUser(userId: string, patch: Partial<LocalUser>) {
    const users = this.getUsers().map((u) => (u.id === userId ? { ...u, ...patch } : u));
    inMemoryUsers = users;
    if (typeof window !== "undefined") localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const cur = this.getSession();
    if (cur?.user.id === userId) {
      if (patch.nama) cur.user.user_metadata.nama = patch.nama;
      if (patch.role) cur.user.user_metadata.role = patch.role;
      this.setSession(cur);
    }
  }

  static getSession(): LocalSession | null {
    if (typeof window === "undefined") return inMemorySession;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return inMemorySession;
      const parsed: LocalSession = JSON.parse(raw);
      if (parsed.expires_at && parsed.expires_at < Math.floor(Date.now() / 1000)) {
        this.setSession(null);
        return null;
      }
      return parsed;
    } catch {
      return inMemorySession;
    }
  }

  static setSession(session: LocalSession | null) {
    inMemorySession = session;
    if (typeof window !== "undefined") {
      if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    listeners.forEach((fn) => fn(session));
  }

  static onAuthStateChange(callback: AuthListener) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  static async signIn(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.getUsers().find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) return { session: null, error: new Error("Akun email ini belum terdaftar.") };
    if (user.passwordHash !== password)
      return { session: null, error: new Error("Kata sandi salah.") };
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

    const newUser: LocalUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      nama: cleanName,
      no_hp: payload.no_hp || "",
      role: "anggota",
      jenjang: "calon",
      status: "aktif",
      passwordHash: payload.password,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    inMemoryUsers = users;
    if (typeof window !== "undefined") localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const session = createLocalSession(newUser);
    this.setSession(session);
    return { session, error: null };
  }

  static async signOut() {
    this.setSession(null);
  }
}
