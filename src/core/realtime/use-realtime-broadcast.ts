import { useEffect, useState, useCallback } from "react";
import { realtimeChannel } from "./realtime-channel";
import { RealtimeChannelState, RealtimeEventPayload } from "./types";

export function useRealtimeBroadcast(onEvent?: (payload: RealtimeEventPayload) => void) {
  const [channelState, setChannelState] = useState<RealtimeChannelState>(() =>
    realtimeChannel.getState(),
  );
  const [latestEvent, setLatestEvent] = useState<RealtimeEventPayload | null>(null);

  useEffect(() => {
    const unsubscribe = realtimeChannel.subscribe((payload) => {
      setLatestEvent(payload);
      setChannelState(realtimeChannel.getState());
      if (onEvent) onEvent(payload);
    });

    const interval = setInterval(() => {
      setChannelState(realtimeChannel.getState());
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [onEvent]);

  const broadcastEvent = useCallback(
    (type: RealtimeEventPayload["type"], data: Record<string, unknown>, sender?: string) => {
      return realtimeChannel.broadcast(type, data, sender);
    },
    [],
  );

  return {
    channelState,
    latestEvent,
    broadcastEvent,
  };
}
