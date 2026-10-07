import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { createQueryBuilder } from "./local-query-builder";
import { handleLocalRpc, createLocalStorageAdapter } from "./local-rpc-storage-handlers";

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
        return {
          data: { session: res.session, user: res.session?.user ?? null },
          error: res.error,
        };
      },
      async signUp({
        email,
        password,
        options,
      }: {
        email: string;
        password: string;
        options?: { data?: Record<string, string> };
      }) {
        const nama = options?.data?.nama || options?.data?.full_name || email.split("@")[0];
        const res = await LocalAuthClient.signUp({ email, password, nama });
        return {
          data: { session: res.session, user: res.session?.user ?? null },
          error: res.error,
        };
      },
      async signOut() {
        await LocalAuthClient.signOut();
        return { error: null };
      },
      async updateUser() {
        return { data: { user: LocalAuthClient.getSession()?.user ?? null }, error: null };
      },
      onAuthStateChange(
        callback: (event: string, session: ReturnType<typeof LocalAuthClient.getSession>) => void,
      ) {
        const unsub = LocalAuthClient.onAuthStateChange((sess) => {
          callback(sess ? "SIGNED_IN" : "SIGNED_OUT", sess);
        });
        return { data: { subscription: { unsubscribe: unsub } } };
      },
    },
    from(table: string) {
      return createQueryBuilder(table);
    },
    channel(name: string) {
      const ch = {
        name,
        on(_event: string, _opts: unknown, _cb?: () => void) {
          return ch;
        },
        subscribe(callback?: (status: string) => void) {
          if (callback) callback("SUBSCRIBED");
          return ch;
        },
        unsubscribe() {
          return Promise.resolve();
        },
      };
      return ch;
    },
    removeChannel(_channel: unknown) {
      return Promise.resolve();
    },
    async rpc(fn: string, args?: Record<string, unknown>) {
      return handleLocalRpc(fn, args);
    },
    storage: createLocalStorageAdapter(),
  };
}
