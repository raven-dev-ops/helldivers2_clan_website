// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import type { NextApiRequest, NextApiResponse } from 'next';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * NextAuth API route handlers.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, getAuthOptions());
};

export { handler as GET, handler as POST };
