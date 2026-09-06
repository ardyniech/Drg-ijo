import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { DEFAULT_USERS } from "@/modules/auth/logic/local-auth-store";
import { createQueryBuilder } from "./local-query-builder";

export function createLocalSupabaseAdapter() {
  return {
    auth: {
      async getUser() {
        const session = LocalAuthClient.getSession();
        return { data: { user: session?.user ?? null }, error: null };
      },
      async getSession() {
        const session = LocalAuthClient.getSession();
        return { data: { session }, error: null };
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        const res = await LocalAuthClient.signIn(email, password);
        return { data: { session: res.session, user: res.session?.user ?? null }, error: res.error };
      },
      async signUp({ email, password, options }: any) {
        const nama = options?.data?.nama || options?.data?.full_name || email.split("@")[0];
        const res = await LocalAuthClient.signUp({ email, password, nama });
        return { data: { session: res.session, user: res.session?.user ?? null }, error: res.error };
      },
      async signOut() {
        await LocalAuthClient.signOut();
        return { error: null };
      },
      async updateUser() {
        return { data: { user: LocalAuthClient.getSession()?.user ?? null }, error: null };
      },
      onAuthStateChange(callback: (event: string, session: any) => void) {
        const unsub = LocalAuthClient.onAuthStateChange((sess) => {
          callback(sess ? "SIGNED_IN" : "SIGNED_OUT", sess);
        });
        return { data: { subscription: { unsubscribe: unsub } } };
      },
    },
    from(table: string) {
      return createQueryBuilder(table);
    },
    async rpc(fn: string) {
      if (fn === "member_contacts") {
        return {
          data: DEFAULT_USERS.map((u) => ({
            id: u.id,
            nama: u.nama,
            no_hp: u.no_hp,
            alamat: "Malang, Jawa Timur",
            email: u.email,
          })),
          error: null,
        };
      }
      if (fn === "submit_screening_application") {
        const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        return { data: token, error: null };
      }
      return { data: null, error: null };
    },
    storage: {
      from() {
        return {
          async upload() {
            return { data: { path: "avatar.jpg" }, error: null };
          },
          async createSignedUrl() {
            return { data: { signedUrl: "" }, error: null };
          },
        };
      },
    },
  };
}
