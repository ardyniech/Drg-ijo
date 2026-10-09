import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const BroadcastSchema = z.object({
  type: z.enum(["heartbeat", "sos_broadcast", "incident_update", "kas_mutation", "piket_swap"]),
  data: z.record(z.unknown()),
  sender: z.string().optional(),
});

type SSEClient = (data: string) => void;
const sseClients = new Set<SSEClient>();

export function broadcastToClients(event: { type: string; data: Record<string, unknown>; sender?: string }) {
  const payload = JSON.stringify({
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: event.type,
    sender: event.sender || "Satgas DRG",
    timestamp: new Date().toISOString(),
    data: event.data,
  });
  sseClients.forEach((send) => send(payload));
}

export const Route = createFileRoute("/api/realtime")({
  server: {
    handlers: {
      GET: async () => {
        let clientSend: SSEClient | null = null;

        const stream = new ReadableStream({
          start(controller) {
            clientSend = (payload: string) => {
              try {
                controller.enqueue(new TextEncoder().encode(`data: ${payload}\n\n`));
              } catch {
                if (clientSend) sseClients.delete(clientSend);
              }
            };
            sseClients.add(clientSend);

            // Kirim handshake heartbeat awal
            const welcome = JSON.stringify({
              id: `init-${Date.now()}`,
              type: "heartbeat",
              sender: "DRG Live Node",
              timestamp: new Date().toISOString(),
              data: { activePeers: sseClients.size, mode: "broadcast" },
            });
            controller.enqueue(new TextEncoder().encode(`data: ${welcome}\n\n`));
          },
          cancel() {
            if (clientSend) sseClients.delete(clientSend);
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      },

      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = BroadcastSchema.safeParse(body);
          if (!parsed.success) {
            return new Response(JSON.stringify({ success: false, error: "Event payload tidak valid" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          broadcastToClients(parsed.data);

          return new Response(
            JSON.stringify({ success: true, broadcastedTo: sseClients.size }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch {
          return new Response(JSON.stringify({ success: false, error: "Gagal memproses event" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
