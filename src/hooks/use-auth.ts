import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  nama: string;
  role: "member" | "satgas" | "korlap";
  verified_member: boolean;
  phone?: string;
}

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setProfile(userSnap.data() as UserProfile);
          } else {
            const tokenResult = await firebaseUser.getIdResult();
            const claims = tokenResult.claims;
            setProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              nama: firebaseUser.displayName || "Driver DRG",
              role: (claims.role as string) || "member",
              verified_member: !!claims.verified_member,
            });
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
}
