import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { firebaseConfig } from "./firebase";

function getClientApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  const config =
    firebaseConfig.apiKey && firebaseConfig.projectId
      ? firebaseConfig
      : {
          apiKey: "local-unconfigured-api-key",
          projectId: "local-unconfigured-project",
        };
  return initializeApp(config);
}

export const app = getClientApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function getMessagingSafe() {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return null;
    }
    return getMessaging(app);
  } catch {
    return null;
  }
}
