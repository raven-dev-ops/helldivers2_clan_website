# codex_task.md

**Goal:** Ship three small, high‑impact PRs that (1) add CI with secret scanning, (2) enforce security headers (incl. a starter CSP), and (3) implement a Redis‑backed API rate limiter with a safe dev fallback.

> These PRs are designed to be copy‑paste ready. Each contains a branch name, a PR title/description, and **inline patches** you can apply or paste into a PR body. Where project differences might exist, I’ve added brief notes so the changes are easy to adapt.

---

## PR 1 — CI + Secret Scanning + `.gitignore`

**Branch:** `ci/gh-actions-gitleaks`  
**Title:** `ci: add GitHub Actions (pnpm lint/test/build) + secret scanning + .gitignore`

**What & why**
- Run CI on PRs/commits: install deps, lint, test, build (Node 20 + pnpm).
- Scan for secrets with **Gitleaks** and fail the build on leaks.
- Ensure local env files won’t be committed again.

**Acceptance criteria**
- CI runs on push/PR to `main`; fails on lint/test errors or detected secrets.
- `pnpm` cache enabled; installs use lockfile.
- `.env.local` and other local env files are ignored by git.
- (Optional) `.gitleaks.toml` present to allow `.env.example` but block real `.env` files.

### Patches

#### 1) Add/extend `.gitignore`

```diff
--- a/.gitignore
+++ b/.gitignore
@@
+# Local env files (never commit)
+.env.local
+.env*.local
+.env.development*
+.env.test*
+.env.production*
+!.env.example
+
+# Logs
+*.log
+
+# OS/editor junk
+.DS_Store
+.idea
+.vscode/*
+!.vscode/extensions.json
+!.vscode/settings.json
```

> Keep the allow‑rule for `.env.example` so new contributors know which vars to set.

#### 2) GitHub Actions workflow

Create **`.github/workflows/ci.yml`**:

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint --if-present

      - name: Test
        run: pnpm test --if-present

      - name: Build
        run: pnpm build --if-present

      - name: Gitleaks (secret scan)
        uses: gitleaks/gitleaks-action@v2
        with:
          args: detect --no-banner --redact
