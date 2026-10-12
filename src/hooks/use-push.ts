import { useState, useEffect, useCallback } from "react";
import { getMessagingSafe, db, auth } from "@/lib/firebase-client";
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

export function usePush(userId?: string) {
  const [state, setState] = useState<"default" | "granted" | "denied" | "unsupported">("default");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
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

    getMessagingSafe().then((messaging) => {
      if (messaging) {
        onMessage(messaging, (payload) => {
          if (payload.notification?.title) {
            new Notification(payload.notification.title, {
              body: payload.notification.body,
              icon: "/DRG_logo.jpg",
            });
          }
        });
      }
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setState("granted");
        setSubscribed(true);
        const messaging = await getMessagingSafe();
        if (messaging) {
          const currentUserId = userId || auth.currentUser?.uid;
          const vapidKey =
            (typeof process !== "undefined" ? process.env?.VITE_FIREBASE_VAPID_KEY : undefined) ||
            import.meta.env.VITE_FIREBASE_VAPID_KEY;
          if (!vapidKey) {
            return;
          }
          const fcmToken = await getToken(messaging, { vapidKey });
          if (currentUserId && fcmToken) {
            const deviceId = fcmToken.substring(0, 32);
            await setDoc(doc(db, "satgas_devices", deviceId), {
              userId: currentUserId,
              token: fcmToken,
              updatedAt: new Date().toISOString(),
            });
          }
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
    } finally {
      setBusy(false);
    }
  }, []);

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
