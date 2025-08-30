// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Treat obvious asset paths as non-HTML
  const isAsset =
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/videos/') ||
    pathname.startsWith('/audio/') ||
    /\.(?:js|css|map|json|ico|png|jpg|jpeg|gif|svg|webp|avif|mp4|mp3|woff2?)$/i.test(pathname);

  const accept = req.headers.get('accept') ?? '';
  const wantsHtml = accept.includes('text/html');

  const res = NextResponse.next();

  // Add CSP for page routes:
  // - GET with Accept: text/html
  // - HEAD (often has no Accept header)
  if (!isAsset && (wantsHtml || req.method === 'HEAD' || accept === '')) {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' https: wss:",
      "media-src 'self' https:",
      'upgrade-insecure-requests',
    ].join('; ');
    res.headers.set('Content-Security-Policy', csp);
  }

  return res;
}
