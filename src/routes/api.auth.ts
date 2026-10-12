import { createFileRoute } from "@tanstack/react-router";
import { adminAuth, adminDb, verifyIdTokenWithCheckRevoked } from "../../server/firebase-admin";

export const Route = createFileRoute("/api/auth")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { action, idToken, email, password, nama, targetUid, newRole, verifiedMember } = body;

          if (action === "verify-session") {
            if (!idToken) {
              return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
            }
            const decoded = await verifyIdTokenWithCheckRevoked(idToken);
            const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
            const userData = userDoc.exists ? userDoc.data() : {};

            return new Response(
              JSON.stringify({
                status: "success",
                user: {
                  id: decoded.uid,
                  email: decoded.email,
                  nama: userData?.nama || decoded.name || "Driver",
                  role: decoded.role || "member",
                  verified_member: decoded.verified_member || false,
                },
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          if (action === "set-role" || action === "verify-member") {
            const authHeader = request.headers.get("Authorization");
            const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : idToken;
            if (!token) {
              return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
            }
            const decoded = await verifyIdTokenWithCheckRevoked(token);
            if (decoded.role !== "admin" && decoded.role !== "super_admin" && decoded.role !== "korlap") {
              return new Response(JSON.stringify({ error: "Forbidden: Admin/Korlap required" }), { status: 403 });
            }

            const targetUser = await adminAuth.getUser(targetUid);
            const currentClaims = targetUser.customClaims || {};
            const updatedClaims = { ...currentClaims };

            if (newRole) updatedClaims.role = newRole;
            if (verifiedMember !== undefined) updatedClaims.verified_member = verifiedMember;

            await adminAuth.setCustomUserClaims(targetUid, updatedClaims);
            await adminAuth.revokeRefreshTokens(targetUid);

            await adminDb.collection("users").doc(targetUid).set(
              {
                role: updatedClaims.role,
                verified_member: updatedClaims.verified_member,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );

            return new Response(JSON.stringify({ status: "success", claims: updatedClaims }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "bootstrap-admin") {
            // Manual bootstrap script endpoint (secured by a secret or initial setup key)
            const { secretKey, uid } = body;
            if (secretKey !== (import.meta.env.VITE_ADMIN_BOOTSTRAP_SECRET || "drg-bootstrap-secret-2026")) {
              return new Response(JSON.stringify({ error: "Invalid bootstrap secret" }), { status: 403 });
            }
            await adminAuth.setCustomUserClaims(uid, { role: "super_admin", verified_member: true });
            await adminAuth.revokeRefreshTokens(uid);
            await adminDb.collection("users").doc(uid).set(
              { role: "super_admin", verified_member: true, updatedAt: new Date().toISOString() },
              { merge: true }
            );
            return new Response(JSON.stringify({ status: "success", message: "Admin bootstrapped successfully" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Internal server error";
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
