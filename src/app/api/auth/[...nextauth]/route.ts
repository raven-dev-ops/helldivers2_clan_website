// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // adjust path if needed

const handler = NextAuth(authOptions);

// In the App Router, you must export
// both GET and POST for NextAuth
export { handler as GET, handler as POST };
