import 'server-only';
import { NextResponse } from 'next/server';

/**
 * Minimal store interface to support both Redis and a dev memory fallback.
 */
interface Store {
  incr(key: string, ttlMs: number): Promise<number>;
}

class MemoryStore implements Store {
  private map = new Map<string, { count: number; exp: number }>();
  async incr(key: string, ttlMs: number): Promise<number> {
    const now = Date.now();
    const cur = this.map.get(key);
    if (!cur || cur.exp <= now) {
      const next = { count: 1, exp: now + ttlMs };
      this.map.set(key, next);
      return 1;
    }
    cur.count += 1;
    return cur.count;
  }
}

class RedisStore implements Store {
  private client: any;
  constructor(client: any) { this.client = client; }
  async incr(key: string, ttlMs: number): Promise<number> {
    // Increment then set TTL only if first use in the window
    const count: number = await this.client.incr(key);
    if (count === 1) {
      await this.client.pexpire(key, ttlMs);
    }
    return count;
  }
}
let _store: Store | null = null;

async function getStore(): Promise<Store> {
  if (_store) return _store;
  const url = process.env.REDIS_URL;
  if (!url) {
    _store = new MemoryStore();
    return _store;
  }
  try {
    // Lazy import so dev/test doesn’t require ioredis
    const { default: IORedis } = await import('ioredis');
    const client = new IORedis(url);
    _store = new RedisStore(client);
    return _store;
  } catch {
    // If ioredis isn't installed, fall back to memory (dev-safe).
    _store = new MemoryStore();
    return _store;
  }
}

/**
 * Compute a stable client IP string from common proxy headers.
 */
export function getClientIp(req: Request): string {
  const h = new Headers(req.headers);
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return h.get('x-real-ip') ?? '0.0.0.0';
}

export type LimitResult = {
  ok: boolean;
  count: number;
  remaining: number;
  resetMs: number;
};

/**
 * Fixed-window limit. Key shape: rl:{bucket}:{ip}:{windowIndex}
 */
export async function allow(opts: {
  ip: string;
  bucket: string;
  windowMs: number;
  max: number;
}): Promise<LimitResult> {
  const { ip, bucket, windowMs, max } = opts;
  const store = await getStore();
  const now = Date.now();
  const windowIndex = Math.floor(now / windowMs);
  const key = `rl:${bucket}:${ip}:${windowIndex}`;

  const count = await store.incr(key, windowMs);
  const ok = count <= max;
  const remaining = Math.max(0, max - count);
  const resetMs = ((windowIndex + 1) * windowMs) - now;
  return { ok, count, remaining, resetMs };
}

/**
 * Helper for Next.js App Router route handlers.
 * Returns a NextResponse 429 if limited, or null if allowed.
 */
export async function rateLimitOrResponse(req: Request, opts: {
  bucket: string;
  windowMs?: number;
  max?: number;
}) {
  const ip = getClientIp(req);
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? opts.windowMs ?? 60_000);
  const max = Number(process.env.RATE_LIMIT_MAX ?? opts.max ?? 20);

  const res = await allow({ ip, bucket: opts.bucket, windowMs, max });
  if (res.ok) return null;

  const r = new NextResponse('Too Many Requests', { status: 429 });
  // Advise clients when to retry
  r.headers.set('Retry-After', String(Math.ceil(res.resetMs / 1000)));
  r.headers.set('X-RateLimit-Limit', String(max));
  r.headers.set('X-RateLimit-Remaining', String(res.remaining));
  return r;
}
