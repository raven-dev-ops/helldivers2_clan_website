// src/components/common/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
// Removed FaChevronDown, kept FaSpinner for initial load indication
import { FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";
import styles from "./Navbar.module.css";
// Removed useDivisionSelection as selection is no longer handled here
// import { useDivisionSelection } from '@/hooks/useDivisionSelection';

interface GameData {
  id: string;
  title: string;
  href: string;
}

// This might still be useful for determining nav links, but not for the dropdown itself
const AVAILABLE_GAMES: GameData[] = [
  { id: 'helldivers-2', title: "HELLDIVERS 2", href: "/helldivers-2" },
  { id: 'dune-awakening', title: "Dune: Awakening", href: "/dune-awakening" },
  // Add other games as needed
];

interface NavItem { href: string; label: string; }

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
    const isDune = isClient && currentDivisionId === 'dune-awakening'; // Match ID used in AVAILABLE_GAMES
    if (isDune) {
      return [
        { href: "/dune-awakening/merch", label: "Merch" },
        { href: "/dune-awakening/worldpvp", label: "PVP" },
        { href: "/dune-awakening/factions", label: "Factions" },
        { href: "/dune-awakening/market", label: "Market" },
        { href: "/dune-awakening/partners", label: "Partners" },
        { href: "/dune-awakening/studio", label: "Studio" },
      ];
    } else { // Default (Helldivers 2 or initial state)
      return [
        { href: "helldivers-2/merch", label: "Merch" },
        { href: "helldivers-2/academy", label: "Academy" },
        { href: "helldivers-2/creators", label: "Creators" },
        { href: "helldivers-2/forum", label: "Forum" },
        { href: "helldivers-2/partners", label: "Partners" },
        { href: "helldivers-2/studio", label: "Studio" },
      ];
    }
  };
  const standardNavItems = getNavItems();

  // Determine if we show a loading indicator (only during initial client fetch)
  const showInitialLoadSpinner = !isClient || isLoadingDivision;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo / Link to Home/Selection Page */}
        <div className={styles.logoArea}>
          {/* Use a Link component for proper navigation */}
          <Link href="/" className={styles.logoLinkButton} title="Select Division">
            {/* Optionally show spinner during initial load */}
            {showInitialLoadSpinner ? (
               <FaSpinner className={styles.spinnerRotating} aria-label="Loading"/>
            ) : (
              // Display static text or a logo image here
              "GPT Divisions"
              // Example with image: <img src="/logo.png" alt="Site Logo" className={styles.logoImage} />
            )}
          </Link>
          {/* Removed dropdown button and ul */}
        </div>

        {/* Desktop Menu Links */}
        <div className={styles.desktopMenu}>
          {standardNavItems.map(({ href, label }) => (
            <Link key={href} href={href} className={isClient && pathname === href ? styles.activeLink : ''}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;