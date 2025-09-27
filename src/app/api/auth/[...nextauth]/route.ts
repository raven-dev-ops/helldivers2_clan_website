// src/app/api/auth/[...nextauth]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

// Create the handler once at module scope
const handler = NextAuth(getAuthOptions());

// App Router needs both verbs exported
export { handler as GET, handler as POST };
