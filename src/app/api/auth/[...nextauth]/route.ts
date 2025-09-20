// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { getAuthOptions } from '@/lib/authOptions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

let handler: ReturnType<typeof NextAuth> | null = null;

function getHandler() {
  if (!handler) {
    handler = NextAuth(getAuthOptions());
  }
  return handler;
}

export const GET = (req: NextRequest) => getHandler()(req);
export const POST = (req: NextRequest) => getHandler()(req);
