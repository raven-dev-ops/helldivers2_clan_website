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
  const [isClient, setIsClient] = useState(false);
  const [meritPoints, setMeritPoints] = useState<number | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { status: sessionStatus } = useSession();

  // ----- Paths (single source of truth)
  const divisionBasePath = '/helldivers-2';
  const ACADEMY_BASE = `${divisionBasePath}/academy`;
  const ACADEMY_APPLY = `${ACADEMY_BASE}/apply`;
  const ACADEMY_MY = `${ACADEMY_BASE}/training`;   // My Training
  const ACADEMY_MODTEAM = `${ACADEMY_BASE}/mod-team`;

  // Mark component as mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch merit points when authenticated
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
  const getNavItems = (): NavItem[] => [
    { href: `${divisionBasePath}`, label: 'Home' },
    { href: `${divisionBasePath}/merch`, label: 'Shop' },
    { href: `${divisionBasePath}/leaderboard`, label: 'Leaderboard' },
    { href: `${divisionBasePath}/challenges`, label: 'Challenges' },
    { href: `${divisionBasePath}/campaigns`, label: 'Campaigns' },
    { href: `${divisionBasePath}/academy`, label: 'Academy' },
    { href: `${divisionBasePath}/creators`, label: 'Streamers' },
  ];
  const standardNavItems = getNavItems();

  const closeMobile = () => setMobileMenuOpen(false);

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

        {/* Desktop menu */}
        <div className={styles.desktopMenu}>
          {standardNavItems.map(({ href, label }) => {
            const isActive = isClient && pathname === href;
            const linkClass = `${styles.link} ${isActive ? styles.activeLink : ''}`;

            if (label === 'Leaderboard') {
              const isLeaderboardActive =
                isClient && pathname.startsWith(`${divisionBasePath}/leaderboard`);
              const leaderboardLinkClass = `${styles.link} ${isLeaderboardActive ? styles.activeLink : ''}`;
              return (
                <Link key={href} href={href} className={leaderboardLinkClass} prefetch={false}>
                  Leaderboard
                </Link>
              );
            }

            if (label === 'Challenges') {
              const isChallengesActive =
                isClient && pathname.startsWith(`${divisionBasePath}/challenges`);
              const challengesLinkClass = `${styles.link} ${isChallengesActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={challengesLinkClass} prefetch={false}>
                    Challenges
                  </Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Challenge levels">
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
                isClient && pathname.startsWith(`${divisionBasePath}/campaigns`);
              const campaignsLinkClass = `${styles.link} ${isCampaignsActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={campaignsLinkClass} prefetch={false}>
                    Campaigns
                  </Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Campaign missions">
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
              const isAcademyActive = isClient && pathname.startsWith(ACADEMY_BASE);
              const academyLinkClass = `${styles.link} ${isAcademyActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={ACADEMY_BASE} className={academyLinkClass} prefetch={false}>
                    Academy
                  </Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Academy">
                    <Link href={ACADEMY_APPLY} className={styles.dropdownItem} role="menuitem" prefetch={false}>
                      Mod Team
                    </Link>
                    {sessionStatus === 'authenticated' && (
                      <Link href={ACADEMY_MY} className={styles.dropdownItem} role="menuitem" prefetch={false}>
                        My Training
                      </Link>
                    )}
                  </div>
                </div>
              );
            }

            if (label === 'Streamers') {
              const isStreamersActive =
                isClient && pathname.startsWith(`${divisionBasePath}/creators`);
              const streamersLinkClass = `${styles.link} ${isStreamersActive ? styles.activeLink : ''}`;
              return (
                <Link key={href} href={href} className={streamersLinkClass} prefetch={false}>
                  Streamers
                </Link>
              );
            }

            return (
              <Link key={href} href={href} className={linkClass} prefetch={false}>
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
              <div className={styles.dropdownMenu} role="menu" aria-label="Profile actions">
                <Link href="/settings" className={styles.dropdownItem} role="menuitem">
                  Settings
                </Link>
                <button onClick={() => signOut()} className={styles.dropdownItem} role="menuitem">
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

        {/* Mobile menu — mirrors desktop items, closes on click */}
        <div
          className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
        >
          {/* Home, Shop, Leaderboard */}
          <Link href={`${divisionBasePath}`} className={styles.link} onClick={closeMobile} prefetch={false}>
            Home
          </Link>
          <Link href={`${divisionBasePath}/merch`} className={styles.link} onClick={closeMobile} prefetch={false}>
            Shop
          </Link>
          <Link href={`${divisionBasePath}/leaderboard`} className={styles.link} onClick={closeMobile} prefetch={false}>
            Leaderboard
          </Link>

          {/* Challenges + subitems */}
          <Link href={`${divisionBasePath}/challenges`} className={styles.link} onClick={closeMobile} prefetch={false}>
            Challenges
          </Link>
          {CHALLENGE_LEVEL_LABELS.map(({ id, label }) => (
            <Link
              key={id}
              href={`${divisionBasePath}/challenges#${id}`}
              className={styles.link}
              onClick={closeMobile}
              prefetch={false}
            >
              {label}
            </Link>
          ))}

          {/* Campaigns + subitems */}
          <Link href={`${divisionBasePath}/campaigns`} className={styles.link} onClick={closeMobile} prefetch={false}>
            Campaigns
          </Link>
          {CAMPAIGN_LABELS.map(({ id, label }) => (
            <Link
              key={id}
              href={`${divisionBasePath}/campaigns#${id}`}
              className={styles.link}
              onClick={closeMobile}
              prefetch={false}
            >
              {label}
            </Link>
          ))}

          {/* Academy + subitems (My Training gated by auth; Mod Team last) */}
          <Link href={ACADEMY_BASE} className={styles.link} onClick={closeMobile} prefetch={false}>
            Academy
          </Link>
          <Link href={ACADEMY_APPLY} className={styles.link} onClick={closeMobile} prefetch={false}>
            Mod Team
          </Link>
          {sessionStatus === 'authenticated' && (
            <Link href={ACADEMY_MY} className={styles.link} onClick={closeMobile} prefetch={false}>
              My Training
            </Link>
          )}

          {/* Streamers */}
          <Link
            href={`${divisionBasePath}/creators`}
            className={styles.link}
            onClick={closeMobile}
            prefetch={false}
          >
            Streamers
          </Link>

          {/* Auth/Profile */}
          {sessionStatus === 'authenticated' ? (
            <>
              <Link href="/profile" className={styles.link} onClick={closeMobile}>
                {`Profile${meritPoints !== null ? ` (${meritPoints})` : ''}`}
              </Link>
              <button
                onClick={() => {
                  closeMobile();
                  signOut();
                }}
                className={styles.link}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth" className={styles.link} onClick={closeMobile}>
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
