import { createFileRoute } from "@tanstack/react-router";
import { verifyIdTokenWithCheckRevoked } from "../../server/firebase-admin";

export const Route = createFileRoute("/api/sync")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
          if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }
          await verifyIdTokenWithCheckRevoked(token);

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
        } catch {
          return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
      },

      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
          if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }
          await verifyIdTokenWithCheckRevoked(token);

          // Server-side push sync is not enabled yet. We deliberately do NOT
          // acknowledge operations we have not persisted, so the client keeps
          // them in the local outbox instead of dropping them as "synced".
          return new Response(
            JSON.stringify({
              success: false,
              error: "Sinkronisasi server belum diaktifkan (mode penyimpanan lokal).",
            }),
            { status: 501, headers: { "Content-Type": "application/json" } },
          );
        } catch {
          return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
      },
    },
  },
});
