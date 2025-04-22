// src/components/common/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes, FaChevronDown, FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";
import styles from "./Navbar.module.css";
import { useDivisionSelection } from '@/hooks/useDivisionSelection';

// --- Define the shape of game data ---
interface GameData {
  id: string;    // API identifier (e.g., helldivers-2)
  title: string; // Display title (e.g., Helldivers 2)
  href: string;  // Navigation path (e.g., /helldivers-2)
}

// --- Available Game Divisions ---
// Update href to the desired top-level path
const AVAILABLE_GAMES: GameData[] = [
  {
    id: 'helldivers-2',
    title: "HELLDIVERS 2",
    href: "/helldivers-2" // UPDATED href
  },
  {
    id: 'dune-awakening',
    title: "Dune: Awakening",
    href: "/dune-awakening" // UPDATED href
  },
];
// --- End Available Game Divisions ---

// --- Standard Nav Item Definition ---
interface NavItem { href: string; label: string; }

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentDivisionId, setCurrentDivisionId] = useState<string | null>(null);
  const [loadingDivision, setLoadingDivision] = useState(true);

  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { selectDivision, isLoading: isSelectingDivision, error: selectionError } = useDivisionSelection();

  // --- Effect to fetch current user division ---
  useEffect(() => {
    const fetchUserDivision = async () => {
      if (sessionStatus === 'authenticated') {
        setLoadingDivision(true);
        try {
          const response = await fetch('/api/users/me');
          if (!response.ok) {
             console.error(`API Error fetching user division: ${response.status}`);
             setCurrentDivisionId(null);
          } else {
              const userData = await response.json();
              setCurrentDivisionId(userData?.division || null);
          }
        } catch (error) {
          console.error("Network or other error fetching user division:", error);
          setCurrentDivisionId(null);
        } finally {
          setLoadingDivision(false);
        }
      } else if (sessionStatus === 'unauthenticated') {
         setCurrentDivisionId(null);
         setLoadingDivision(false);
      }
    };
    fetchUserDivision();
  }, [sessionStatus, session]);

  // --- Handlers ---
  const toggleMobileNav = () => setNavOpen((prev) => !prev);
  const closeMobileNav = () => setNavOpen(false);

  const handleTriggerClick = () => {
      if (loadingDivision || isSelectingDivision || sessionStatus !== 'authenticated') {
          return;
      }
      if (currentGame && !dropdownOpen) {
          closeMobileNav();
          router.push(currentGame.href); // Uses the updated href
      } else {
          setDropdownOpen((prev) => !prev);
      }
  };

  const closeDropdown = () => setDropdownOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGameSelect = async (game: GameData) => {
    if (isSelectingDivision || game.id === currentDivisionId) return;
    closeDropdown();
    closeMobileNav();
    // Still uses game.id for the API call, which is correct
    await selectDivision(game.id);
    // The selectDivision hook might also handle navigation/reload,
    // ensure it navigates to the correct game.href if it does.
    // Often, just updating the state and letting the useEffect fetch again is enough,
    // and the page might reload based on other logic (like router events if data changes).
  };

  // --- Derive current game and other games ---
  const currentGame = AVAILABLE_GAMES.find(g => g.id === currentDivisionId);
  const otherGames = AVAILABLE_GAMES.filter(g => g.id !== currentDivisionId);

  // --- Standard Nav Items ---
  const standardNavItems: NavItem[] = [
    { href: "/academy", label: "Academy" },
    { href: "/creators", label: "Creators" },
    { href: "/forum", label: "Forum" },
    { href: "/partners", label: "Partners" },
    { href: "/studios", label: "Studios" },
  ];

   // --- Determine Trigger Content (No Image) ---
   let triggerContent;
   let triggerAriaLabel;
   const isTriggerButtonDisabled = sessionStatus !== 'authenticated' || loadingDivision || isSelectingDivision;

   if (sessionStatus === 'loading' || (sessionStatus === 'authenticated' && loadingDivision)) {
     triggerContent = <span className={styles.loadingText}>Loading...</span>;
     triggerAriaLabel = "Loading Division";
   } else if (sessionStatus === 'unauthenticated') {
     triggerContent = (
        <div className={styles.logoAreaStatic}>
             <Link href="/" className={styles.staticLogoLink} aria-label="Go to Homepage">
                 <span className={styles.siteTitleStatic}>HELLDIVERS 2</span>
             </Link>
        </div>
     );
     triggerAriaLabel = "Site Logo";
   } else if (isSelectingDivision) {
     const selectingGame = currentGame;
     if (selectingGame) {
       triggerContent = (
         <>
           <span className={styles.dropdownTriggerText}>{selectingGame.title}</span>
           <FaSpinner className={`${styles.dropdownSpinner} ${styles.spinnerRotating}`} aria-label="Changing..." />
         </>
       );
       triggerAriaLabel = `Changing division from ${selectingGame.title}`;
     } else {
       triggerContent = <span className={styles.selectingText}>Selecting... <FaSpinner className={`${styles.dropdownSpinner} ${styles.spinnerRotating}`} aria-label="Changing..." /></span>;
       triggerAriaLabel = "Selecting Division";
     }
   } else if (sessionStatus === 'authenticated') {
     if (currentGame) {
       triggerContent = (
         <>
           <span className={styles.dropdownTriggerText}>{currentGame.title}</span>
           <FaChevronDown className={`${styles.dropdownIcon} ${dropdownOpen ? styles.dropdownIconOpen : ''}`} aria-hidden="true" />
         </>
       );
       triggerAriaLabel = dropdownOpen
            ? `Current Division: ${currentGame.title}. Close division selection.`
            : `Current Division: ${currentGame.title}. Go to division page or open division selection.`;
     } else {
       triggerContent = (
         <>
           <span className={styles.dropdownTriggerText}>Select Division</span>
           <FaChevronDown className={`${styles.dropdownIcon} ${dropdownOpen ? styles.dropdownIconOpen : ''}`} aria-hidden="true" />
         </>
       );
       triggerAriaLabel = dropdownOpen ? "Close division selection." : "Select Game Division.";
     }
   }


  // --- Component Return JSX ---
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo Area */}
        <div className={styles.logoArea}>
          {sessionStatus === 'authenticated' ? (
            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <button
                type="button"
                className={styles.logoDropdownButton}
                onClick={handleTriggerClick} // Uses updated href via currentGame
                disabled={isTriggerButtonDisabled}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-controls="game-division-menu"
                aria-label={triggerAriaLabel}
              >
                {triggerContent}
              </button>
              {dropdownOpen && !loadingDivision && (
                <ul id="game-division-menu" className={styles.dropdownMenu} role="menu">
                  {otherGames.length > 0 ? (
                    otherGames.map((game) => (
                      <li key={game.id} role="none">
                        <button
                          type="button"
                          role="menuitem"
                          className={`${styles.dropdownItem} ${isSelectingDivision ? styles.dropdownItemDisabled : ''}`}
                          onClick={() => handleGameSelect(game)} // Still uses game.id for API
                          disabled={isSelectingDivision}
                          aria-disabled={isSelectingDivision}
                        >
                          <span className={styles.dropdownItemLabel}>{game.title}</span>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li role="none">
                      <span className={styles.dropdownItemDisabled} role="menuitem">No other divisions</span>
                    </li>
                  )}
                </ul>
              )}
            </div>
          ) : (
             triggerContent // Display the static content defined earlier
          )}
          {selectionError && !isSelectingDivision && (
             <span className={styles.globalErrorText} role="alert">{selectionError}</span>
           )}
        </div>

        {/* Mobile Hamburger Button */}
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

        {/* Desktop Navigation Controls */}
        <div className={styles.desktopControls}>
          <div className={styles.desktopMenu}>
            {standardNavItems.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.link} onClick={closeDropdown}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {navOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          <ul className={styles.mobileList} role="menu">
             {/* Display current division info */}
             {sessionStatus === 'authenticated' && (
                 <li role="none" className={styles.mobileDivisionDisplay}>
                     <span className={styles.mobileLabel}>Division:</span>
                     {loadingDivision ? (
                         <span className={styles.mobileLoading}>Loading...</span>
                     ) : currentGame ? (
                         // Link uses the updated href
                         <Link href={currentGame.href} className={styles.mobileValueLink} onClick={() => { closeMobileNav(); closeDropdown(); }}>
                            {currentGame.title}
                         </Link>
                     ) : (
                         <span className={styles.mobileValue}>None</span>
                     )}
                     {isSelectingDivision && <FaSpinner className={`${styles.mobileSpinner} ${styles.spinnerRotating}`} />}
                 </li>
             )}
            {standardNavItems.map((item) => (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  className={styles.mobileLink}
                  onClick={() => { closeMobileNav(); closeDropdown(); }}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              </li>
            ))}
             {/* Button to change division */}
             {sessionStatus === 'authenticated' && otherGames.length > 0 && (
                 <li role="none" className={styles.mobileChangeDivision}>
                     <button
                         type="button"
                         className={styles.mobileChangeButton}
                         onClick={() => { handleTriggerClick(); closeMobileNav(); }} // Still works correctly
                         disabled={isSelectingDivision || loadingDivision}
                         aria-expanded={dropdownOpen}
                         aria-controls="game-division-menu"
                     >
                         {currentGame ? 'Change Division' : 'Select Division'}
                         <FaChevronDown className={`${styles.mobileChevron} ${dropdownOpen ? styles.dropdownIconOpen : ''}`} aria-hidden="true" />
                     </button>
                 </li>
             )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;