"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
// Using the complex GameCard but wrapping it in Link for navbar context
import GameCard from "./GameCard";
import styles from "./Navbar.module.css";

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Type Definitions
interface NavItem { href: string; label: string; }
interface GameData { id: string; title: string; imageUrl: string; actualImageUrl?: string; href: string; comingSoon?: boolean; }

// Constants
const PLACEHOLDER_IMAGE_URL = "/images/game-placeholder.png"; // Ensure this image exists in /public/images

const Navbar = () => {
  // State
  const [navOpen, setNavOpen] = useState(false);
  const [isGameCarouselVisible, setIsGameCarouselVisible] = useState(false);

  // Refs
  const gameCarouselRef = useRef<HTMLDivElement>(null);

  // Event Handlers
  const toggleNav = () => {
    const newState = !navOpen;
    setNavOpen(newState);
    if (newState) setIsGameCarouselVisible(false);
  };

  const toggleGameCarousel = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isGameCarouselVisible;
    setIsGameCarouselVisible(newState);
    if (newState) setNavOpen(false);
  };

  const closeMobileNav = () => setNavOpen(false);
  const closeGameCarousel = () => setIsGameCarouselVisible(false);

  // Effect for Outside Click Detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!target) return;
      const gamesButton = document.getElementById('games-nav-button');
      const isOutsideCarousel = gameCarouselRef.current && !gameCarouselRef.current.contains(target);
      const isNotGamesButton = !gamesButton || !gamesButton.contains(target);
      if (isOutsideCarousel && isNotGamesButton) {
        closeGameCarousel();
      }
    };
    if (isGameCarouselVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isGameCarouselVisible]);

  // Navigation and Game Data
  const navItems: NavItem[] = [
    { href: "/academy", label: "Academy" },
    { href: "/creators", label: "Creators" },
    { href: "/forum", label: "Forum" },
    { href: "/partners", label: "Partners" },
    { href: "/studios", label: "Studios" },
  ];

  const baseGamesData = [
     { id: 'helldivers2', title: "Helldivers 2", actualImageUrl: "/images/helldivers2-banner.jpg", href: "/helldivers-2", comingSoon: false },
     { id: 'dune', title: "Dune: Awakening", actualImageUrl: "/images/dune-awakening-banner.jpg", href: "/dune-awakening", comingSoon: true },
     { id: 'game3', title: "Future Game 0", actualImageUrl: "/images/placeholder-banner.jpg", href: "/future0", comingSoon: true }, // Marked as coming soon
     { id: 'game4', title: "Future Game 1", actualImageUrl: "/images/placeholder-banner.jpg", href: "/future1", comingSoon: true },
     { id: 'game5', title: "Future Game 2", actualImageUrl: "/images/placeholder-banner.jpg", href: "/future2", comingSoon: true },
  ];

  const gamesData: GameData[] = baseGamesData.map(game => ({
    ...game,
    imageUrl: game.comingSoon ? PLACEHOLDER_IMAGE_URL : game.actualImageUrl || PLACEHOLDER_IMAGE_URL,
  }));

  // Render Logic
  return (
    <nav className={`${styles.nav} ${isGameCarouselVisible ? styles.gameCarouselActive : ''} ${navOpen ? styles.navOpen : ''}`}>
      {/* Top Bar */}
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMobileNav}>
          Galactic Phantom Division
        </Link>
        <button type="button" className={styles.hamburger} onClick={toggleNav} aria-label="Toggle Navigation Menu" aria-expanded={navOpen} aria-controls="mobile-menu">
          {navOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
        <div className={styles.desktopMenu}>
          {navItems.map(({ href, label }) => ( <Link key={href} href={href} className={styles.link}>{label}</Link> ))}
          <button id="games-nav-button" type="button" onClick={toggleGameCarousel} className={`${styles.link} ${styles.gamesButton} ${isGameCarouselVisible ? styles.gamesButtonActive : ''}`} aria-haspopup="dialog" aria-expanded={isGameCarouselVisible} aria-controls="game-carousel-overlay">
            Games
          </button>
        </div>
      </div>

      {/* Game Carousel Overlay */}
      {isGameCarouselVisible && (
        <div id="game-carousel-overlay" ref={gameCarouselRef} className={styles.gameCarouselOverlay} role="dialog" aria-modal="true" aria-labelledby="game-carousel-title">
          <h2 id="game-carousel-title" className={styles.visuallyHidden}>Select a Game</h2>
          <div className={styles.gameCarouselContent}>
            <button type="button" onClick={closeGameCarousel} className={styles.closeCarouselButton} aria-label="Close Games Carousel">
              <FaTimes aria-hidden="true" />
            </button>
            <Swiper
              modules={[Navigation, A11y]}
              spaceBetween={80} // Increased space for 1.75 scale
              slidesPerView={'auto'}
              centeredSlides={true}
              loop={gamesData.length > 3}
              navigation={true}
              grabCursor={true}
              a11y={{
                enabled: true,
                prevSlideMessage: 'Previous game',
                nextSlideMessage: 'Next game',
                slideLabelMessage: 'Game {{index}} of {{slidesLength}}',
                paginationBulletMessage: 'Go to game {{index}}', // If using pagination
                containerRoleDescriptionMessage: 'Games carousel',
                itemRoleDescriptionMessage: 'Game card',
              }}
              className={`${styles.swiperContainer} ${styles.swiperPerspective}`}
              watchSlidesProgress={true}
            >
              {gamesData.map((game, index) => (
                <SwiperSlide key={game.id} className={styles.swiperSlide} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${gamesData.length}`}>
                  {/* Inner wrapper for transforms and click handling */}
                  <div className={styles.slideInnerWrapper} style={game.comingSoon ? { cursor: 'default' } : { cursor: 'pointer' }}>
                    {/* Wrap non-coming-soon cards in Link for Navbar context */}
                    {!game.comingSoon ? (
                      <Link href={game.href} onClick={closeGameCarousel} className={styles.navCardLink}>
                        <GameCard
                          title={game.title}
                          imageUrl={game.imageUrl}
                          href={game.href} // Prop still passed, but Link handles nav
                          comingSoon={false} // Render as non-coming-soon visually
                        />
                      </Link>
                    ) : (
                      <GameCard // Render directly if coming soon (non-interactive)
                        title={game.title}
                        imageUrl={game.imageUrl}
                        href={game.href}
                        comingSoon={true}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {navOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          <ul className={styles.mobileList}>
            {navItems.map((item) => ( <li key={item.href}><Link href={item.href} className={styles.mobileLink} onClick={closeMobileNav}>{item.label}</Link></li> ))}
            <li>
              <button type="button" onClick={toggleGameCarousel} className={`${styles.mobileLink} ${styles.mobileGamesButton}`} aria-haspopup="dialog" aria-expanded={isGameCarouselVisible} aria-controls="game-carousel-overlay">
                Games
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;