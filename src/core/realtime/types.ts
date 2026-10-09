export type RealtimeEventType =
  | "heartbeat"
  | "sos_broadcast"
  | "incident_update"
  | "kas_mutation"
  | "piket_swap";

export interface RealtimeEventPayload {
  id: string;
  type: RealtimeEventType;
  sender: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface RealtimeChannelState {
  isConnected: boolean;
  isConnecting: boolean;
  lastEventAt: string | null;
  activePeers: number;
  lastError: string | null;
}
