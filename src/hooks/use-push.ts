import { useState, useEffect, useCallback } from "react";
import { getMessagingSafe, auth } from "@/lib/firebase-client";
import { getToken, onMessage } from "firebase/messaging";

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
          console.log("[FCM Foreground Message]", payload);
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
          const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
          if (!vapidKey) {
            console.warn("VITE_FIREBASE_VAPID_KEY tidak diset; pendaftaran push dilewati.");
            setSubscribed(false);
            return;
          }

          const fcmToken = await getToken(messaging, { vapidKey });
          const idToken = await auth.currentUser?.getIdToken();
          if (fcmToken && idToken) {
            // Register via the server so the role check + doc-ID scheme are enforced centrally.
            const res = await fetch("/api/fcm/register", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: fcmToken, deviceType: "web" }),
            });
            if (!res.ok) {
              console.error("Gagal mendaftarkan perangkat push:", await res.text());
              setSubscribed(false);
            }
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
  }, []);

  const unsubscribe = useCallback(async () => {
    setBusy(true);
    try {
      setSubscribed(false);
      const currentUserId = userId || auth.currentUser?.uid;
      if (currentUserId) {
        // cleanup token if needed
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
