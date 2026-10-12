import { createFileRoute } from "@tanstack/react-router";
import { adminDb, verifyIdTokenWithCheckRevoked } from "../../server/firebase-admin";
import { z } from "zod";

const fcmSchema = z.object({
  token: z.string().min(1),
  deviceType: z.string().optional(),
});

export const Route = createFileRoute("/api/fcm/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          const tokenHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
          if (!tokenHeader) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }

          const decoded = await verifyIdTokenWithCheckRevoked(tokenHeader);
          const body = await request.json();
          const parsed = fcmSchema.safeParse(body);
          if (!parsed.success) {
            return new Response(JSON.stringify({ error: parsed.error.format() }), { status: 400 });
          }

          const { token, deviceType } = parsed.data;

          // Fetch user profile to get verified role
          const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
          const userData = userDoc.exists ? userDoc.data() : {};
          const role = decoded.role || userData?.role || "member";

          // Store token in satgas_devices indexed by userId or token
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

          return new Response(
            JSON.stringify({ status: "success", message: "FCM token registered successfully" }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
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
