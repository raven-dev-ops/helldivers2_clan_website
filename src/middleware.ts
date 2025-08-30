// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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

  if (!isAsset && (wantsHtml || req.method === 'HEAD' || accept === '')) {
    // ✅ Allow Google Identity Services (GIS)
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",

      // GIS iframes
      "frame-src 'self' https://accounts.google.com",
      // (Safari fallback)
      "child-src 'self' https://accounts.google.com",

      // Allow the GIS script
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
      // Some scanners specifically check -elem; mirror the allowlist here too
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",

      // Your existing allowances
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: wss:",

      'upgrade-insecure-requests'
    ].join('; ');
    res.headers.set('Content-Security-Policy', csp);
  }

  return res;
}
