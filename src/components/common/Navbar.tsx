// src/components/common/Navbar.tsx

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-[#282842] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Galactic Phantom Division
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/about"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            About
          </Link>
          <Link
            href="/academy"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            Academy
          </Link>
          <Link
            href="/creators"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            Creators
          </Link>
          <Link
            href="/forum"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            Forum
          </Link>
          <Link
            href="/games/helldivers-2"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            Helldivers 2
          </Link>
          <Link
            href="/network/clans"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            Clans
          </Link>
          <Link
            href="/network/leaderboard"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            Leaderboard
          </Link>
          <Link
            href="/partners"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            Partners
          </Link>
          <Link
            href="/profile/me"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            Profile
          </Link>
          <Link
            href="/studios"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            Studios
          </Link>
          <Link
            href="/admin"
            className="text-white hover:text-[#00bcd4] transition duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;