import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Protect only what truly needs auth; everything else passes through.
const protectedMatchers = [/^\/profile/, /^\/settings/];

export default withAuth(
  (req) => {
    // You can add lightweight logic here if needed; avoid server imports.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Only require a token on protected paths; public pages always pass.
        if (protectedMatchers.some((re) => re.test(path))) return !!token;
        return true;
      },
    },
  }
);

// Exclude static assets and API from running through NextAuth middleware.
// Keep this list lean to reduce overhead.
export const config = {
  matcher: [
    // Everything except:
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|videos|images|audio).*)',
  ],
};
