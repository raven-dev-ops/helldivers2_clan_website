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
            { href: "/academy", label: "Academy" },
            { href: "/creators", label: "Creators" },
            { href: "/forum", label: "Forum" },
            { href: "/games", label: "Games" },
            { href: "/partners", label: "Partners" },
            { href: "/studios", label: "Studios" },
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
              "/academy",
              "/creators",
              "/forum",
              "/games",
              "/partners",
              "/studios",
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
