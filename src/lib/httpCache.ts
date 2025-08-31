// src/lib/httpCache.ts
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

function computeWeakETag(data: unknown): string {
  // Weak ETag over a stable string; OK for semantic equality checks
  const json = JSON.stringify(data);
  const hash = createHash('sha256').update(json).digest('base64url');
  return `W/"${hash}"`;
}

export function jsonWithETag(
  req: NextRequest,
  data: unknown,
  init?: ResponseInit
) {
  const etag = computeWeakETag(data);
  const ifNoneMatch = req.headers.get('if-none-match');

  const headers = new Headers(init?.headers);
  headers.set('ETag', etag);
  // Help proxies/CDNs choose the correct variant
  const existingVary = headers.get('Vary');
  headers.set(
    'Vary',
    existingVary ? `${existingVary}, Accept-Encoding` : 'Accept-Encoding'
  );

  if (ifNoneMatch && ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers,
    });
  }

  return NextResponse.json(data, { ...init, headers });
}

