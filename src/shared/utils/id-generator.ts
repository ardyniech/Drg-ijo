/**
 * Secure ID Generator Utility (SOP v4.0)
 * Menghasilkan ID unik aman berbasis crypto.randomUUID() tanpa Math.random.
 */

export function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback Web Crypto API jika randomUUID belum tersedia di runtime lama
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return `${Date.now()}-${Math.floor(performance.now() * 1000)}`;
}

export function generatePrefixedId(prefix: string): string {
  const uuid = generateUUID();
  const shortId = uuid.split("-")[0] + uuid.split("-")[1];
  return `${prefix}_${shortId}`;
}
