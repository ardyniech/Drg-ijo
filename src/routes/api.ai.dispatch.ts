import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const RequestSchema = z.object({
  category: z.string(),
  location: z.string(),
  description: z.string(),
  driverName: z.string().optional(),
});

function getRuleBasedFallback(category: string, location: string) {
  const isMedisOrCrash = category.toLowerCase().includes("medis") || category.toLowerCase().includes("senggol");
  return {
    severity: isMedisOrCrash ? "tinggi" : "sedang",
    priorityTitle: `Rekomendasi Satgas Jalur — ${location || "Pangkalan"}`,
    emergencySteps: [
      "Amankan kendaraan ke bahu jalan dan pasang tanda bahaya/lampu hazard.",
      "Hubungi dulur satgas terdekat via kanal radio HT atau tombol darurat.",
      "Tetap tenang, jangan panik, dan pantau posisi GPS di peta radar.",
    ],
    dispatchRecommendation: `Luncurkan 2 personil Satgas terdekat dengan rompi keselamatan dan perkakas darurat ke arah ${location}.`,
    nearestShelterAdvice: "Koordinasi dengan Posko DRG Pangkalan terdekat untuk evakuasi atau bantuan teknis.",
    isAiGenerated: false,
  };
}

export const Route = createFileRoute("/api/ai/dispatch")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = RequestSchema.safeParse(body);
          if (!parsed.success) {
            return new Response(JSON.stringify({ error: "Input analisis tidak valid" }), { status: 400 });
          }

          const { category, location, description, driverName } = parsed.data;
          const apiKey = process.env.GEMINI_API_KEY;

          if (!apiKey) {
            const fallback = getRuleBasedFallback(category, location);
            return new Response(JSON.stringify({ ...fallback, note: "Mesin aturan lokal aktif" }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          const ai = new GoogleGenAI();
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
            model: "gemini-3.8-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" },
          });

          const rawText = res.text || "{}";
          const data = JSON.parse(rawText);

          return new Response(
            JSON.stringify({ ...data, isAiGenerated: true }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch {
          const fallback = getRuleBasedFallback("umum", "Jalur");
          return new Response(JSON.stringify({ ...fallback, note: "Penyangga darurat offline" }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
