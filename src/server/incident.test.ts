import { describe, it, expect } from "vitest";
import {
  createIncidentSchema,
  patchIncidentSchema,
  evaluateIncidentUpdatePermission,
  isRepeatedSos,
  isRateLimited,
  nextRateLimitState,
  RATE_LIMIT_MAX_PER_WINDOW,
  RATE_LIMIT_WINDOW_MS,
} from "@/modules/kejadian/server/incident-rules";

describe("Incident server rules (real handler logic)", () => {
  describe("createIncidentSchema validation", () => {
    it("accepts a valid incident creation payload", () => {
      const result = createIncidentSchema.safeParse({
        idempotencyKey: "inc_123",
        kategori: "kecelakaan",
        deskripsi: "Tabrakan di jalan raya",
        latitude: -6.2,
        longitude: 106.8,
        lokasiText: "Jl Sudirman",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing idempotencyKey or kategori", () => {
      expect(createIncidentSchema.safeParse({ deskripsi: "Tabrakan" }).success).toBe(false);
    });

    it("rejects unknown categories", () => {
      const result = createIncidentSchema.safeParse({
        idempotencyKey: "inc_1",
        kategori: "kategori_ngawur",
      });
      expect(result.success).toBe(false);
    });

    it("rejects out-of-range coordinates", () => {
      const result = createIncidentSchema.safeParse({
        idempotencyKey: "inc_1",
        kategori: "medis",
        latitude: 200,
        longitude: 500,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("patchIncidentSchema validation", () => {
    it("accepts a valid status transition payload", () => {
      const result = patchIncidentSchema.safeParse({
        id: "inc_123",
        status: "dalam_penanganan",
        responderId: "satgas_01",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
      const result = patchIncidentSchema.safeParse({ id: "inc_123", status: "invalid_status" });
      expect(result.success).toBe(false);
    });
  });

  describe("evaluateIncidentUpdatePermission", () => {
    it("allows owner to cancel their own incident", () => {
      const res = evaluateIncidentUpdatePermission({
        userId: "user_1",
        ownerId: "user_1",
        role: "member",
        newStatus: "dibatalkan",
      });
      expect(res.allowed).toBe(true);
    });

    it("forbids owner from changing status to selesai/dalam_penanganan", () => {
      const res = evaluateIncidentUpdatePermission({
        userId: "user_1",
        ownerId: "user_1",
        role: "member",
        newStatus: "selesai",
      });
      expect(res.allowed).toBe(false);
      expect(res.error).toContain("Owner can only cancel");
    });

    it("allows satgas/korlap/admin/super_admin to update any incident", () => {
      for (const role of ["satgas", "korlap", "admin", "super_admin"]) {
        const res = evaluateIncidentUpdatePermission({
          userId: "responder_1",
          ownerId: "user_1",
          role,
          newStatus: "selesai",
        });
        expect(res.allowed).toBe(true);
      }
    });

    it("forbids a regular member from updating someone else's incident", () => {
      const res = evaluateIncidentUpdatePermission({
        userId: "user_2",
        ownerId: "user_1",
        role: "member",
        newStatus: "dibatalkan",
      });
      expect(res.allowed).toBe(false);
      expect(res.error).toBe("Forbidden");
    });
  });

  describe("rate limiting", () => {
    it("detects repeated SOS within the window", () => {
      const now = Date.now();
      expect(isRepeatedSos(now - 20_000, now)).toBe(true);
      expect(isRepeatedSos(now - 70_000, now)).toBe(false);
    });

    it("enforces a hard cap within the window", () => {
      const now = Date.now();
      expect(isRateLimited(RATE_LIMIT_MAX_PER_WINDOW, now - 1_000, now)).toBe(true);
      expect(isRateLimited(RATE_LIMIT_MAX_PER_WINDOW - 1, now - 1_000, now)).toBe(false);
      // Outside the window the counter resets, so it is never limited.
      expect(isRateLimited(99, now - RATE_LIMIT_WINDOW_MS - 1, now)).toBe(false);
    });

    it("resets the counter when the window has elapsed", () => {
      const now = Date.now();
      expect(nextRateLimitState(now - 20_000, 3, now)).toEqual({ count: 4, lastIncidentTime: now });
      expect(nextRateLimitState(now - 70_000, 3, now)).toEqual({ count: 1, lastIncidentTime: now });
    });
  });
});
