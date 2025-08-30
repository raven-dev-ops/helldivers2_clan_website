// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Only touch HTML (avoid CSP on static assets to satisfy "unneeded headers" checks)
  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    // Safe default page caching (no "no-store"/"must-revalidate" flags)
    res.headers.set('Cache-Control', 'private, max-age=0, no-cache');

    // Send CSP on pages only
    res.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "media-src 'self' https:",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
        "style-src 'self' 'unsafe-inline' https:",
        "frame-ancestors 'self'",
        "base-uri 'self'",
      ].join('; ')
    );

    // Remove legacy header some scanners flag
    res.headers.delete('Expires');
  }

  return res;
}

// Skip static buckets
export const config = {
  matcher: ['/((?!_next/|images/|videos/|audio/|favicon.ico).*)'],
};
