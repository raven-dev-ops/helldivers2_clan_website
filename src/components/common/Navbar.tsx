// src/components/common/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import ThemeToggle from './ThemeToggle'; // Import the toggle button
import styles from "./Navbar.module.css"; // Using CSS Modules

// Type Definitions (Keep if needed for game carousel logic)
interface NavItem { href: string; label: string; }
interface GameData { id: string; title: string; imageUrl: string; href: string; comingSoon?: boolean; }
const PLACEHOLDER_IMAGE_URL = "/images/game-placeholder.png"; // Keep if needed

const Navbar = () => {
  // State for mobile nav toggle
  const [navOpen, setNavOpen] = useState(false);
  // State/Ref for game carousel (Keep ONLY if using the carousel overlay feature)
  const [isGameCarouselVisible, setIsGameCarouselVisible] = useState(false);
  const gameCarouselRef = useRef<HTMLDivElement>(null);

  // Handlers
  const toggleMobileNav = () => setNavOpen((prev) => !prev);
  const closeMobileNav = () => setNavOpen(false);

  // Handlers for Game Carousel (Keep ONLY if using that feature)
  const toggleGameCarousel = (e?: React.MouseEvent) => {
      e?.stopPropagation(); // Prevent bubbling if called from event
      setIsGameCarouselVisible((prev) => !prev);
      if (!isGameCarouselVisible) setNavOpen(false); // Close mobile if opening games
  };
  const closeGameCarousel = () => setIsGameCarouselVisible(false);

  // Effect for Outside Click Detection for Game Carousel (Keep ONLY if using)
  useEffect(() => {
    if (!isGameCarouselVisible) return; // Only run if carousel is open

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!target) return;
      const gamesButton = document.getElementById('games-nav-button'); // Needs ID on button
      const isOutside = gameCarouselRef.current && !gameCarouselRef.current.contains(target);
      const isNotButton = !gamesButton || !gamesButton.contains(target);
      if (isOutside && isNotButton) {
        closeGameCarousel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isGameCarouselVisible]);


  // Standard navigation items
  const navItems: NavItem[] = [
    { href: "/academy", label: "Academy" },
    { href: "/creators", label: "Creators" },
    { href: "/forum", label: "Forum" },
    { href: "/partners", label: "Partners" },
    { href: "/studios", label: "Studios" },
    // Add other links as needed
  ];

  // Game data for Carousel (Keep ONLY if using carousel feature)
  const gamesData: GameData[] = [
     { id: 'helldivers2', title: "Helldivers 2", imageUrl: "/images/helldivers2-banner.jpg", href: "/helldivers-2", comingSoon: false },
     { id: 'dune', title: "Dune: Awakening", imageUrl: "/images/dune-awakening-banner.jpg", href: "/dune-awakening", comingSoon: true },
     { id: 'game3', title: "Future Game 0", imageUrl: PLACEHOLDER_IMAGE_URL, href: "/future0", comingSoon: true },
     // Add more games
  ].map(game => ({ // Ensure imageUrl processing if using placeholders
    ...game,
    imageUrl: game.comingSoon ? PLACEHOLDER_IMAGE_URL : game.imageUrl || PLACEHOLDER_IMAGE_URL,
  }));


  return (
    // Add state class if needed for complex transitions/styling
    <nav className={`${styles.nav} ${isGameCarouselVisible ? styles.gameCarouselActive : ''}`}>
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
            {/* Games Button (Keep ONLY if using carousel feature) */}
            <button
              id="games-nav-button"
              type="button"
              onClick={toggleGameCarousel}
              className={`${styles.link} ${styles.gamesButton} ${isGameCarouselVisible ? styles.gamesButtonActive : ''}`}
              aria-haspopup="dialog"
              aria-expanded={isGameCarouselVisible}
              aria-controls="game-carousel-overlay"
            >
              Games
            </button>
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
             {/* Mobile Games Button (Keep ONLY if using carousel feature) */}
             <li>
                <button
                    type="button"
                    // Close main nav AND open games carousel
                    onClick={() => { closeMobileNav(); toggleGameCarousel(); }}
                    className={`${styles.mobileLink} ${styles.mobileGamesButton}`}
                    aria-haspopup="dialog"
                    aria-expanded={isGameCarouselVisible}
                    aria-controls="game-carousel-overlay"
                >
                    Games
                </button>
            </li>
          </ul>
          {/* Add Theme Toggle at the bottom of the mobile menu */}
          <div className={styles.mobileToggleContainer}>
             <ThemeToggle />
          </div>
        </div>
      )}

       {/* Game Carousel Overlay (Keep ONLY if using carousel feature) */}
       {isGameCarouselVisible && (
          <div id="game-carousel-overlay" ref={gameCarouselRef} className={styles.gameCarouselOverlay} /* ...props */>
              {/* ... (Swiper and GameCard rendering as before) ... */}
               <h2 id="game-carousel-title" className={styles.visuallyHidden}>Select a Game</h2>
               <div className={styles.gameCarouselContent}>
                 <button type="button" onClick={closeGameCarousel} className={styles.closeCarouselButton} /* ...props */ >
                   <FaTimes aria-hidden="true" />
                 </button>
                 {/* <Swiper ...> */}
                   {/* {gamesData.map(... => <SwiperSlide><GameCard ... /></SwiperSlide>)} */}
                 {/* </Swiper> */}
               </div>
          </div>
       )}

    </nav>
  );
};

export default Navbar;