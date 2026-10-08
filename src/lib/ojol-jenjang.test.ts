import { describe, it, expect } from "vitest";
import {
  getOjolJenjang,
  getOjolJenjangTitle,
  normalizeOjolJenjangKey,
  OJOL_JENJANG_SELECT_OPTIONS,
} from "./ojol-jenjang";

describe("Ojol Jenjang (Bahasa Khas Ojol Aspal Santui)", () => {
  it("maps calon / rookie correctly", () => {
    const meta = getOjolJenjang("calon");
    expect(meta.title).toBe("Driver Anyar");
    expect(meta.nickname).toBe("Rookie Aspal");
    expect(normalizeOjolJenjangKey("calon")).toBe("calon");
  });

  it("maps muda / rider correctly", () => {
    const meta = getOjolJenjang("muda");
    expect(meta.title).toBe("Pejuang Aspal");
    expect(meta.nickname).toBe("Rider Jalur");
    expect(normalizeOjolJenjangKey("muda")).toBe("muda");
  });

  it("maps madya / jawara correctly", () => {
    const meta = getOjolJenjang("madya");
    expect(meta.title).toBe("Suhu Gacor");
    expect(meta.nickname).toBe("Jawara Aspal");
    expect(normalizeOjolJenjangKey("madya")).toBe("madya");
  });

  it("maps purna / tetua correctly", () => {
    const meta = getOjolJenjang("purna");
    expect(meta.title).toBe("Sesepuh Aspal");
    expect(meta.nickname).toBe("Tetua Pangkalan");
    expect(normalizeOjolJenjangKey("purna")).toBe("purna");
  });

  it("provides title with nickname", () => {
    expect(getOjolJenjangTitle("madya")).toBe("Suhu Gacor (Jawara Aspal)");
  });

  it("select options contain all 4 standard levels", () => {
    expect(OJOL_JENJANG_SELECT_OPTIONS).toHaveLength(4);
    expect(OJOL_JENJANG_SELECT_OPTIONS.map((o) => o.value)).toEqual([
      "calon",
      "muda",
      "madya",
      "purna",
    ]);
  });
});
