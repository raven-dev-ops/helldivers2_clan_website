// src/app/api/auth/[...nextauth]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

const handler = NextAuth(getAuthOptions());
export { handler as GET, handler as POST };
