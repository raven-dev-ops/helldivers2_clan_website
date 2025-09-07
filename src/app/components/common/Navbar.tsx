// src/components/common/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';
import ThemeToggle from './ThemeToggle';

interface NavItem {
  href: string;
  label: string;
}

// Named labels for challenge anchors
const CHALLENGE_LEVEL_LABELS: Array<{ id: string; label: string }> = [
  { id: 'level-0', label: 'Basic Clearance' },
  { id: 'level-1', label: 'Sabotage Proficiency' },
  { id: 'level-2', label: 'Resource Denial' },
  { id: 'level-3', label: 'ICBM Control' },
  { id: 'level-4', label: 'Flawless ICBM' },
  { id: 'level-5', label: 'Perfect Survey' },
  { id: 'level-6', label: 'Eagle Ace' },
  { id: 'level-7', label: 'The Purist' },
];

const CAMPAIGN_LABELS: Array<{ id: string; label: string }> = [
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
      fetch('/api/users/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setMeritPoints(data.meritPoints ?? 0);
        })
        .catch(() => setMeritPoints(0));
    }
  }, [sessionStatus]);

  // --- Define Nav Items ---
  const getNavItems = (): NavItem[] => {
    return [
      { href: '/helldivers-2', label: 'Home' },
      { href: '/helldivers-2/merch', label: 'Shop' },
      { href: '/helldivers-2/leaderboard', label: 'Leaderboard' },
      { href: '/helldivers-2/challenges', label: 'Challenges' },
      { href: '/helldivers-2/campaigns', label: 'Campaigns' },
      { href: '/academy', label: 'Academy' },
      { href: '/helldivers-2/creators', label: 'Streamers' },
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
              const isLeaderboardActive =
                isClient && pathname.startsWith('/helldivers-2/leaderboard');
              const leaderboardLinkClass = `${styles.link} ${isLeaderboardActive ? styles.activeLink : ''}`;
              return (
                <Link
                  key={href}
                  href={href}
                  className={leaderboardLinkClass}
                  prefetch={false}
                >
                  Leaderboard
                </Link>
              );
            }
            if (label === 'Challenges') {
              const isChallengesActive =
                isClient && pathname.startsWith('/helldivers-2/challenges');
              const challengesLinkClass = `${styles.link} ${isChallengesActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link
                    href={href}
                    className={challengesLinkClass}
                    prefetch={false}
                  >
                    Challenges
                  </Link>
                  <div
                    className={styles.dropdownMenu}
                    role="menu"
                    aria-label="Challenge levels"
                  >
                    {CHALLENGE_LEVEL_LABELS.map(({ id, label }) => (
                      <Link
                        key={id}
                        href={`${divisionBasePath}/challenges#${id}`}
                        className={styles.dropdownItem}
                        role="menuitem"
                        prefetch={false}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            if (label === 'Campaigns') {
              const isCampaignsActive =
                isClient &&
                pathname.startsWith(`${divisionBasePath}/campaigns`);
              const campaignsLinkClass = `${styles.link} ${isCampaignsActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link
                    href={href}
                    className={campaignsLinkClass}
                    prefetch={false}
                  >
                    Campaigns
                  </Link>
                  <div
                    className={styles.dropdownMenu}
                    role="menu"
                    aria-label="Campaign missions"
                  >
                    {CAMPAIGN_LABELS.map(({ id, label }) => (
                      <Link
                        key={id}
                        href={`${divisionBasePath}/campaigns#${id}`}
                        className={styles.dropdownItem}
                        role="menuitem"
                        prefetch={false}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            if (label === 'Academy') {
              const isAcademyActive = isClient && pathname.startsWith('/academy');
              const academyLinkClass = `${styles.link} ${isAcademyActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={academyLinkClass} prefetch={false}>
                    Academy
                  </Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Academy">
                    <Link
                      href={`/academy`}
                      className={styles.dropdownItem}
                      role="menuitem"
                      prefetch={false}
                    >
                    </Link>
                    <Link
                      href={`/helldivers-2/academy/apply`}
                      className={styles.dropdownItem}
                      role="menuitem"
                      prefetch={false}
                    >
                      Mod Application
                    </Link>
                  </div>
                </div>
              );
            }
            if (label === 'Streamers') {
              const isStreamersActive =
                isClient && pathname.startsWith(`${divisionBasePath}/creators`);
              const streamersLinkClass = `${styles.link} ${
                isStreamersActive ? styles.activeLink : ''
              }`;
              return (
                <Link
                  key={href}
                  href={href}
                  className={streamersLinkClass}
                  prefetch={false}
                >
                  Streamers
                </Link>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                className={linkClass}
                prefetch={false}
              >
                {label}
              </Link>
            );
          })}

          {/* Profile dropdown / Auth actions */}
          {sessionStatus === 'authenticated' ? (
            <div className={styles.dropdown}>
              <Link
                href="/profile"
                className={styles.link}
                aria-haspopup="menu"
                aria-expanded="false"
              >
                {`Profile${meritPoints !== null ? ` (${meritPoints})` : ''}`}
              </Link>
              <div
                className={styles.dropdownMenu}
                role="menu"
                aria-label="Profile actions"
              >
                <Link
                  href="/settings"
                  className={styles.dropdownItem}
                  role="menuitem"
                >
                  Settings
                </Link>
                <button
                  onClick={() => signOut()}
                  className={styles.dropdownItem}
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth" className={styles.link}>
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </div>
        <div
          className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
        >
          {standardNavItems.map(({ href, label }) => {
            if (label === 'Academy') {
              return (
                <div key={href}>
                  <Link
                    href={href}
                    className={styles.link}
                    onClick={() => setMobileMenuOpen(false)}
                    prefetch={false}
                  >
                    Academy
                  </Link>
                  <Link
                    href={'/helldivers-2/academy/apply'}
                    className={styles.link}
                    onClick={() => setMobileMenuOpen(false)}
                    prefetch={false}
                  >
                    Apply to Mod
                  </Link>
                </div>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                className={styles.link}
                onClick={() => setMobileMenuOpen(false)}
                prefetch={false}
              >
                {label}
              </Link>
            );
          })}
          {sessionStatus === 'authenticated' ? (
            <>
              <Link
                href="/profile"
                className={styles.link}
                onClick={() => setMobileMenuOpen(false)}
              >
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
            <Link
              href="/auth"
              className={styles.link}
              onClick={() => setMobileMenuOpen(false)}
            >
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
