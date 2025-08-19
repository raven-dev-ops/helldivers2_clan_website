import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS ?? '60000',
  10
); // default 1 minute
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX ?? '10', 10);
const requests = new Map<string, { count: number; start: number }>();

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

    const now = Date.now();
    const entry = requests.get(key) || { count: 0, start: now };
    if (now - entry.start > windowMs) {
      entry.count = 0;
      entry.start = now;
    }
    entry.count++;
    requests.set(key, entry);
    if (entry.count > limit) {
      console.warn(`Rate limit exceeded for ${ip} on ${req.nextUrl.pathname}`);
      const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000);
      return NextResponse.json(
        { message: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }
    return NextResponse.next();
  }
  return (authMiddleware as any)(req);
}

export const __rateLimitStore = requests; // for testing

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!api/auth|_next/static|_next/image|auth|images|videos|audio|favicon.ico).*)',
  ],
};
