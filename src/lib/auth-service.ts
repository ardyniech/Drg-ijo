import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "./firebase-client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { checkAndMigrateLocalAuth } from "@/modules/auth/logic/client-migration-helper";

export class AuthService {
  private static googleProvider = new GoogleAuthProvider();

  static async signInWithEmail(email: string, pass: string) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await checkAndMigrateLocalAuth(cred.user.uid, cred.user.email);
      const tokenResult = await cred.user.getIdTokenResult(true);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      const session = {
        user: {
          id: cred.user.uid,
          email: cred.user.email,
          user_metadata: {
            nama: userData?.nama || cred.user.displayName || "Driver",
            role: tokenResult.claims.role || userData?.role || "member",
            verified_member:
              tokenResult.claims.verified_member || userData?.verified_member || false,
          },
        },
        access_token: await cred.user.getIdToken(),
      };
      return { session, error: null };
    } catch (e: unknown) {
      const err = e as Error;
      return { session: null, error: err };
    }
  }

  static async signInWithGoogle() {
    try {
      const cred = await signInWithPopup(auth, this.googleProvider);
      const user = cred.user;

      await checkAndMigrateLocalAuth(user.uid, user.email);

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      let userData: Record<string, unknown> = {};
      if (!userDoc.exists()) {
        userData = {
          email: user.email,
          nama: user.displayName || "Driver Google",
          role: "member",
          verified_member: false,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, userData);
      } else {
        userData = userDoc.data();
      }

      const tokenResult = await user.getIdTokenResult(true);
      const session = {
        user: {
          id: user.uid,
          email: user.email,
          user_metadata: {
            nama: userData?.nama || user.displayName || "Driver",
            role: tokenResult.claims.role || userData?.role || "member",
            verified_member:
              tokenResult.claims.verified_member || userData?.verified_member || false,
          },
        },
        access_token: await user.getIdToken(),
      };
      return { session, error: null };
    } catch (e: unknown) {
      const err = e as Error;
      return { session: null, error: err };
    }
  }

  static async signUpWithEmail(email: string, pass: string, nama: string) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const uid = cred.user.uid;

      await setDoc(doc(db, "users", uid), {
        email: email.trim(),
        nama,
        role: "member",
        verified_member: false,
        createdAt: new Date().toISOString(),
      });

      const tokenResult = await cred.user.getIdTokenResult(true);
      const session = {
        user: {
          id: uid,
          email: cred.user.email,
          user_metadata: {
            nama,
            role: tokenResult.claims.role || "member",
            verified_member: tokenResult.claims.verified_member || false,
          },
        },
        access_token: await cred.user.getIdToken(),
      };
      return { session, error: null };
    } catch (e: unknown) {
      const err = e as Error;
      return { session: null, error: err };
    }
  }

  static async signOut() {
    await fbSignOut(auth);
  }

  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}
