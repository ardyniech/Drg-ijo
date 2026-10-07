import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { saveKasTransaction, updateKasTransaction, savePiketShift } from "./local-tx-store";
import { resolveLocalTableData } from "./local-table-resolvers";
import { updateScreeningApplication } from "./local-screening-store";

export function createQueryBuilder(table: string) {
  let filterId: string | null = null;
  let inIds: string[] | null = null;
  let pendingUpdate: Record<string, unknown> | null = null;
  let pendingInsert: Record<string, unknown> | null = null;
  let pendingUpsert: Record<string, unknown> | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const builder: any = {
    select: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    eq: (col: string, val: unknown) => {
      if (col === "id" || col === "user_id" || col === "application_id") filterId = String(val);
      return builder;
    },
    in: (col: string, vals: unknown[]) => {
      if (col === "id" || col === "user_id") inIds = vals.map(String);
      return builder;
    },
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    or: () => builder,
    not: () => builder,
    match: () => builder,
    filter: () => builder,
    contains: () => builder,
    containedBy: () => builder,
    update: (patch: Record<string, unknown>) => {
      pendingUpdate = patch;
      return builder;
    },
    insert: (row: Record<string, unknown>) => {
      pendingInsert = row;
      return builder;
    },
    upsert: (row: Record<string, unknown>) => {
      pendingUpsert = row;
      return builder;
    },
    delete: () => builder,
    maybeSingle: async () => {
      const { data } = await builder.execute();
      return { data: Array.isArray(data) ? (data[0] ?? null) : data, error: null };
    },
    single: async () => {
      const { data } = await builder.execute();
      return { data: Array.isArray(data) ? (data[0] ?? null) : data, error: null };
    },
    then: (resolve: (val: unknown) => void) => builder.execute().then(resolve),
    execute: async () => {
      const session = LocalAuthClient.getSession();
      const currentUserId = filterId || session?.user?.id;

      if (pendingUpdate) {
        if (table === "profiles" && currentUserId) {
          LocalAuthClient.updateUser(currentUserId, pendingUpdate);
        } else if (table === "kas_transactions" && currentUserId) {
          updateKasTransaction(currentUserId, pendingUpdate);
        } else if (table === "screening_applications" && currentUserId) {
          updateScreeningApplication(currentUserId, pendingUpdate);
        }
        return { data: pendingUpdate, error: null };
      }

      if (pendingInsert) {
        if (table === "kas_transactions") saveKasTransaction(pendingInsert);
        else if (table === "piket_shifts") savePiketShift(pendingInsert);
        return { data: pendingInsert, error: null };
      }

      if (pendingUpsert) {
        const targetId = String(pendingUpsert.id || currentUserId);
        if (table === "profiles" && targetId) LocalAuthClient.updateUser(targetId, pendingUpsert);
        return { data: pendingUpsert, error: null };
      }

      return resolveLocalTableData(table, filterId, inIds);
    },
  };

  return builder;
}
