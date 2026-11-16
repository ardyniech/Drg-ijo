import { getMessaging } from "firebase/messaging";
import { app, auth, db, firebaseConfig } from "./firebase";

export { app, auth, db, firebaseConfig };

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
