/**
 * Minimal in-memory sliding-window rate limiter for server routes.
 *
 * Note: state is per-process. In a horizontally-scaled deployment this should
 * be backed by a shared store (e.g. Firestore `rate_limits`), but it is enough
 * to blunt abuse on a single instance and replaces the previously unbounded
 * public endpoints.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}
