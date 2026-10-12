import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

function getAdminCredential() {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountEnv) {
    try {
      const sa = JSON.parse(serviceAccountEnv);
      return cert(sa);
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var", e);
    }
  }

  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    return cert({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  }

  // Fallback to Application Default Credentials (ADC)
  return undefined;
}

if (getApps().length === 0) {
  const credential = getAdminCredential();
  if (credential) {
    initializeApp({ credential });
  } else {
    initializeApp();
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
export const adminMessaging = getMessaging();

export async function verifyIdTokenWithCheckRevoked(idToken: string) {
  if (!idToken) throw new Error("No ID token provided");
  return await adminAuth.verifyIdToken(idToken, true);
}
