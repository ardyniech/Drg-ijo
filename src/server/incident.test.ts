import { describe, it, expect } from "vitest";
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

describe("Incident API Endpoints & Business Rules", () => {
  describe("createIncidentSchema validation", () => {
    it("should successfully parse valid incident creation payload", () => {
      const payload = {
        idempotencyKey: "inc_123",
        kategori: "Kecelakaan",
        deskripsi: "Tabrakan di jalan raya",
        latitude: -6.2,
        longitude: 106.8,
        lokasiText: "Jl Sudirman",
      };
      const result = createIncidentSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should fail when idempotencyKey or kategori is missing", () => {
      const payload = {
        deskripsi: "Tabrakan",
      };
      const result = createIncidentSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("patchIncidentSchema validation", () => {
    it("should successfully parse valid patch payload", () => {
      const payload = {
        id: "inc_123",
        status: "ditangani",
        responderId: "satgas_01",
      };
      const result = patchIncidentSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should reject invalid status", () => {
      const payload = {
        id: "inc_123",
        status: "invalid_status",
      };
      const result = patchIncidentSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("Role-Based Access & Status Transition Rules", () => {
    const evaluateUpdatePermission = (
      userRole: string,
      userId: string,
      incidentOwnerId: string,
      currentStatus: string,
      newStatus: string
    ) => {
      const isOwner = userId === incidentOwnerId;
      const isSatgasOrKorlap = ["satgas", "korlap", "admin", "super_admin"].includes(userRole);

      if (isOwner) {
        if (newStatus !== "dibatalkan") {
          return { allowed: false, error: "Owner can only cancel their own incident" };
        }
        return { allowed: true };
      }

      if (!isSatgasOrKorlap) {
        return { allowed: false, error: "Forbidden" };
      }

      return { allowed: true };
    };

    it("should allow owner to cancel their own incident", () => {
      const res = evaluateUpdatePermission("member", "user_1", "user_1", "aktif", "dibatalkan");
      expect(res.allowed).toBe(true);
    });

    it("should forbid owner from changing status to 'selesai' or 'ditangani'", () => {
      const res = evaluateUpdatePermission("member", "user_1", "user_1", "aktif", "selesai");
      expect(res.allowed).toBe(false);
      expect(res.error).toContain("Owner can only cancel");
    });

    it("should allow satgas/korlap to update any incident status", () => {
      const res = evaluateUpdatePermission("satgas", "satgas_1", "user_1", "aktif", "selesai");
      expect(res.allowed).toBe(true);
    });

    it("should forbid regular member from updating someone else's incident", () => {
      const res = evaluateUpdatePermission("member", "user_2", "user_1", "aktif", "dibatalkan");
      expect(res.allowed).toBe(false);
      expect(res.error).toBe("Forbidden");
    });
  });

  describe("Rate-Limiting Logic for Repeated SOS", () => {
    it("should detect repeated SOS within 1 minute window", () => {
      const checkRateLimit = (lastIncidentTime: number, now: number) => {
        return now - lastIncidentTime < 60000;
      };

      const now = Date.now();
      expect(checkRateLimit(now - 20000, now)).toBe(true); // 20s ago -> repeated
      expect(checkRateLimit(now - 70000, now)).toBe(false); // 70s ago -> normal
    });
  });
});
