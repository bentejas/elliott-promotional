type RateLimitKey = string;

interface WindowConfig {
  windowMs: number;
  max: number;
}

interface HitRecord {
  timestamps: number[];
}

const store = new Map<RateLimitKey, HitRecord>();

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  const xrip = request.headers.get("x-real-ip");
  if (xrip) return xrip;
  // Fallback to remote address is not accessible in standard runtime
  return "unknown";
}

export function rateLimit(
  key: RateLimitKey,
  { windowMs, max }: WindowConfig
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  const record = store.get(key) || { timestamps: [] };
  // prune old
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
  if (record.timestamps.length >= max) {
    const resetMs = windowMs - (now - record.timestamps[0]);
    store.set(key, record);
    return { allowed: false, remaining: 0, resetMs };
  }
  record.timestamps.push(now);
  store.set(key, record);
  return {
    allowed: true,
    remaining: Math.max(0, max - record.timestamps.length),
    resetMs: windowMs,
  };
}

export function buildRateKey(parts: Array<string | undefined | null>): string {
  return parts.filter(Boolean).join(":");
}

export function isLikelyBadOrigin(
  request: Request,
  allowedHosts?: string[]
): boolean {
  const origin = request.headers.get("origin") || "";
  const referer = request.headers.get("referer") || "";
  const url = new URL(request.url);
  const host = url.host.toLowerCase();
  const allowed =
    allowedHosts && allowedHosts.length > 0
      ? allowedHosts.map((h) => h.toLowerCase())
      : [host];
  const check = (value: string) =>
    allowed.some((h) => value.toLowerCase().includes(h));
  // If origin or referer present but not matching our host, treat as bad
  if (origin && !check(origin)) return true;
  if (referer && !check(referer)) return true;
  return false;
}
