"use client";

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './GameCard.module.css'; // Verify path

interface GameCardProps {
  title: string;
  imageUrl: string;
  href: string; // Destination path (used for API and navigation)
  comingSoon?: boolean;
}

export default function GameCard({ title, imageUrl, href, comingSoon }: GameCardProps) {
  const { data: session, status } = useSession(); // Get session status ('loading', 'authenticated', 'unauthenticated')
  const router = useRouter();

  const handleClick = async () => {
    // Prevent action if coming soon, or if auth is still loading
    if (comingSoon || status === 'loading') {
      return;
    }

    // Double-check authentication status before proceeding
    if (status !== 'authenticated' || !session) {
      console.warn('GameCard clicked while unauthenticated or session missing.');
      // Optionally redirect or show a message, though parent page should handle primary auth flow
      // router.push('/auth');
      return;
    }

    // Extract division identifier from href (e.g., '/helldivers-2' -> 'helldivers-2')
    const divisionIdentifier = href.replace(/^\//, '');
    console.log(`Attempting to set division via API: ${divisionIdentifier}`);

    try {
      // API call to update user's division preference
      const response = await fetch('/api/users/me', { // Ensure this API endpoint exists and handles PUT
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ division: divisionIdentifier }),
      });

      if (!response.ok) {
        // Handle potential API errors (e.g., server error, invalid input)
        const errorText = await response.text();
        console.error(`API Error (${response.status}): Failed to update user division.`, errorText);
        // TODO: Implement user-facing error notification (e.g., using a toast library)
        alert(`Error: Could not select division. ${errorText || response.statusText}`); // Basic alert fallback
        return;
      }

      // API call was successful
      console.log("User division updated successfully via API.");

      // Navigate the user to the selected game's page after successful update
      router.push(href);

    } catch (error) {
      // Handle network errors or other exceptions during the fetch process
      console.error("Network or other error during division update:", error);
      // TODO: Implement user-facing error notification
      alert("Error: Could not connect to server to select division."); // Basic alert fallback
    }
  };

  // Card content remains consistent
  const cardContent = (
    <>
      {comingSoon && <span className={styles.badge}>Coming Soon</span>}
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={`${title} game banner`} // Descriptive alt text
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 18rem" // Adjusted sizes
          className={styles.image}
          priority={!comingSoon} // Prioritize loading images for available games
          unoptimized={imageUrl.includes('placeholder')} // Optional: Don't optimize placeholders
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {/* Conditional text based on game status */}
      {comingSoon && <span className={styles.comingSoonText}>Coming Soon</span>}
      {!comingSoon && <span className={styles.actionText}>Select Division</span>}
    </>
  );

  // Render as a div that acts like a button for accessibility
  return (
    <div
      className={`${styles.root} ${comingSoon ? styles.comingSoon : styles.interactive}`}
      onClick={!comingSoon ? handleClick : undefined}
      style={{ cursor: comingSoon ? 'default' : 'pointer' }} // Visual cursor hint
      role={!comingSoon ? "button" : undefined} // Semantics for screen readers
      tabIndex={!comingSoon ? 0 : undefined} // Allow keyboard focus for interactive cards
      aria-disabled={comingSoon} // Indicate disabled state for coming soon
      aria-label={!comingSoon ? `Select ${title} Division` : `${title} (Coming Soon)`} // Accessible label
      onKeyDown={!comingSoon ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } } : undefined} // Keyboard activation
    >
      {cardContent}
    </div>
  );
}