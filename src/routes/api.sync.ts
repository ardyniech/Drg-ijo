import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SyncPushBodySchema = z.object({
  operations: z.array(
    z.object({
      id: z.string(),
      idempotencyKey: z.string(),
      action: z.string(),
      module: z.enum(["kas", "kejadian", "piket", "roles", "inventaris", "persetujuan"]),
      payload: z.record(z.unknown()),
      createdAt: z.string(),
    }),
  ),
});

export const Route = createFileRoute("/api/sync")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const since = url.searchParams.get("since") || "0";
        return new Response(
          JSON.stringify({
            status: "ok",
            since,
            serverTimestamp: new Date().toISOString(),
            syncVersion: "v1",
            changes: [],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store, no-cache, must-revalidate",
            },
          },
        );
      },

      POST: async ({ request }) => {
        try {
          const json = await request.json();
          const parsed = SyncPushBodySchema.safeParse(json);

          if (!parsed.success) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Format payload sinkronisasi tidak valid.",
                details: parsed.error.issues,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const { operations } = parsed.data;
          const acknowledgedIds = operations.map((op) => op.id);

          return new Response(
            JSON.stringify({
              success: true,
              acknowledgedIds,
              processedCount: acknowledgedIds.length,
              serverTimestamp: new Date().toISOString(),
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Terjadi kesalahan internal pemrosesan sinkronisasi server.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
