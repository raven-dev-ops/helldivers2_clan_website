// src/middleware.ts (or middleware.ts at project root)

// Option 1: Using next-auth/middleware (Recommended)
// This automatically handles session verification based on your authOptions
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log("Middleware running for:", req.nextUrl.pathname);
    // console.log("Token:", req.nextauth.token); // Token available if logged in

    // Example: Redirect based on role
    // if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
    //   return NextResponse.rewrite(new URL("/denied", req.url))
    // }

    // If user is authenticated (token exists) and they try to access /auth, redirect them to home
    if (req.nextauth.token && req.nextUrl.pathname === "/auth") {
      // console.log("Redirecting authenticated user from /auth");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow the request to proceed if none of the above conditions are met
    // (withAuth already handles redirecting unauthenticated users for matched paths)
    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback determines if the user is authorized *to access the routes covered by the matcher*.
      // If it returns false, the user is redirected to the login page.
      // If it returns true, the middleware function above runs.
      authorized: ({ token }) => {
          // !!token checks if the token object exists and is not null/undefined
          // This means the user is considered logged in if a valid token exists.
          // console.log("Authorized callback token:", token);
          return !!token;
      }
    },
    // Define the login page URL. If `authorized` returns false, user is sent here.
    pages: {
      signIn: "/auth", // Your sign-in page route
      // error: "/auth/error", // Optional: page for auth errors
    },
  }
)

// --- Matcher ---
// This specifies which paths the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes for NextAuth itself)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (the login page itself, handled separately by redirect logic)
     * - images (your public images folder)
     * - *.png, *.jpg, *.jpeg, *.gif, *.svg (common image extensions)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|auth|images|.*\\.(?:png|jpg|jpeg|gif|svg)$).*)",
  ],
}


// // Option 2: Manual Token/Cookie Check (More complex, use if withAuth has issues)
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { getToken } from 'next-auth/jwt' // If using JWT

// export async function middleware(req: NextRequest) {
//   const publicPaths = ['/auth']; // Pages accessible without login
//   const pathname = req.nextUrl.pathname;

//   // Allow requests for API auth, static files, images, and public pages
//   if (
//     pathname.startsWith('/api/auth') ||
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/images') || // Assuming public images
//     pathname.includes('.') || // Allow files with extensions
//     publicPaths.includes(pathname)
//   ) {
//     return NextResponse.next();
//   }

//   // Check for session token (JWT example)
//   const secret = process.env.NEXTAUTH_SECRET;
//   const token = await getToken({ req, secret });

//   if (!token) {
//     // No token, redirect to login page, preserving the originally requested URL
//     const loginUrl = new URL('/auth', req.url);
//     loginUrl.searchParams.set('callbackUrl', req.url); // Pass intended destination
//     return NextResponse.redirect(loginUrl);
//   }

//    // If user is logged in and tries to access /auth page, redirect to home
//   if (token && pathname === '/auth') {
//       return NextResponse.redirect(new URL('/', req.url));
//   }

//   // User is authenticated and accessing a protected page, allow them
//   return NextResponse.next();
// }

// // Matcher for manual check (similar to above, maybe slightly simpler)
// export const config = {
//   matcher: [
//      '/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)', // Protect most paths
//   ],
// }