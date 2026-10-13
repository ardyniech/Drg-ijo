import { createFileRoute } from "@tanstack/react-router";
import { adminDb, verifyIdTokenWithCheckRevoked } from "../../server/firebase-admin";
import {
  createIncidentSchema,
  patchIncidentSchema,
} from "@/modules/kejadian/server/incident-rules";
import {
  createIncident,
  notifySatgas,
  updateIncidentStatus,
  IncidentRateLimitedError,
} from "@/modules/kejadian/server/incident-service";

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function bearerToken(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  return authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
}

export const Route = createFileRoute("/api/incidents")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const token = bearerToken(request);
          if (!token) return json({ error: "Unauthorized" }, 401);

          const decoded = await verifyIdTokenWithCheckRevoked(token);
          if (
            decoded.verified_member !== true &&
            decoded.role !== "admin" &&
            decoded.role !== "super_admin"
          ) {
            return json({ error: "Forbidden: Verified member required to trigger SOS" }, 403);
          }

          const parsed = createIncidentSchema.safeParse(await request.json());
          if (!parsed.success) return json({ error: parsed.error.format() }, 400);

          const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
          const userData = userDoc.exists ? userDoc.data() : {};
          const driverName = String(userData?.nama || decoded.name || "Driver Dulur");
          const driverPhone = String(userData?.phone || "-");

          const result = await createIncident({
            uid: decoded.uid,
            driverName,
            driverPhone,
            ...parsed.data,
          });

          // Push only on a fresh write; duplicates/replays must not re-blast satgas.
          if (result.status === "created") {
            await notifySatgas({
              incidentId: result.incidentId,
              driverName,
              kategori: parsed.data.kategori,
              isRepeated: Boolean(result.data.isRepeated),
            });
          }

          return json({ status: "success", incident: result.data }, 201);
        } catch (e: unknown) {
          if (e instanceof IncidentRateLimitedError) {
            return json({ error: e.message }, 429);
          }
          console.error("POST /api/incidents failed:", e);
          return json({ error: "Internal server error" }, 500);
        }
      },

      PATCH: async ({ request }) => {
        try {
          const token = bearerToken(request);
          if (!token) return json({ error: "Unauthorized" }, 401);

          const decoded = await verifyIdTokenWithCheckRevoked(token);
          const parsed = patchIncidentSchema.safeParse(await request.json());
          if (!parsed.success) return json({ error: parsed.error.format() }, 400);

          const result = await updateIncidentStatus({
            ...parsed.data,
            uid: decoded.uid,
            role: String(decoded.role || "member"),
          });
          if (!result.ok) return json({ error: result.error }, result.code);

          return json({ status: "success", updatedId: parsed.data.id }, 200);
        } catch (e: unknown) {
          console.error("PATCH /api/incidents failed:", e);
          return json({ error: "Internal server error" }, 500);
        }
      },
    },
  },
});
