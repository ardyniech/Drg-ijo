import { adminAuth, adminDb } from "../server/firebase-admin";

interface LocalUserMigrationRecord {
  id: string;
  email: string;
  nama: string;
  role: string;
  verified_member?: boolean;
  passwordHash: string;
}

export async function migrateLocalUsersToFirebase(localUsers: LocalUserMigrationRecord[]) {
  console.log(`[Migration] Starting migration of ${localUsers.length} local users to Firebase Auth & Firestore...`);
  const results = { success: 0, failed: 0, errors: [] as string[] };

  for (const u of localUsers) {
    try {
      // Check if user already exists in Firebase Auth
      let firebaseUid: string;
      try {
        const existing = await adminAuth.getUserByEmail(u.email);
        firebaseUid = existing.uid;
        console.log(`[Migration] User ${u.email} already exists in Firebase Auth (${firebaseUid})`);
      } catch {
        // Create user in Firebase Auth
        const created = await adminAuth.createUser({
          email: u.email,
          displayName: u.nama,
          password: "TempPassword123!", // Initial temporary password for migrated accounts
        });
        firebaseUid = created.uid;
        console.log(`[Migration] Created Firebase Auth user for ${u.email} (${firebaseUid})`);
      }

      // Assign Custom Claims for Role
      const role = u.role || "member";
      const verified_member = u.verified_member ?? (role !== "member");
      await adminAuth.setCustomUserClaims(firebaseUid, { role, verified_member });

      // Save/Merge profile to Firestore
      await adminDb.collection("users").doc(firebaseUid).set(
        {
          email: u.email,
          nama: u.nama,
          role,
          verified_member,
          migratedFromLocal: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      results.success++;
    } catch (e: unknown) {
      results.failed++;
      const msg = e instanceof Error ? e.message : String(e);
      results.errors.push(`Failed migrating ${u.email}: ${msg}`);
      console.error(`[Migration Error] ${u.email}:`, msg);
    }
  }

  console.log(`[Migration] Completed. Success: ${results.success}, Failed: ${results.failed}`);
  return results;
}
