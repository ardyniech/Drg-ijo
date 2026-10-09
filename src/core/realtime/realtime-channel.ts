import { RealtimeEventPayload, RealtimeChannelState } from "./types";

type EventListener = (payload: RealtimeEventPayload) => void;

class RealtimeChannelManager {
  private listeners: Set<EventListener> = new Set();
  private eventSource: EventSource | null = null;
  private state: RealtimeChannelState = {
    isConnected: false,
    isConnecting: false,
    lastEventAt: null,
    activePeers: 1,
    lastError: null,
  };
  private reconnectTimer: NodeJS.Timeout | null = null;

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    if (this.listeners.size === 1) {
      this.connect();
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.disconnect();
      }
    };
  }

  public getState(): RealtimeChannelState {
    return { ...this.state };
  }

  public async broadcast(type: RealtimeEventPayload["type"], data: Record<string, unknown>, sender = "Dulur DRG") {
    try {
      await fetch("/api/realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data, sender }),
      });
    } catch (err: unknown) {
      console.warn("[RealtimeChannel] Gagal broadcast event:", err);
    }
  }

  private connect() {
    if (typeof window === "undefined" || this.eventSource) return;

    this.state.isConnecting = true;
    try {
      this.eventSource = new EventSource("/api/realtime");

      this.eventSource.onopen = () => {
        this.state.isConnected = true;
        this.state.isConnecting = false;
        this.state.lastError = null;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as RealtimeEventPayload;
          this.state.lastEventAt = new Date().toLocaleTimeString("id-ID");
          this.listeners.forEach((fn) => fn(payload));
        } catch {
          // ignore malformed packet
        }
      };

      this.eventSource.onerror = () => {
        this.state.isConnected = false;
        this.state.isConnecting = false;
        this.state.lastError = "Koneksi realtime terputus, mencoba kembali...";
        this.disconnect();
        this.scheduleReconnect();
      };
    } catch (err: unknown) {
      this.state.isConnecting = false;
      this.state.lastError = err instanceof Error ? err.message : "Gagal inisialisasi SSE";
    }
  }

  private disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.state.isConnected = false;
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.listeners.size > 0) this.connect();
    }, 4000);
  }
}

export const realtimeChannel = new RealtimeChannelManager();
