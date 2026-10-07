import { describe, it, expect, beforeEach } from "vitest";
import { z } from "zod";
import { safeReadStorage, safeWriteStorage } from "./safe-storage";

describe("Safe Storage Reader & Writer (Zod Validation)", () => {
  const TEST_KEY = "test_safe_storage_key";

  beforeEach(() => {
    localStorage.removeItem(TEST_KEY);
  });

  const SampleSchema = z.object({
    id: z.string(),
    count: z.number(),
  });

  it("returns fallback if storage is empty", () => {
    const fallback = { id: "def", count: 0 };
    const result = safeReadStorage(TEST_KEY, SampleSchema, fallback);
    expect(result).toEqual(fallback);
  });

  it("reads and parses valid json matching schema", () => {
    const validData = { id: "item-1", count: 42 };
    safeWriteStorage(TEST_KEY, validData);

    const result = safeReadStorage(TEST_KEY, SampleSchema, { id: "def", count: 0 });
    expect(result).toEqual(validData);
  });

  it("recovers with fallback when json syntax is corrupted", () => {
    localStorage.setItem(TEST_KEY, "{ corrupted_invalid_json");
    const fallback = { id: "def", count: 0 };

    const result = safeReadStorage(TEST_KEY, SampleSchema, fallback);
    expect(result).toEqual(fallback);
  });

  it("recovers with fallback when schema structure fails validation", () => {
    localStorage.setItem(TEST_KEY, JSON.stringify({ id: 12345, count: "not-a-number" }));
    const fallback = { id: "def", count: 0 };

    const result = safeReadStorage(TEST_KEY, SampleSchema, fallback);
    expect(result).toEqual(fallback);
  });
});
