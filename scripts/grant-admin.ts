import { adminAuth, adminDb } from "../server/firebase-admin";

const email = process.argv[2];
const role = process.argv[3] || "super_admin";

function assertCredentialConfigured() {
  const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT;
  const hasSplitKey = !!process.env.FIREBASE_PRIVATE_KEY && !!process.env.FIREBASE_CLIENT_EMAIL;
  if (!hasServiceAccount && !hasSplitKey) {
    console.error(
      "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT (JSON) " +
        "or FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL before running this script.",
    );
    process.exit(1);
  }
}

async function main() {
  assertCredentialConfigured();

  if (!email) {
    console.error("Usage: bun scripts/grant-admin.ts <email> [role=super_admin]");
    process.exit(1);
  }

  const user = await adminAuth.getUserByEmail(email);
  await adminAuth.setCustomUserClaims(user.uid, { role, verified_member: true });
  await adminAuth.revokeRefreshTokens(user.uid);
  await adminDb
    .collection("users")
    .doc(user.uid)
    .set(
      { email, role, verified_member: true, updatedAt: new Date().toISOString() },
      { merge: true },
    );

  console.log(`Granted role "${role}" to ${email} (uid=${user.uid}).`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
