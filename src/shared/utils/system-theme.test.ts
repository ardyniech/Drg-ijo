import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initSystemThemeSync } from "./system-theme";

describe("System Theme Sync Utility", () => {
  let listeners: Array<(e: { matches: boolean }) => void> = [];

  beforeEach(() => {
    listeners = [];
    document.documentElement.classList.remove("dark");

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, cb: (e: { matches: boolean }) => void) => {
        if (event === "change") listeners.push(cb);
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.classList.remove("dark");
  });

  it("applies dark class when system preference matches dark", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    initSystemThemeSync();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when system preference is bright/light", () => {
    document.documentElement.classList.add("dark");
    initSystemThemeSync();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("dynamically adapts when system theme switches between dark and bright", () => {
    const cleanup = initSystemThemeSync();
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Simulasi OS beralih ke dark mode
    listeners.forEach((listener) => listener({ matches: true }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Simulasi OS beralih kembali ke bright mode
    listeners.forEach((listener) => listener({ matches: false }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    cleanup();
  });
});
