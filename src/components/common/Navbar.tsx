// src/components/common/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => setNavOpen((prev) => !prev);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Galactic Phantom Division
        </Link>

        <button
          type="button"
          className={styles.hamburger}
          onClick={toggleNav}
          aria-label="Toggle Navigation"
        >
          {navOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={styles.desktopMenu}>
          {[
            { href: "/about", label: "About" },
            { href: "/academy", label: "Academy" },
            { href: "/creators", label: "Creators" },
            { href: "/forum", label: "Forum" },
            { href: "/games/helldivers-2", label: "Helldivers 2" },
            { href: "/network/clans", label: "Clans" },
            { href: "/network/leaderboard", label: "Leaderboard" },
            { href: "/partners", label: "Partners" },
            { href: "/profile/me", label: "Profile" },
            { href: "/studios", label: "Studios" },
            { href: "/admin", label: "Admin" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className={styles.link}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {navOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileList}>
            {[
              "/about",
              "/academy",
              "/creators",
              "/forum",
              "/games/helldivers-2",
              "/network/clans",
              "/network/leaderboard",
              "/partners",
              "/profile/me",
              "/studios",
              "/admin",
            ].map((path) => (
              <li key={path}>
                <Link href={path} className={styles.mobileLink} onClick={toggleNav}>
                  {path.replace(/^\//, "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
