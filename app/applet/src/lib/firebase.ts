import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

export const bootstrapSecret = process.env.BOOTSTRAP_SECRET;

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function getValidApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export const app = getValidApp();

let _auth: Auth | null = null;
let _db: Firestore | null = null;

export const auth = new Proxy({} as Auth, {
  get(_, prop) {
    if (!_auth) {
      try {
        _auth = getAuth(app);
      } catch {
        _auth = { currentUser: null } as unknown as Auth;
      }
    }
    const val = (_auth as Record<string, unknown>)[prop as string];
    return typeof val === "function" ? val.bind(_auth) : val;
  },
});

export const db = new Proxy({} as Firestore, {
  get(_, prop) {
    if (!_db) {
      try {
        _db = getFirestore(app);
      } catch {
        _db = {} as unknown as Firestore;
      }
    }
    const val = (_db as Record<string, unknown>)[prop as string];
    return typeof val === "function" ? val.bind(_db) : val;
  },
});
