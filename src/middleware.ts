// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function isWordPressProbe(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  return (
    lower.includes('/wp-admin') ||
    lower.includes('/wp-login.php') ||
    lower.includes('/wp-content') ||
    lower.includes('/wp-includes') ||
    lower.endsWith('/wlwmanifest.xml') ||
    lower.includes('wlwmanifest.xml') ||
    lower.endsWith('/xmlrpc.php') ||
    lower.includes('/xmlrpc.php') ||
    lower.includes('/wp-json') ||
    lower.includes('/wp-config.php') ||
    lower.includes('/wp-sitemap.xml') ||
    lower.includes('/wp-cron.php')
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Correlate with platform/router logs via X-Request-ID
  const incomingId = req.headers.get('x-request-id');
  const requestId = incomingId || generateRequestId();

  // Block obvious WordPress/CMS scanner probes with a fast 404
  if (isWordPressProbe(pathname)) {
    const notFound = new NextResponse('Not Found', { status: 404 });
    notFound.headers.set('X-Request-ID', requestId);
    return notFound;
  }

  // Enforce HTTPS in production for idempotent requests (avoid redirecting POST/PUT, etc.)
  const method = req.method.toUpperCase();
  const isIdempotent = method === 'GET' || method === 'HEAD';
  const xfProto = req.headers.get('x-forwarded-proto');
  const host = req.headers.get('host') || req.nextUrl.host;
  const isLocalhost = host?.startsWith('localhost') || host === '127.0.0.1';
  if (
    process.env.NODE_ENV === 'production' &&
    isIdempotent &&
    !isLocalhost &&
    xfProto && xfProto !== 'https'
  ) {
    const url = req.nextUrl.clone();
    url.protocol = 'https';
    const redirect = NextResponse.redirect(url, 308);
    redirect.headers.set('X-Request-ID', requestId);
    return redirect;
  }

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
  
  // Propagate/assign X-Request-ID for correlation with platform/router logs
  res.headers.set('X-Request-ID', requestId);

  if (!isAsset && (wantsHtml || req.method === 'HEAD' || accept === '')) {
    // ✅ Allow Google Identity Services (GIS), Twitch, and YouTube
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",

      // Allow embeds from Twitch, YouTube, and Google
      "frame-src 'self' https://accounts.google.com https://player.twitch.tv https://www.youtube.com",
      // (Safari fallback)
      "child-src 'self' https://accounts.google.com",

      // Allow scripts from Google
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",

      // Your existing allowances
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob: https://static-cdn.jtvnw.net", // Added Twitch's CDN
      "font-src 'self' data: https:",
      "connect-src 'self' https: wss:",

      'upgrade-insecure-requests'
    ].join('; ');
    res.headers.set('Content-Security-Policy', csp);
  }

  return res;
}

function generateRequestId(): string {
  try {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    return Array.from(buf)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }
}
