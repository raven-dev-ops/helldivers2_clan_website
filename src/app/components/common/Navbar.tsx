// src/components/common/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
// Removed FaChevronDown, kept FaSpinner for initial load indication
import { FaSpinner } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";
// Removed useDivisionSelection as selection is no longer handled here
// import { useDivisionSelection } from '@/hooks/useDivisionSelection';
// import LoginButtons from "@/app/components/auth/LoginButtons";

interface GameData {
  id: string;
  title: string;
  href: string;
  comingSoon?: boolean;
}

// This might still be useful for determining nav links, but not for the dropdown itself
const AVAILABLE_GAMES: GameData[] = [
  { id: 'helldivers-2', title: "HELLDIVERS 2", href: "/helldivers-2" },
  { id: 'dune-awakening', title: "Dune: Awakening", href: "/dune-awakening", comingSoon: true },
  // Add other games as needed
];

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

const Navbar = () => {
  // Removed dropdownOpen state
  const [currentDivisionId, setCurrentDivisionId] = useState<string | null>(null);
  const [isLoadingDivision, setIsLoadingDivision] = useState(true); // Still useful for initial nav link determination
  const [isClient, setIsClient] = useState(false); // State to track client-side mount
  // Removed dropdownRef

  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();
  // Removed useDivisionSelection hook usage

  // --- Effect to mark component as mounted on client ---
  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- Effect to fetch division data ONLY on the client AFTER mount ---
  // This is still needed to determine which set of nav links to display
  useEffect(() => {
    if (!isClient || sessionStatus === 'loading') {
        if (!isLoadingDivision && sessionStatus === 'loading') {
             setIsLoadingDivision(true);
        }
      return;
    }
    let isEffectMounted = true;
    const fetchUserDivision = async () => {
      console.log("Navbar Client: Fetching division for nav links, session status:", sessionStatus);
      setIsLoadingDivision(true);
      let fetchedDivisionId: string | null = null;
      if (sessionStatus === 'authenticated') {
        try {
          const response = await fetch('/api/users/me');
          if (!isEffectMounted) return;
          if (response.ok) {
            const userData = await response.json();
            fetchedDivisionId = userData?.division || null; // Use the correct field name from your API
            console.log("Navbar Client: Fetched division for nav links:", fetchedDivisionId);
          } else {
            console.error("Navbar Client: Failed fetch:", response.statusText);
          }
        } catch (error) {
           if (!isEffectMounted) return;
          console.error("Navbar Client: Error fetching:", error);
        }
      }
      if (isEffectMounted) {
        setCurrentDivisionId(fetchedDivisionId);
        setIsLoadingDivision(false);
        console.log("Navbar Client: Fetch complete for nav links. ID:", fetchedDivisionId);
      }
    };
    fetchUserDivision();
    return () => { isEffectMounted = false; };
  }, [isClient, sessionStatus]);

  // Removed Dropdown Controls & Click Outside Listener

  // --- Define Nav Items ---
  const getNavItems = (): NavItem[] => {
    // Check if the current path starts with /dune-awakening
    if (pathname.startsWith('/dune-awakening')) {
      return [
        { href: "/dune-awakening", label: "Home" },
        { href: "/dune-awakening/merch", label: "Merch" },
        { href: "/dune-awakening/factions", label: "Factions" },
        { href: "/dune-awakening/creators", label: "Creators" },
      ];
    } else if (isClient && currentDivisionId === 'dune-awakening') {
       return [
        { href: "/dune-awakening", label: "Home" },
        { href: "/dune-awakening/merch", label: "Merch" },
        { href: "/dune-awakening/factions", label: "Factions" },
        { href: "/dune-awakening/creators", label: "Creators" },
      ];
    } else { 
      return [
        { href: "/helldivers-2", label: "Home" },
        { href: "/helldivers-2/merch", label: "Merch" },
        { href: "/helldivers-2/leaderboard", label: "Leaderboard" },
        { href: "/helldivers-2/challenges", label: "Challenges" },
        { href: "/helldivers-2/creators", label: "Creators" },
        { href: "/helldivers-2/news", label: "Ops" },
      ];
    }
  };
  const standardNavItems = getNavItems();

  // Determine if we show a loading indicator (only during initial client fetch)
  const showInitialLoadSpinner = !isClient || isLoadingDivision;

  // Base path for the current division to build dropdown links correctly
  const divisionBasePath = pathname.startsWith('/dune-awakening') || currentDivisionId === 'dune-awakening'
    ? '/dune-awakening'
    : '/helldivers-2';

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo / Link to Home/Selection Page */}
        <div className={styles.logoArea}>
          <div className={styles.dropdown}>
            <Link href="/" className={styles.logoLinkButton} title="Select Division">
              {/* Optionally show spinner during initial load */}
              {showInitialLoadSpinner ? (
                 <FaSpinner className={styles.spinnerRotating} aria-label="Loading"/>
              ) : (
                // Display static text or a logo image here
                "GPT GAMES"
                // Example with image: <img src="/logo.png" alt="Site Logo" className={styles.logoImage} />
              )}
            </Link>
            <div className={styles.dropdownMenu} role="menu" aria-label="Select a game">
              {AVAILABLE_GAMES.map(({ id, title, href, comingSoon }) => (
                comingSoon ? (
                  <span key={id} className={`${styles.dropdownItem} ${styles.disabled}`} role="menuitem" aria-disabled>
                    {title} (Coming Soon)
                  </span>
                ) : (
                  <Link key={id} href={href} className={styles.dropdownItem} role="menuitem">{title}</Link>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Menu Links */}
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
                    <Link href="/helldivers-2/leaderboard#monthly" className={styles.dropdownItem} role="menuitem">Monthly</Link>
                    <Link href="/helldivers-2/leaderboard#total" className={styles.dropdownItem} role="menuitem">Total</Link>
                    <Link href="/helldivers-2/leaderboard#average" className={styles.dropdownItem} role="menuitem">Average</Link>
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
            if (label === 'Creators') {
              const isCreatorsActive = isClient && pathname.startsWith(`${divisionBasePath}/creators`);
              const creatorsLinkClass = `${styles.link} ${isCreatorsActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={creatorsLinkClass}>Creators</Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Creators platforms">
                    <Link href={`${divisionBasePath}/creators`} className={styles.dropdownItem} role="menuitem">Twitch</Link>
                    <span className={`${styles.dropdownItem} ${styles.disabled}`} role="menuitem" aria-disabled>YouTube</span>
                    <span className={`${styles.dropdownItem} ${styles.disabled}`} role="menuitem" aria-disabled>TikTok</span>
                    <span className={`${styles.dropdownItem} ${styles.disabled}`} role="menuitem" aria-disabled>Kick</span>
                    <span className={`${styles.dropdownItem} ${styles.disabled}`} role="menuitem" aria-disabled>X</span>
                  </div>
                </div>
              );
            }
            if (label === 'Ops') {
              const isOpsActive = isClient && pathname.startsWith(`${divisionBasePath}/news`);
              const opsLinkClass = `${styles.link} ${isOpsActive ? styles.activeLink : ''}`;
              return (
                <div key={href} className={styles.dropdown}>
                  <Link href={href} className={opsLinkClass}>Ops</Link>
                  <div className={styles.dropdownMenu} role="menu" aria-label="Operations">
                    <Link href={`${divisionBasePath}/news#war-news`} className={styles.dropdownItem} role="menuitem">War News</Link>
                    <Link href={`${divisionBasePath}/news#major-orders`} className={styles.dropdownItem} role="menuitem">Major Orders</Link>
                    <Link href={`${divisionBasePath}/news#galactic-map`} className={styles.dropdownItem} role="menuitem">Galactic Map</Link>
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
              <button className={styles.link} aria-haspopup="menu" aria-expanded="false">Profile</button>
              <div className={styles.dropdownMenu} role="menu" aria-label="Profile actions">
                <Link href="/components/settings" className={styles.dropdownItem} role="menuitem">Settings</Link>
                <button onClick={() => signOut()} className={styles.dropdownItem} role="menuitem">Sign out</button>
              </div>
            </div>
          ) : (
            <Link href="/auth" className={styles.link}>Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;