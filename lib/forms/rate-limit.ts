/**
 * Server side rate limit for forms (Section 7.5), instead of a third party captcha. In memory and per
 * server instance; keys are salted hashes, so no IP address is stored. A shared store (for example
 * Redis) can replace the Map when the site runs on several instances.
 */
import { createHash } from "node:crypto";

type Bucket = { count: number; resetAt: number };

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();
  return function check(key: string, now = Date.now()): boolean {
    // Drop expired buckets now and then, so memory stays small.
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    if (bucket.count >= limit) return false;
    bucket.count += 1;
    return true;
  };
}

/** Salted, one way key from the client address and the form. */
export function rateKey(ip: string, form: string, salt = process.env.FORM_TOKEN_SECRET ?? "formulare") {
  return createHash("sha256").update(`${salt}:${form}:${ip}`).digest("base64url");
}
