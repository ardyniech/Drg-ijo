import { createFileRoute } from "@tanstack/react-router";
import { adminDb, verifyIdTokenWithCheckRevoked } from "../../server/firebase-admin";
import { z } from "zod";

const ALLOWED_DEVICE_ROLES = ["satgas", "korlap", "admin", "super_admin"] as const;

const fcmSchema = z.object({
  token: z.string().min(20).max(4096),
  deviceType: z.string().max(40).optional(),
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/fcm/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          const tokenHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
          if (!tokenHeader) return json({ error: "Unauthorized" }, 401);

          const decoded = await verifyIdTokenWithCheckRevoked(tokenHeader);
          const parsed = fcmSchema.safeParse(await request.json());
          if (!parsed.success) return json({ error: parsed.error.format() }, 400);

          const { token, deviceType } = parsed.data;
          if (token.startsWith("mock-fcm-token")) {
            return json({ error: "Invalid FCM token" }, 400);
          }

          const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
          const userData = userDoc.exists ? userDoc.data() : {};
          const role = String(decoded.role || userData?.role || "member");

          // Only field responders receive SOS push; regular members must not register.
          if (!(ALLOWED_DEVICE_ROLES as readonly string[]).includes(role)) {
            return json(
              { error: "Forbidden: hanya satgas/korlap yang menerima notifikasi SOS" },
              403,
            );
          }

          // Keep the doc-ID scheme identical to the client (`<uid>_<token-prefix>`).
          const deviceRef = adminDb
            .collection("satgas_devices")
            .doc(`${decoded.uid}_${token.substring(0, 16)}`);
          await deviceRef.set(
            {
              userId: decoded.uid,
              token,
              role,
              deviceType: deviceType || "web",
              updatedAt: new Date().toISOString(),
            },
            { merge: true },
          );

          return json({ status: "success", message: "FCM token registered successfully" });
        } catch (e: unknown) {
          console.error("POST /api/fcm/register failed:", e);
          return json({ error: "Internal server error" }, 500);
        }
      },
    },
  },
});
