import { describe, it, expect } from "vitest";
import { z } from "zod";

const fcmSchema = z.object({
  token: z.string().min(1),
  deviceType: z.string().optional(),
});

describe("API FCM Registration Validation", () => {
  it("should validate valid FCM token payload", () => {
    const payload = { token: "fcm_test_token_12345", deviceType: "web" };
    const parsed = fcmSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
  });

  it("should reject empty FCM token", () => {
    const payload = { token: "", deviceType: "web" };
    const parsed = fcmSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });
});