```

> If you already have a CI workflow, merge the steps above into it.

#### 3) (Optional) Configure Gitleaks

Create **`.gitleaks.toml`** to allow `/.env.example` but continue blocking real envs:

```toml
# Allow listing example env values while keeping real env files blocked
[[allowlist.files]]
description = "Allow example env file"
regex = '''(^|/)\\.env\\.example$'''
```

---

## PR 2 — Global Security Headers + Starter CSP

**Branch:** `feat/security-headers`  
**Title:** `feat(security): add global security headers and starter CSP`

**What & why**
- Add a conservative set of security/privacy headers (CSP, XFO, Referrer, Permissions Policy).
- Helps mitigate common risks (XSS/clickjacking) and standardizes behavior across routes.

**Acceptance criteria**
- All responses include the headers below.
- No broken styling/scripts; adjust the CSP allow‑list as you see what the app loads.
- HSTS is enabled only when serving HTTPS (most hosts are HTTPS in prod).

### Patch

Modify **`next.config.ts`** to define `headers()` (merge with existing config). If `next.config.js` is used instead, translate to JS accordingly.

```diff
--- a/next.config.ts
+++ b/next.config.ts
@@
-import type { NextConfig } from 'next';
-const nextConfig: NextConfig = {
-  // ...your existing config
-};
-export default nextConfig;
+import type { NextConfig } from 'next';
+
+const securityHeaders = () => {
+  // NOTE: Adjust allow-lists as needed when you see CSP console warnings.
+  const csp = [
+    "default-src 'self'",
+    "img-src 'self' data: https:",
+    "media-src 'self' https:",
+    "font-src 'self' data: https:",
+    "connect-src 'self' https:",
+    // 'unsafe-inline' is a starter fallback; refine with nonces/hashes as you harden.
+    "script-src 'self' 'unsafe-inline' https:",
+    "style-src 'self' 'unsafe-inline' https:"
+  ].join('; ');
+
+  const headers = [
+    { key: 'X-Frame-Options', value: 'DENY' },
+    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
+    { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=()' },
+    { key: 'Content-Security-Policy', value: csp },
+  ];
+
+  // Enable HSTS for HTTPS environments. If you serve HTTP locally, it’s harmless.
+  headers.push({
+    key: 'Strict-Transport-Security',
+    value: 'max-age=31536000; includeSubDomains; preload',
+  });
+
+  return headers;
+};
+
+const nextConfig: NextConfig = {
+  async headers() {
+    return [
+      {
+        source: '/:path*',
+        headers: securityHeaders(),
+      },
+    ];
+  },
+  // ...keep your existing config keys here
+};
+
+export default nextConfig;
```

**Post‑merge checks**
- Open the app and check the browser console for CSP violations. If something is blocked, add the host to `img-src`, `script-src`, etc.
- Consider replacing `'unsafe-inline'` by adding script/style nonces or hashes as a follow‑up.

---

## PR 3 — API Rate Limiting (Redis + Dev Fallback)

**Branch:** `feat/api-rate-limit`  
**Title:** `feat(api): add Redis-backed rate limiter with safe dev fallback + example route`

**What & why**
- Protects all API endpoints with a fixed‑window limiter keyed by IP + bucket name.
- Uses Redis in production (via `REDIS_URL`) and a memory store fallback in dev/tests.
- Exposes a small wrapper so you can add a limiter to any route in 2 lines.

**Acceptance criteria**
- When `REDIS_URL` is set, API routes enforce `{ windowMs, max }` and return **429** with `Retry-After` on overflow.
- When Redis is unavailable and in development, the memory fallback works (non‑persistent).
- Example endpoint `GET /api/health` included and rate‑limited.
- No client bundles import the limiter (server-only).

### New files

#### 1) `src/lib/rateLimit.ts`

```ts
// src/lib/rateLimit.ts
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

async function getStore(): Promise<Store> {
  const url = process.env.REDIS_URL;
  if (!url) return new MemoryStore();
  try {
    // Lazy import so dev/test doesn’t require ioredis
    const { default: IORedis } = await import('ioredis');
    const client = new IORedis(url);
    return new RedisStore(client);
  } catch {
    // If ioredis isn't installed, fall back to memory (dev-safe).
    return new MemoryStore();
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
```

#### 2) Example route: `src/app/api/health/route.ts`

```ts
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { rateLimitOrResponse } from '@/lib/rateLimit';

export async function GET(req: Request) {
  const limited = await rateLimitOrResponse(req, { bucket: 'health:get', windowMs: 60_000, max: 30 });
  if (limited) return limited;
  return NextResponse.json({ ok: true, ts: Date.now() });
}
```

> Apply the same pattern to your other `app/api/**/route.ts` handlers, varying the `bucket` per endpoint/method.

#### 3) Optional unit test (memory fallback)

Create **`src/lib/__tests__/rateLimit.test.ts`** (Vitest). Adjust path if your tests live elsewhere.

```ts
import { describe, it, expect } from 'vitest';
import { allow } from '@/lib/rateLimit';

describe('allow (memory fallback)', () => {
  it('limits after max requests in the window', async () => {
    const windowMs = 100;
    const max = 3;
    const ip = '127.0.0.1';
    const bucket = 'test';

    const results: boolean[] = [];
    for (let i = 0; i < 5; i++) {
      const { ok } = await allow({ ip, bucket, windowMs, max });
      results.push(ok);
    }
    expect(results).toEqual([true, true, true, false, false]);
  });
});
```

### Env & deps

- Ensure these env vars exist (in `.env.example` and your hosting env UI):
  ```env
  # Rate limiting
  RATE_LIMIT_WINDOW_MS=60000
  RATE_LIMIT_MAX=20
  # Redis (production)
  REDIS_URL=redis://:password@host:6379/0
  ```
- For production Redis support, add the dependency in this PR (skip if already present):
  ```bash
  pnpm add ioredis
  ```

**Post‑merge checks**
- `curl` the health endpoint repeatedly and verify a **429** after the limit is exceeded.
  ```bash
  for i in {1..40}; do curl -s -o /dev/null -w "%{http_code}\n" https://your-host/api/health; done
  ```
- In dev, kill/restart the server and confirm the limiter state resets (memory fallback).

---

## Suggested merge order

1. **PR 1 (CI + Gitleaks + .gitignore)** — enables safe review gates.  
2. **PR 2 (Security headers + CSP)** — platform-wide protection.  
3. **PR 3 (Rate limiting)** — shields APIs with minimal friction.

---

## Follow‑ups (optional, not in scope of these PRs)

- Replace CSP `'unsafe-inline'` with nonces/hashes; tune per external providers.  
- Add Playwright smoke tests and wire them into CI.  
- Add preview deployments (Vercel/Netlify/Heroku Review Apps).  
- Rotate any secrets that were ever committed (Discord, MongoDB, NextAuth, Redis) and purge `.env.local` from history with `git filter-repo`.
