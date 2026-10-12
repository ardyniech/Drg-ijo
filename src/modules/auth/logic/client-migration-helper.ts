import { db } from "@/lib/firebase-client";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function checkAndMigrateLocalAuth(
  firebaseUserUid: string,
  firebaseUserEmail: string | null,
) {
  try {
    const localUserRaw =
      localStorage.getItem("drg_auth_user") || localStorage.getItem("drg_user_session");
    if (!localUserRaw) return false;

    const localData = JSON.parse(localUserRaw);
    const localEmail = localData.email || localData.user?.email;

    if (
      localEmail &&
      firebaseUserEmail &&
      localEmail.toLowerCase() === firebaseUserEmail.toLowerCase()
    ) {
      const userDocRef = doc(db, "users", firebaseUserUid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await setDoc(userDocRef, {
          email: firebaseUserEmail,
          nama: localData.nama || localData.user?.user_metadata?.nama || "Driver Migrasi",
          role: localData.role || localData.user?.user_metadata?.role || "member",
          verified_member:
            localData.verified_member || localData.user?.user_metadata?.verified_member || false,
          phone: localData.phone || "",
          migratedFromLocal: true,
          updatedAt: new Date().toISOString(),
        });
      }

      localStorage.removeItem("drg_auth_user");
      localStorage.removeItem("drg_user_session");
      return true;
    }
  } catch (err) {
    console.error("Client migration helper error:", err);
  }
  return false;
}
