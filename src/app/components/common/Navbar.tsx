// src/components/common/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";
import ThemeToggle from "./ThemeToggle";

interface NavItem { href: string; label: string; }

// Named labels for challenge anchors
const CHALLENGE_LEVEL_LABELS: Array<{ id: string; label: string; }> = [
  { id: 'level-0', label: 'Basic Clearance' },
  { id: 'level-1', label: 'Sabotage Proficiency' },
  { id: 'level-2', label: 'Resource Denial' },
  { id: 'level-3', label: 'ICBM Control' },
  { id: 'level-4', label: 'Flawless ICBM' },
  { id: 'level-5', label: 'Perfect Survey' },
  { id: 'level-6', label: 'Eagle Ace' },
  { id: 'level-7', label: 'The Purist' },
];

const CAMPAIGN_LABELS: Array<{ id: string; label: string; }> = [
  { id: 'level-8', label: 'Terminid Spawn Camp' },
  { id: 'level-9', label: 'Automaton Hell Strike' },
  { id: 'level-10', label: 'Lethal Pacifist' },
  { id: 'level-11', label: 'Total Area Scorching' },
];

const Navbar = () => {
  const [isClient, setIsClient] = useState(false); // State to track client-side mount
  const [meritPoints, setMeritPoints] = useState<number | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { status: sessionStatus } = useSession();

  // Mark component as mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetch('/api/users/me', { cache: 'no-store' })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setMeritPoints(data.meritPoints ?? 0);
        })
        .catch(() => setMeritPoints(0));
    }
  }, [sessionStatus]);

  // --- Define Nav Items ---
  const getNavItems = (): NavItem[] => {
    return [
      { href: "/helldivers-2", label: "Home" },
      { href: "/helldivers-2/merch", label: "Shop" },
      { href: "/helldivers-2/leaderboard", label: "Leaderboard" },
      { href: "/helldivers-2/challenges", label: "Challenges" },
      { href: "/helldivers-2/campaigns", label: "Campaigns" },
      { href: "/helldivers-2/academy", label: "Academy" },
      { href: "/helldivers-2/creators", label: "Streamers" },
      { href: "/helldivers-2/news/war-news", label: "Intel" },
    ];
  };
  const standardNavItems = getNavItems();

  const divisionBasePath = '/helldivers-2';

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <button
          className={styles.mobileMenuButton}
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        <div className={styles.desktopMenu}>
          {standardNavItems.map(({ href, label }) => {
            const isActive = isClient && pathname === href;
            const linkClass = `${styles.link} ${isActive ? styles.activeLink : ''}`;
            if (label === 'Leaderboard') {
              const isLeaderboardActive = isClient && pathname.startsWith('/helldivers-2/leaderboard');
              const leaderboardLinkClass = `${styles.link} ${isLeaderboardActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={leaderboardLinkClass}>Leaderboard</Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Leaderboard shortcuts">
                    <Link href="/helldivers-2/leaderboard#lifetime" className={styles.dropdownItem} role="menuitem">Lifetime</Link>
                    <Link href="/helldivers-2/leaderboard#monthly" className={styles.dropdownItem} role="menuitem">Monthly</Link>
                    <Link href="/helldivers-2/leaderboard#solo" className={styles.dropdownItem} role="menuitem">Solo</Link>
                    <Link href="/helldivers-2/leaderboard#merit" className={styles.dropdownItem} role="menuitem">Merit</Link>
                  </div>
                </div>
              );
            }
            if (label === 'Challenges') {
              const isChallengesActive = isClient && pathname.startsWith('/helldivers-2/challenges');
              const challengesLinkClass = `${styles.link} ${isChallengesActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={challengesLinkClass}>Challenges</Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Challenge levels">
                    {CHALLENGE_LEVEL_LABELS.map(({ id, label }) => (
                      <Link key={id} href={`${divisionBasePath}/challenges#${id}`} className={styles.dropdownItem} role="menuitem">{label}</Link>
                    ))}
                  </div>
                </div>
              );
            }
            if (label === 'Campaigns') {
              const isCampaignsActive = isClient && pathname.startsWith(`${divisionBasePath}/campaigns`);
              const campaignsLinkClass = `${styles.link} ${isCampaignsActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={campaignsLinkClass}>Campaigns</Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Campaign missions">
                    {CAMPAIGN_LABELS.map(({ id, label }) => (
                      <Link key={id} href={`${divisionBasePath}/campaigns#${id}`} className={styles.dropdownItem} role="menuitem">{label}</Link>
                    ))}
                  </div>
                </div>
              );
            }
            if (label === 'Academy') {
              const isAcademyActive = isClient && pathname.startsWith(`${divisionBasePath}/academy`);
              const academyLinkClass = `${styles.link} ${isAcademyActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={academyLinkClass}>Academy</Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Academy pages">
                    <Link href={`${divisionBasePath}/academy/training`} className={styles.dropdownItem} role="menuitem">My Training</Link>
                    <Link href={`${divisionBasePath}/academy/apply`} className={styles.dropdownItem} role="menuitem">Join Now!</Link>
                  </div>
                </div>
              );
            }
            if (label === 'Streamers') {
              const isStreamersActive = isClient && pathname.startsWith(`${divisionBasePath}/creators`);
              const streamersLinkClass = `${styles.link} ${isStreamersActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={streamersLinkClass}>Streamers</Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Streamers platforms">
                    <Link href={`${divisionBasePath}/creators`} className={styles.dropdownItem} role="menuitem">Twitch</Link>
                    <Link href={`${divisionBasePath}/creators#youtube`} className={styles.dropdownItem} role="menuitem">YouTube</Link>
                  </div>
                </div>
              );
            }
            if (label === 'Intel') {
              const isIntelActive = isClient && pathname.startsWith(`${divisionBasePath}/news`);
              const intelLinkClass = `${styles.link} ${isIntelActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={intelLinkClass}>Intel</Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Intel shortcuts">
                    <Link href={`${divisionBasePath}/news/war-news`} className={styles.dropdownItem} role="menuitem">War News</Link>
                    <Link href={`${divisionBasePath}/news/major-orders`} className={styles.dropdownItem} role="menuitem">Major Orders</Link>
                    <Link href={`${divisionBasePath}/news/galactic-map`} className={styles.dropdownItem} role="menuitem">Galactic Map</Link>
                    <Link href={`${divisionBasePath}/news/super-store`} className={styles.dropdownItem} role="menuitem">Super Store</Link>
                  </div>
                </div>
              );
            }
            return (
              <Link key={href} href={href} className={linkClass}>
                {label}
              </Link>
            );
          })}

          {/* Profile dropdown / Auth actions */}
          {sessionStatus === 'authenticated' ? (
            <div className={styles.dropdown}>
              <Link href="/profile" className={styles.link} aria-haspopup="menu" aria-expanded="false">
                {`Profile${meritPoints !== null ? ` (${meritPoints})` : ''}`}
              </Link>
              <div className={styles.dropdownMenu} role="menu" aria-label="Profile actions">
                <Link href="/settings" className={styles.dropdownItem} role="menuitem">Settings</Link>
                <button onClick={() => signOut()} className={styles.dropdownItem} role="menuitem">Sign out</button>
              </div>
            </div>
          ) : (
            <Link href="/auth" className={styles.link}>Sign in</Link>
          )}
          <ThemeToggle />
        </div>
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          {standardNavItems.map(({ href, label }) => (
            <Link key={href} href={href} className={styles.link} onClick={() => setMobileMenuOpen(false)}>
              {label}
            </Link>
          ))}
          {sessionStatus === 'authenticated' ? (
            <>
              <Link href="/profile" className={styles.link} onClick={() => setMobileMenuOpen(false)}>
                {`Profile${meritPoints !== null ? ` (${meritPoints})` : ''}`}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className={styles.link}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth" className={styles.link} onClick={() => setMobileMenuOpen(false)}>
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;