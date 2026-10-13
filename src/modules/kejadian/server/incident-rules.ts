import { z } from "zod";

export const INCIDENT_CATEGORIES = [
  "kecelakaan",
  "begal_kriminal",
  "mogok_mesin",
  "razia_kendala",
  "medis",
] as const;

export const INCIDENT_STATUSES = ["aktif", "dalam_penanganan", "selesai", "dibatalkan"] as const;

export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_PER_WINDOW = 5;

export const createIncidentSchema = z.object({
  idempotencyKey: z.string().min(1).max(128),
  kategori: z.enum(INCIDENT_CATEGORIES),
  deskripsi: z.string().max(1000).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  lokasiText: z.string().max(200).optional(),
});

export const patchIncidentSchema = z.object({
  id: z.string().min(1).max(128),
  status: z.enum(INCIDENT_STATUSES),
  responderId: z.string().max(128).optional(),
});

export function isRepeatedSos(lastIncidentTime: number, now: number): boolean {
  return now - lastIncidentTime < RATE_LIMIT_WINDOW_MS;
}

export function isRateLimited(count: number, lastIncidentTime: number, now: number): boolean {
  return now - lastIncidentTime < RATE_LIMIT_WINDOW_MS && count >= RATE_LIMIT_MAX_PER_WINDOW;
}

export function nextRateLimitState(
  lastIncidentTime: number,
  count: number,
  now: number,
): { count: number; lastIncidentTime: number } {
  const repeated = isRepeatedSos(lastIncidentTime, now);
  return { count: repeated ? count + 1 : 1, lastIncidentTime: now };
}

export const INCIDENT_MANAGER_ROLES = ["satgas", "korlap", "admin", "super_admin"] as const;

export function evaluateIncidentUpdatePermission(params: {
  userId: string;
  ownerId: string;
  role: string;
  newStatus: string;
}): { allowed: boolean; error?: string } {
  const { userId, ownerId, role, newStatus } = params;
  if (userId === ownerId) {
    return newStatus === "dibatalkan"
      ? { allowed: true }
      : { allowed: false, error: "Owner can only cancel their own incident" };
  }
  return (INCIDENT_MANAGER_ROLES as readonly string[]).includes(role)
    ? { allowed: true }
    : { allowed: false, error: "Forbidden" };
}
