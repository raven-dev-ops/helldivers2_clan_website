// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    res.headers.set('Cache-Control', 'private, max-age=0, no-cache');

    res.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "font-src 'self' data: https:",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
        "style-src 'self' 'unsafe-inline' https:",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "object-src 'none'",
      ].join('; ')
    );

    res.headers.delete('Expires');
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/|images/|videos/|audio/|favicon.ico).*)'],
};
