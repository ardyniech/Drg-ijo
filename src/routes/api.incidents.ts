import { createFileRoute } from "@tanstack/react-router";
import {
  adminDb,
  adminMessaging,
  verifyIdTokenWithCheckRevoked,
} from "../../server/firebase-admin";
import { z } from "zod";

const createIncidentSchema = z.object({
  idempotencyKey: z.string().min(1),
  kategori: z.string().min(1),
  deskripsi: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  lokasiText: z.string().optional(),
});

const patchIncidentSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["aktif", "ditangani", "selesai", "dibatalkan"]),
  responderId: z.string().optional(),
});

export const Route = createFileRoute("/api/incidents")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
          if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }

          const decoded = await verifyIdTokenWithCheckRevoked(token);
          if (
            decoded.verified_member !== true &&
            decoded.role !== "admin" &&
            decoded.role !== "super_admin"
          ) {
            return new Response(
              JSON.stringify({ error: "Forbidden: Verified member required to trigger SOS" }),
              { status: 403 },
            );
          }

          const body = await request.json();
          const parsed = createIncidentSchema.safeParse(body);
          if (!parsed.success) {
            return new Response(JSON.stringify({ error: parsed.error.format() }), { status: 400 });
          }

          const { idempotencyKey, kategori, deskripsi, latitude, longitude, lokasiText } =
            parsed.data;

          // Fetch user profile for name & phone
          const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
          const userData = userDoc.exists ? userDoc.data() : {};
          const driverName = userData?.nama || decoded.name || "Driver Dulur";
          const driverPhone = userData?.phone || "-";

          // Firestore transaction for rate-limiting & creation
          const incidentRef = adminDb.collection("incidents").doc(idempotencyKey);
          const rateLimitRef = adminDb.collection("rate_limits").doc(decoded.uid);

          const result = await adminDb.runTransaction(async (transaction) => {
            const now = Date.now();
            const rateDoc = await transaction.get(rateLimitRef);
            let isRepeated = false;

            if (rateDoc.exists) {
              const lastTime = rateDoc.data()?.lastIncidentTime || 0;
              const count = rateDoc.data()?.count || 0;
              if (now - lastTime < 60000) {
                // Within 1 minute: anti-spam soft rate limit -> flag as repeated SOS
                isRepeated = true;
                transaction.update(rateLimitRef, { count: count + 1, lastIncidentTime: now });
              } else {
                transaction.set(rateLimitRef, { lastIncidentTime: now, count: 1 });
              }
            } else {
              transaction.set(rateLimitRef, { lastIncidentTime: now, count: 1 });
            }

            const existingIncident = await transaction.get(incidentRef);
            if (existingIncident.exists) {
              return {
                incidentId: idempotencyKey,
                status: "already_exists",
                data: existingIncident.data(),
              };
            }

            const incidentData = {
              id: idempotencyKey,
              userId: decoded.uid,
              driverName,
              driverPhone,
              kategori,
              deskripsi: deskripsi || "",
              latitude: latitude || null,
              longitude: longitude || null,
              lokasiText: lokasiText || "Lokasi Darurat",
              status: isRepeated ? "aktif_berulang" : "aktif",
              isRepeated,
              responders: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            transaction.create(incidentRef, incidentData);

            const logRef = adminDb.collection("incident_logs").doc();
            transaction.set(logRef, {
              incidentId: idempotencyKey,
              userId: decoded.uid,
              action: "CREATE",
              details: `SOS dibuat oleh ${driverName} (${kategori})${isRepeated ? " [BERULANG]" : ""}`,
              timestamp: new Date().toISOString(),
            });

            return { incidentId: idempotencyKey, status: "created", data: incidentData };
          });

          // Trigger FCM push notification to Satgas/Korlap after successful write
          if (result.status === "created" || result.status === "already_exists") {
            try {
              const devicesSnapshot = await adminDb.collection("satgas_devices").get();
              const tokens: string[] = [];
              devicesSnapshot.forEach((doc) => {
                const d = doc.data();
                if (d?.token) tokens.push(d.token);
              });

              if (tokens.length > 0) {
                // Batch tokens in chunks of 500
                for (let i = 0; i < tokens.length; i += 500) {
                  const chunk = tokens.slice(i, i + 500);
                  await adminMessaging.sendEachForMulticast({
                    tokens: chunk,
                    notification: {
                      title: result.data.isRepeated
                        ? "⚠️ SOS BERULANG DARURAT"
                        : "🚨 DARURAT SOS BARU",
                      body: `${driverName} membutuhkan bantuan (${kategori})!`,
                    },
                    data: {
                      incidentId: result.incidentId,
                      kategori,
                    },
                  });
                }
              }
            } catch (fcmErr) {
              console.error("FCM push notification error (non-fatal):", fcmErr);
            }
          }

          return new Response(JSON.stringify({ status: "success", incident: result.data }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Internal server error";
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      PATCH: async ({ request }) => {
        try {
          const authHeader = request.headers.get("Authorization");
          const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
          if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
          }

          const decoded = await verifyIdTokenWithCheckRevoked(token);
          const body = await request.json();
          const parsed = patchIncidentSchema.safeParse(body);
          if (!parsed.success) {
            return new Response(JSON.stringify({ error: parsed.error.format() }), { status: 400 });
          }

          const { id, status, responderId } = parsed.data;
          const incidentRef = adminDb.collection("incidents").doc(id);
          const incidentDoc = await incidentRef.get();

          if (!incidentDoc.exists) {
            return new Response(JSON.stringify({ error: "Incident not found" }), { status: 404 });
          }

          const incidentData = incidentDoc.data()!;
          const isOwner = incidentData.userId === decoded.uid;
          const isSatgasOrKorlap = ["satgas", "korlap", "admin", "super_admin"].includes(
            decoded.role,
          );

          // Authorization & transition rules
          if (isOwner) {
            if (status !== "dibatalkan") {
              return new Response(
                JSON.stringify({ error: "Owner can only cancel their own incident" }),
                { status: 403 },
              );
            }
          } else if (!isSatgasOrKorlap) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
          }

          const updatePayload: Record<string, unknown> = {
            status,
            updatedAt: new Date().toISOString(),
          };

          if (responderId && isSatgasOrKorlap) {
            const currentResponders = incidentData.responders || [];
            if (!currentResponders.includes(responderId)) {
              updatePayload.responders = [...currentResponders, responderId];
            }
          }

          await adminDb.runTransaction(async (transaction) => {
            transaction.update(incidentRef, updatePayload);
            const logRef = adminDb.collection("incident_logs").doc();
            transaction.set(logRef, {
              incidentId: id,
              userId: decoded.uid,
              action: "UPDATE",
              details: `Status diubah ke ${status} oleh ${decoded.email || decoded.uid}`,
              timestamp: new Date().toISOString(),
            });
          });

          return new Response(JSON.stringify({ status: "success", updatedId: id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
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
