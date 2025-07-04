// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

/**
 * NextAuth API route handlers.
 */
const handler = NextAuth(getAuthOptions());

export { handler as GET, handler as POST };
