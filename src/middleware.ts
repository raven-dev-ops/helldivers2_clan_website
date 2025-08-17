import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth',
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|api/|_next/static|_next/image|auth|images|videos|audio|favicon.ico).*)',
  ],
};
