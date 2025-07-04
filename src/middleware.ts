// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    // Optional: Add custom logic (e.g., role-based redirects)
    // const token = req.nextauth.token;
    // const pathname = req.nextUrl.pathname;

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only allow access if a valid session token exists
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth", // Redirect here if unauthorized
    },
  }
);
