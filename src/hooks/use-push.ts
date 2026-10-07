import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePush(userId?: string) {
  const [state, setState] = useState<"default" | "granted" | "denied" | "unsupported">("default");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("PushManager" in window)
    ) {
      setState("unsupported");
      return;
    }
    const current = Notification.permission;
    if (current === "granted") {
      setState("granted");
      setSubscribed(true);
    } else if (current === "denied") {
      setState("denied");
    } else {
      setState("default");
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setState("granted");
        setSubscribed(true);
        if (userId) {
          await supabase.from("push_subscriptions").upsert({
            user_id: userId,
            endpoint: "browser-push-endpoint",
            enabled: true,
            created_at: new Date().toISOString(),
          });
        }
      } else {
        setState("denied");
      }
    } catch (e) {
      console.error("Push subscribe error", e);
    } finally {
      setBusy(false);
    }
  }, [userId]);

  const unsubscribe = useCallback(async () => {
    setBusy(true);
    try {
      setSubscribed(false);
      if (userId) {
        await supabase.from("push_subscriptions").delete().eq("user_id", userId);
      }
    } finally {
      setBusy(false);
    }
  }, [userId]);

  return {
    state,
    subscribed,
    busy,
    loading: busy,
    supported: state !== "unsupported",
    subscribe,
    unsubscribe,
    toggleSubscription: subscribed ? unsubscribe : subscribe,
  };
}
