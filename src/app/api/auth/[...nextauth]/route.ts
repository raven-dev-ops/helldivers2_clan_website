import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";
export const runtime = "nodejs";

const handler = NextAuth(getAuthOptions());

export { handler as GET, handler as POST };
