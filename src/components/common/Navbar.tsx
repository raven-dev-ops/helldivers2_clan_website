// src/components/common/Navbar.tsx
"use client";

import { useState, useEffect } from "react"; // Removed useRef
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import ThemeToggle from './ThemeToggle'; // Import the toggle button
import styles from "./Navbar.module.css"; // Using CSS Modules

// Type Definition for standard nav items
interface NavItem { href: string; label: string; }
// Removed GameData type and PLACEHOLDER_IMAGE_URL

const Navbar = () => {
  // State for mobile nav toggle ONLY
  const [navOpen, setNavOpen] = useState(false);
  // Removed state/ref for game carousel

  // Handlers for mobile nav ONLY
  const toggleMobileNav = () => setNavOpen((prev) => !prev);
  const closeMobileNav = () => setNavOpen(false);

  // Removed Handlers for Game Carousel
  // Removed Effect for Outside Click Detection for Game Carousel

  // Standard navigation items
  const navItems: NavItem[] = [
    { href: "/academy", label: "Academy" },
    { href: "/creators", label: "Creators" },
    { href: "/forum", label: "Forum" },
    { href: "/partners", label: "Partners" },
    { href: "/studios", label: "Studios" },
    // Add other links as needed
  ];

  // Removed Game data for Carousel

  return (
    // Removed conditional game carousel class
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMobileNav}>
          Galactic Phantom Division
        </Link>

        {/* Hamburger (Mobile) */}
        <button
          type="button"
          className={styles.hamburger}
          onClick={toggleMobileNav}
          aria-label="Toggle Navigation Menu"
          aria-expanded={navOpen}
          aria-controls="mobile-menu"
        >
          {navOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>

        {/* Desktop Controls Wrapper (Includes Menu + Theme Toggle) */}
        <div className={styles.desktopControls}>
          <div className={styles.desktopMenu}>
            {/* Standard Links */}
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.link}>
                {label}
              </Link>
            ))}
            {/* Removed Games Button */}
          </div>
          {/* Theme Toggle for Desktop */}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {navOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          <ul className={styles.mobileList}>
            {/* Standard Links */}
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.mobileLink} onClick={closeMobileNav}>
                  {item.label}
                </Link>
              </li>
            ))}
             {/* Removed Mobile Games Button */}
          </ul>
          {/* Add Theme Toggle at the bottom of the mobile menu */}
          <div className={styles.mobileToggleContainer}>
             <ThemeToggle />
          </div>
        </div>
      )}

       {/* Removed Game Carousel Overlay */}

    </nav>
  );
};

export default Navbar;