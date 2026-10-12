import { createFileRoute } from "@tanstack/react-router";
import { verifyIdTokenWithCheckRevoked } from "../../server/firebase-admin";

export const Route = createFileRoute("/api/realtime")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
          if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized SSE stream access" }), { status: 401 });
          }
          await verifyIdTokenWithCheckRevoked(token);

          const stream = new ReadableStream({
            start(controller) {
              const welcome = JSON.stringify({
                id: `init-${Date.now()}`,
                type: "heartbeat",
                sender: "DRG Firestore Realtime Node",
                timestamp: new Date().toISOString(),
                data: { mode: "firestore-snapshot-active" },
              });
              controller.enqueue(new TextEncoder().encode(`data: ${welcome}\n\n`));
            },
            cancel() {},
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache, no-transform",
              Connection: "keep-alive",
            },
          });
        } catch {
          return new Response(JSON.stringify({ error: "Unauthorized SSE" }), { status: 401 });
        }
      },
    },
  },
});
