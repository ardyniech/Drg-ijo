import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSafetyIntelligence } from "../use-safety-intelligence";

describe("AI Safety Intelligence & Dispatching Hook", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("handles successful AI response from endpoint", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementationOnce(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            severity: "tinggi",
            priorityTitle: "Evakuasi Senggolan Jalur",
            emergencySteps: ["Langkah 1", "Langkah 2"],
            dispatchRecommendation: "Kirim tim Satgas",
            nearestShelterAdvice: "Posko Suhat",
            isAiGenerated: true,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    const { result } = renderHook(() => useSafetyIntelligence());

    await act(async () => {
      await result.current.analyzeIncident({
        category: "senggolan",
        location: "Dinoyo",
        description: "Spion patah",
      });
    });

    expect(result.current.analysis?.severity).toBe("tinggi");
    expect(result.current.analysis?.isAiGenerated).toBe(true);
    expect(result.current.analysis?.emergencySteps.length).toBe(2);
  });

  it("falls back to safety rule-based advice when network fails", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementationOnce(() =>
      Promise.reject(new Error("Network failure")),
    );

    const { result } = renderHook(() => useSafetyIntelligence());

    await act(async () => {
      await result.current.analyzeIncident({
        category: "mogok",
        location: "Kepanjen",
        description: "Busi mati",
      });
    });

    expect(result.current.analysis).toBeDefined();
    expect(result.current.analysis?.isAiGenerated).toBe(false);
    expect(result.current.analysis?.emergencySteps.length).toBeGreaterThan(0);
    expect(result.current.error).toBe("Network failure");
  });
});
