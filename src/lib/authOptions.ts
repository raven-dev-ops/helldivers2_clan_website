// src/lib/authOptions.ts
import { NextAuthOptions, Session, User as AdapterUser } from "next-auth"; // Use AdapterUser alias
import { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/dbClientPromise"; // Ensure this path is correct

// --- Environment Variable Validation ---
// Runtime checks to ensure essential variables are set.
// Consider using a validation library like Zod for more complex env validation at build time.
const requiredEnvVars = [
    'DISCORD_CLIENT_ID',
    'DISCORD_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET', // Secret is critical for JWT signing/encryption
    'MONGODB_URI', // Needed by the adapter/clientPromise
    // 'NEXTAUTH_URL', // Recommended for production
];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        // Throw error in production, warn in development for NEXTAUTH_SECRET
        if (varName === 'NEXTAUTH_SECRET' && process.env.NODE_ENV !== 'production') {
            console.warn(
                `\x1b[33m%s\x1b[0m`,
                `⚠️ WARNING: Environment variable ${varName} is not set. Using insecure temporary value for development.`
            );
        } else if (varName === 'NEXTAUTH_URL' && process.env.NODE_ENV !== 'production') {
             console.warn(
                `\x1b[33m%s\x1b[0m`,
                `⚠️ WARNING: Environment variable ${varName} is not set. Recommended for production.`
             );
        }
        else {
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    }
});


// --- Define Auth Options ---
export const authOptions: NextAuthOptions = {
  // --- Database Adapter ---
  // Connects NextAuth to MongoDB using the official adapter.
  // Handles user creation, account linking, session storage (if using database strategy).
  adapter: MongoDBAdapter(clientPromise, {
      // Optional: Specify database name if not parsed from MONGODB_URI
      // databaseName: process.env.MONGODB_DB_NAME
  }),

  // --- Authentication Providers ---
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!, // ! asserts var exists due to check above
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      // Optional: Request specific Discord scopes
      // authorization: { params: { scope: 'identify email guilds role_connections.write' } },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Optional: Define required Google scopes
      // authorization: {
      //   params: {
      //     prompt: "consent", // Force consent screen
      //     access_type: "offline", // Get refresh token
      //     response_type: "code",
      //     scope: "openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
      //   }
      // },
    }),
    // Add other providers as needed
  ],

  // --- Session Strategy ---
  session: {
    // Use JSON Web Tokens (JWT) stored in a cookie.
    // Preferred strategy when using custom callbacks to modify session/token data.
    strategy: "jwt",
    // Optional: Session duration settings (in seconds)
    // maxAge: 30 * 24 * 60 * 60, // 30 days (default)
    // updateAge: 24 * 60 * 60, // 1 day (default)
  },

  // --- Callbacks ---
  // These allow customizing the JWT and Session objects.
  callbacks: {
    // 1. jwt callback: Modifies the token before it's saved.
    async jwt({ token, user, account, profile }) {
      // 'user' is available only during the initial sign-in flow when using an adapter.
      // It contains the user document from your database.
      if (user) {
        // Add the database _id (as string) to the token.
        token.id = user.id; // user.id from adapter IS the MongoDB _id
        // Add other frequently accessed, non-sensitive data to the token.
        // Example: Fetch role from DB if adapter user type doesn't include it
        // const dbUser = await UserModel.findById(user.id).select('role').lean();
        // token.role = dbUser?.role || 'user';
      }
      return token;
    },

    // 2. session callback: Modifies the session object before it's returned to the client.
    async session({ session, token }) {
      // 'token' contains the data from the jwt callback (including token.id).
      // Add the id (and other properties like role) from the token to the session.user object.
      if (token?.id && session.user) {
        session.user.id = token.id as string; // This is the MongoDB ID
      }
      // Example: Add role to session from token
      // if (token?.role && session.user) {
      //   session.user.role = token.role as string;
      // }

      // Ensure session object is always returned
      return session;
    },
  },

  // --- Other Core Options ---
  // Secret used for signing/encrypting JWTs and cookies.
  // MUST be set in production and match across all instances.
  secret: process.env.NEXTAUTH_SECRET,

  // Custom pages
  pages: {
    signIn: '/auth', // Path to your custom sign-in page
    // error: '/auth/error', // Path for auth errors (e.g., OAuth failures)
    // signOut: '/auth/signout', // Custom signout page (optional)
    // verifyRequest: '/auth/verify-request', // For email provider (optional)
  },

  // Enable debug logs in development for easier troubleshooting
  debug: process.env.NODE_ENV === 'development',

  // Optional: Configure events for logging or other actions
  // events: {
  //   async signIn(message) { console.log("Sign In:", message) },
  //   async signOut(message) { console.log("Sign Out:", message) },
  //   async session(message) { console.log("Session Accessed:", message) },
  //   async error(message) { console.error("Auth Error:", message) },
  // }
};

// Note: No default export needed if only exporting `authOptions`.
// If this file IS your [...nextauth]/route.ts, you need the handler export:
// import NextAuth from "next-auth";
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };