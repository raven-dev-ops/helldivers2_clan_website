// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { getAuthOptions } from '@/lib/authOptions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const handler = NextAuth(getAuthOptions());
  return handler(req);
}

export async function POST(req: NextRequest) {
  const handler = NextAuth(getAuthOptions());
  return handler(req);
}
