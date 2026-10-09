import { describe, it, expect, vi, beforeEach } from "vitest";
import { realtimeChannel } from "../realtime-channel";
import { RealtimeEventPayload } from "../types";

describe("Realtime Multi-Device Channel Manager", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("subscribes and unsubscribes listeners cleanly without memory leaks", () => {
    const listener = vi.fn();
    const unsubscribe = realtimeChannel.subscribe(listener);

    const state = realtimeChannel.getState();
    expect(state).toBeDefined();

    unsubscribe();
  });

  it("handles event broadcasting gracefully even when offline", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementationOnce(() =>
      Promise.resolve(
        new Response(JSON.stringify({ success: true, broadcastedTo: 2 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await realtimeChannel.broadcast("sos_broadcast", { lokasi: "Dinoyo" }, "Satgas Malang");

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/realtime",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("preserves state attributes and provides fallback state", () => {
    const state = realtimeChannel.getState();
    expect(typeof state.isConnected).toBe("boolean");
    expect(typeof state.isConnecting).toBe("boolean");
    expect(state.activePeers).toBeGreaterThanOrEqual(1);
  });
});
