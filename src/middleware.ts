import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Redis from 'ioredis';

const RATE_LIMIT_WINDOW = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS ?? '60000',
  10
); // default 1 minute
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX ?? '10', 10);

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');

const authMiddleware = withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth',
    },
  }
);

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api')) {
    if (req.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const scope = req.nextUrl.searchParams.get('scope') || '';
    const key = `${ip}:${req.nextUrl.pathname}:${scope}`;

    const isLeaderboard = req.nextUrl.pathname.startsWith(
      '/api/helldivers/leaderboard'
    );
    const windowMs = isLeaderboard ? 10_000 : RATE_LIMIT_WINDOW;
    const limit = isLeaderboard ? 8 : RATE_LIMIT_MAX;

    try {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.pexpire(key, windowMs);
      }
      if (count > limit) {
        console.warn(`Rate limit exceeded for ${ip} on ${req.nextUrl.pathname}`);
        const ttl = await redis.pttl(key);
        const retryAfter = Math.ceil(ttl / 1000);
        return NextResponse.json(
          { message: 'Too many requests' },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        );
      }
    } catch (err) {
      console.error('Rate limiter error', err);
    }
    return NextResponse.next();
  }
  return (authMiddleware as any)(req);
}

export const __rateLimitStore = redis; // for testing

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!api/auth|_next/static|_next/image|auth|images|videos|audio|favicon.ico).*)',
  ],
};
