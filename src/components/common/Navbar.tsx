// src/components/common/Navbar.tsx

"use client"; // necessary if using React state or event handlers in Next.js App Router

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  // Local state to track whether the mobile menu is open
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen((prev) => !prev);
  };

  return (
    <nav className="bg-[#282842] p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo / Title */}
        <Link href="/" className="text-white font-bold text-xl">
          Galactic Phantom Division
        </Link>

        {/* Hamburger Icon (Mobile Only) */}
        <button
          type="button"
          className="text-white text-2xl md:hidden focus:outline-none"
          onClick={toggleNav}
          aria-label="Toggle Navigation"
        >
          {navOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-4">
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

      {/* Mobile Nav (Sliding Menu) */}
      {navOpen && (
        <div className="md:hidden mt-4 bg-[#1a1a2e] shadow-lg rounded-md">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link
                href="/about"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/academy"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                Academy
              </Link>
            </li>
            <li>
              <Link
                href="/creators"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                Creators
              </Link>
            </li>
            <li>
              <Link
                href="/forum"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                Forum
              </Link>
            </li>
            <li>
              <Link
                href="/games/helldivers-2"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                Helldivers 2
              </Link>
            </li>
            <li>
              <Link
                href="/network/clans"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                Clans
              </Link>
            </li>
            <li>
              <Link
                href="/network/leaderboard"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                Leaderboard
              </Link>
            </li>
            <li>
              <Link
                href="/partners"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                Partners
              </Link>
            </li>
            <li>
              <Link
                href="/profile/me"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/studios"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                Studios
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="block text-white hover:text-[#00bcd4] transition duration-300"
                onClick={toggleNav}
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
