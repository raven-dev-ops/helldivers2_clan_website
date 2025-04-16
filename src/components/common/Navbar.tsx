"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/network/leaderboard", label: "Leaderboard" },
    { href: "/creators", label: "Creators" },
    { href: "/partners", label: "Partners" },
    { href: "/academy", label: "Academy" },
    { href: "/forum", label: "Forum" },
    { href: "/studios", label: "GPT Studios" },
    { href: "/about", label: "About" },
  ];

  // Example admin check
  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="bg-[#162447] text-[#e0e0e0] p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-2">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link href="/">Galactic Phantom Division</Link>
        </div>

        {/* Nav Links */}
        <ul className="hidden md:flex items-center space-x-6 order-2 md:order-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-[#00bcd4] transition duration-200">
                {link.label}
              </Link>
            </li>
          ))}
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className="text-yellow-400 hover:text-yellow-300 transition duration-200"
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Auth Buttons & Profile */}
        <div className="flex items-center space-x-3 order-1 md:order-none">
          {status === "loading" && <span className="text-sm text-gray-400">Loading...</span>}

          {status === "unauthenticated" && (
            <>
              <button
                onClick={() => signIn("discord")}
                className="bg-[#7289da] hover:bg-[#5f73bc] text-white py-1 px-3 rounded text-sm transition duration-200"
              >
                Discord
              </button>
              <button
                onClick={() => signIn("google")}
                className="bg-white hover:bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm transition duration-200"
              >
                Google
              </button>
            </>
          )}

          {status === "authenticated" && (
            <>
              <Link
                href="/profile/me"
                className="hover:text-[#00bcd4] transition duration-200 text-sm font-medium mr-2"
              >
                {session?.user?.name || session?.user?.email || "Profile"}
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition duration-200"
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Mobile Burger (placeholder) */}
        <div className="md:hidden order-3">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
