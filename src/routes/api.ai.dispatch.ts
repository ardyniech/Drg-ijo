import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { verifyIdTokenWithCheckRevoked } from "../../server/firebase-admin";
import { checkRateLimit } from "../server/rate-limit";

const RequestSchema = z.object({
  category: z.string().min(1).max(60),
  location: z.string().min(1).max(120),
  description: z.string().max(1000).optional().default(""),
  driverName: z.string().max(80).optional(),
});

const AI_RATE_LIMIT = 20;
const AI_RATE_WINDOW_MS = 60_000;

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getRuleBasedFallback(category: string, location: string) {
  const isMedisOrCrash =
    category.toLowerCase().includes("medis") || category.toLowerCase().includes("senggol");
  return {
    severity: isMedisOrCrash ? "tinggi" : "sedang",
    priorityTitle: `Rekomendasi Satgas Jalur — ${location || "Pangkalan"}`,
    emergencySteps: [
      "Amankan kendaraan ke bahu jalan dan pasang tanda bahaya/lampu hazard.",
      "Hubungi dulur satgas terdekat via kanal radio HT atau tombol darurat.",
      "Tetap tenang, jangan panik, dan pantau posisi GPS di peta radar.",
    ],
    dispatchRecommendation: `Luncurkan 2 personil Satgas terdekat dengan rompi keselamatan dan perkakas darurat ke arah ${location}.`,
    nearestShelterAdvice:
      "Koordinasi dengan Posko DRG Pangkalan terdekat untuk evakuasi atau bantuan teknis.",
    isAiGenerated: false,
  };
}

export const Route = createFileRoute("/api/ai/dispatch")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
        if (!token) return json({ error: "Unauthorized" }, 401);

        let uid: string;
        let role = "member";
        let verified = false;
        try {
          const decoded = await verifyIdTokenWithCheckRevoked(token);
          uid = decoded.uid;
          role = String(decoded.role || "member");
          verified = decoded.verified_member === true;
        } catch {
          return json({ error: "Unauthorized" }, 401);
        }

        if (!verified && !["satgas", "korlap", "admin", "super_admin"].includes(role)) {
          return json({ error: "Forbidden: verified member required" }, 403);
        }

        if (!checkRateLimit(`ai:${uid}`, AI_RATE_LIMIT, AI_RATE_WINDOW_MS)) {
          return json({ error: "Rate limit exceeded" }, 429);
        }

        const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return json({ error: "Input analisis tidak valid" }, 400);
        }

        const { category, location, description, driverName } = parsed.data;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
          const fallback = getRuleBasedFallback(category, location);
          return json({ ...fallback, note: "Mesin aturan lokal aktif" });
        }

        const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

        try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `Anda adalah Sistem Komando Satgas DRG (Driver Riang Gembira), komunitas driver online Malang Raya.
Analisis laporan berikut:
- Kategori: ${category}
- Lokasi: ${location}
- Deskripsi: ${description}
- Pelapor: ${driverName || "Dulur Lapangan"}

Keluarkan JSON valid dengan skema:
{
  "severity": "tinggi" | "sedang" | "rendah",
  "priorityTitle": "string ringkas",
  "emergencySteps": ["langkah 1", "langkah 2", "langkah 3"],
  "dispatchRecommendation": "rekomendasi satgas & peralatan yang dikirim",
  "nearestShelterAdvice": "arahan posko / shelter terdekat"
}`;

          const res = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json" },
          });

          const data = JSON.parse(res.text || "{}");
          return json({ ...data, isAiGenerated: true });
        } catch (err) {
          console.error("AI dispatch analysis failed, using rule-based fallback:", err);
          const fallback = getRuleBasedFallback(category, location);
          return json({ ...fallback, note: "Penyangga darurat offline" });
        }
      },
    },
  },
});
