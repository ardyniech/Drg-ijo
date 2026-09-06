import { createLocalSupabaseAdapter } from "./local-database-adapter";

let _adapter: ReturnType<typeof createLocalSupabaseAdapter> | undefined;

function getLocalClient() {
  if (!_adapter) {
    _adapter = createLocalSupabaseAdapter();
  }
  return _adapter;
}

export const supabase = new Proxy({} as any, {
  get(_, prop, receiver) {
    const client = getLocalClient();
    return Reflect.get(client, prop, receiver);
  },
});
