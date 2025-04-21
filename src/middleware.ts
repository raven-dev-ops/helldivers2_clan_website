// src/middleware.ts (Corrected Matcher Format)

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // Middleware logic (runs only AFTER authorized check passes for matched routes)
  function middleware(req) {
    // console.log("Middleware logic running for:", req.nextUrl.pathname);
    // console.log("Token:", req.nextauth.token);

    // If user is authenticated and tries to access /auth, redirect them to home
    // This check is fine here, as /auth won't be matched by the config below,
    // but this handles the case where they navigate *after* logging in.
    // However, it's often better handled client-side in the /auth page itself.
    // Let's simplify: withAuth handles the core auth redirects.
    // We might only need custom logic here for role-based access etc.
    // if (req.nextauth.token && req.nextUrl.pathname === "/auth") {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }

    return NextResponse.next(); // Allow authorized access to matched routes
  },
  {
    callbacks: {
      // Determines if user token is valid. If not, redirect to signIn page.
      authorized: ({ token }) => !!token,
    },
    // Define the login page URL. Redirects here if authorized() is false.
    pages: {
      signIn: "/auth",
      // error: "/auth/error", // Optional
    },
  }
);

// --- CORRECTED MATCHER CONFIG ---
// Define the paths that SHOULD be protected by authentication.
// Exclude paths for static assets, API routes, and the auth page itself.
export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT for the ones starting with:
     * - /api/ (API routes)
     * - /api/auth/ (specifically NextAuth routes)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /auth (the login page)
     * - /images/ (your public images folder)
     * - /videos/ (your public videos folder)
     * - /audio/ (your public audio folder)
     * - /favicon.ico (favicon file)
     * - /placeholder.png (specific public files)
     * Also exclude files by common extensions if needed, although matching folders is usually enough.
     * The negative lookahead ensures these paths are SKIPPED by the middleware.
     */
    "/((?!api/auth|api/|_next/static|_next/image|auth|images|videos|audio|favicon.ico|placeholder.png).*)",

    /*
     * Optionally, include specific root-level pages if the above doesn't catch them
     * and you want them protected (though the above pattern usually covers /):
     */
    // "/" // Protect the homepage explicitly if needed
  ],
};