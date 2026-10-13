import { adminDb, adminMessaging } from "../../../../server/firebase-admin";
import {
  INCIDENT_MANAGER_ROLES,
  isRateLimited,
  isRepeatedSos,
  nextRateLimitState,
  evaluateIncidentUpdatePermission,
} from "./incident-rules";

export class IncidentRateLimitedError extends Error {
  constructor() {
    super("Terlalu banyak permintaan SOS dalam waktu singkat");
    this.name = "IncidentRateLimitedError";
  }
}

export interface CreateIncidentInput {
  uid: string;
  driverName: string;
  driverPhone: string;
  idempotencyKey: string;
  kategori: string;
  deskripsi?: string;
  latitude?: number;
  longitude?: number;
  lokasiText?: string;
}

export interface CreateIncidentResult {
  status: "created" | "already_exists";
  incidentId: string;
  data: Record<string, unknown>;
}

export async function createIncident(input: CreateIncidentInput): Promise<CreateIncidentResult> {
  const {
    uid,
    driverName,
    driverPhone,
    idempotencyKey,
    kategori,
    deskripsi,
    latitude,
    longitude,
    lokasiText,
  } = input;

  const rateLimitRef = adminDb.collection("rate_limits").doc(uid);
  const now = Date.now();

  return adminDb.runTransaction(async (transaction) => {
    const rateDoc = await transaction.get(rateLimitRef);
    const lastTime = rateDoc.exists ? Number(rateDoc.data()?.lastIncidentTime ?? 0) : 0;
    const count = rateDoc.exists ? Number(rateDoc.data()?.count ?? 0) : 0;

    if (isRateLimited(count, lastTime, now)) {
      throw new IncidentRateLimitedError();
    }

    transaction.set(rateLimitRef, nextRateLimitState(lastTime, count, now), { merge: true });

    // Idempotency is scoped to the owner: the server generates the doc ID,
    // and we only ever look up (and return) the caller's own incident.
    const existingQuery = adminDb
      .collection("incidents")
      .where("userId", "==", uid)
      .where("idempotencyKey", "==", idempotencyKey)
      .limit(1);
    const existing = await transaction.get(existingQuery);
    if (!existing.empty) {
      const doc = existing.docs[0];
      return {
        status: "already_exists",
        incidentId: doc.id,
        data: doc.data() as Record<string, unknown>,
      };
    }

    const isRepeated = isRepeatedSos(lastTime, now);
    const timestamp = new Date().toISOString();
    const incidentRef = adminDb.collection("incidents").doc();
    const incidentData: Record<string, unknown> = {
      idempotencyKey,
      userId: uid,
      driverName,
      driverPhone,
      kategori,
      deskripsi: deskripsi || "",
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      lokasiText: lokasiText || "Lokasi Darurat",
      status: "aktif",
      isRepeated,
      responders: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    transaction.create(incidentRef, incidentData);

    const logRef = adminDb.collection("incident_logs").doc();
    transaction.set(logRef, {
      incidentId: incidentRef.id,
      userId: uid,
      action: "CREATE",
      details: `SOS dibuat oleh ${driverName} (${kategori})${isRepeated ? " [BERULANG]" : ""}`,
      timestamp,
    });

    return { status: "created", incidentId: incidentRef.id, data: incidentData };
  });
}

export async function notifySatgas(input: {
  incidentId: string;
  driverName: string;
  kategori: string;
  isRepeated: boolean;
}): Promise<void> {
  const { incidentId, driverName, kategori, isRepeated } = input;
  try {
    const devicesSnapshot = await adminDb
      .collection("satgas_devices")
      .where("role", "in", ["satgas", "korlap"])
      .get();

    const tokens: string[] = [];
    devicesSnapshot.forEach((doc) => {
      const token = doc.data()?.token;
      if (typeof token === "string" && token.length > 0) tokens.push(token);
    });

    for (let i = 0; i < tokens.length; i += 500) {
      const chunk = tokens.slice(i, i + 500);
      await adminMessaging.sendEachForMulticast({
        tokens: chunk,
        notification: {
          title: isRepeated ? "⚠️ SOS BERULANG DARURAT" : "🚨 DARURAT SOS BARU",
          body: `${driverName} membutuhkan bantuan (${kategori})!`,
        },
        data: { incidentId, kategori },
      });
    }
  } catch (fcmErr) {
    // Push failure must never fail the SOS write.
    console.error("FCM push notification error (non-fatal):", fcmErr);
  }
}

export interface UpdateIncidentInput {
  id: string;
  status: string;
  responderId?: string;
  uid: string;
  role: string;
}

export type UpdateIncidentResult = { ok: true } | { ok: false; code: 404 | 403; error: string };

export async function updateIncidentStatus(
  input: UpdateIncidentInput,
): Promise<UpdateIncidentResult> {
  const { id, status, responderId, uid, role } = input;
  const incidentRef = adminDb.collection("incidents").doc(id);
  const incidentDoc = await incidentRef.get();
  if (!incidentDoc.exists) {
    return { ok: false, code: 404, error: "Incident not found" };
  }

  const incidentData = incidentDoc.data() as Record<string, unknown>;
  const permission = evaluateIncidentUpdatePermission({
    userId: uid,
    ownerId: String(incidentData.userId ?? ""),
    role,
    newStatus: status,
  });
  if (!permission.allowed) {
    return { ok: false, code: 403, error: permission.error || "Forbidden" };
  }

  const isManager = (INCIDENT_MANAGER_ROLES as readonly string[]).includes(role);
  const updatePayload: Record<string, unknown> = {
    status,
    updatedAt: new Date().toISOString(),
  };

  if (responderId && isManager) {
    const currentResponders = Array.isArray(incidentData.responders)
      ? (incidentData.responders as string[])
      : [];
    if (!currentResponders.includes(responderId)) {
      updatePayload.responders = [...currentResponders, responderId];
    }
  }

  await adminDb.runTransaction(async (transaction) => {
    transaction.update(incidentRef, updatePayload);
    const logRef = adminDb.collection("incident_logs").doc();
    transaction.set(logRef, {
      incidentId: id,
      userId: uid,
      action: "UPDATE",
      details: `Status diubah ke ${status}`,
      timestamp: new Date().toISOString(),
    });
  });

  return { ok: true };
}
