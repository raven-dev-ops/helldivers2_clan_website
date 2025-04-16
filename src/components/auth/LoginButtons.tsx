"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    return (
      <button
        onClick={() => signOut()}
        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition duration-200"
      >
        Sign Out
      </button>
    );
  }

  return (
    <div className="flex gap-2">
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
    </div>
  );
}
