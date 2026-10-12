import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const getEnv = (key: string): string => {
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key] as string;
  }
  if (typeof import.meta !== "undefined" && import.meta.env?.[key]) {
    return import.meta.env[key] as string;
  }
  return "";
};

export const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY") || getEnv("FIREBASE_API_KEY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN") || getEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID") || getEnv("FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET") || getEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId:
    getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") || getEnv("FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("VITE_FIREBASE_APP_ID") || getEnv("FIREBASE_APP_ID"),
};

function getValidApp() {
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

export const app = getValidApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
