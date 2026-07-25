type RateLimitKey = string;

interface WindowConfig {
  windowMs: number;
  max: number;
}

interface HitRecord {
  timestamps: number[];
}

const store = new Map<RateLimitKey, HitRecord>();

// Periodically drop keys whose window has fully expired so the map doesn't
// grow unbounded over the process lifetime.
const SWEEP_INTERVAL_MS = 10 * 60_000;
const MAX_WINDOW_MS = 60 * 60_000;
let lastSweep = Date.now();

function sweepExpired(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, record] of store) {
    if (record.timestamps.every((ts) => ts <= now - MAX_WINDOW_MS)) {
      store.delete(key);
    }
  }
}

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
  sweepExpired(now);
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
  // Compare the parsed host exactly — substring matching let
  // "https://ourhost.evil.com" (and query-string tricks) through.
  const check = (value: string) => {
    try {
      return allowed.includes(new URL(value).host.toLowerCase());
    } catch {
      return false; // unparseable origin/referer → treat as bad
    }
  };
  // If origin or referer present but not matching our host, treat as bad
  if (origin && !check(origin)) return true;
  if (referer && !check(referer)) return true;
  return false;
}
