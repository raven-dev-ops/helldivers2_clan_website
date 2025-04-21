// src/components/common/GameCard.tsx
"use client";

import Image from 'next/image';
// Import signIn from next-auth/react
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './GameCard.module.css'; // Verify path

interface GameCardProps {
  title: string;
  imageUrl: string;
  href: string; // Destination path (used for API and navigation)
  comingSoon?: boolean;
}

export default function GameCard({ title, imageUrl, href, comingSoon }: GameCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = async () => {
    // 1. Prevent action if coming soon or auth loading
    if (comingSoon || status === 'loading') {
      return;
    }

    // 2. Client-side check: If not authenticated, redirect to sign in
    if (status !== 'authenticated' || !session) {
      console.warn('GameCard: Client session invalid/missing. Redirecting to auth.');
      // Redirect to sign-in page, passing the intended game page as callback
      signIn(undefined, { callbackUrl: href }); // Default signIn page
      return; // Stop execution
    }

    // 3. Prepare for API call
    const divisionIdentifier = href.replace(/^\//, '');
    console.log(`Attempting to set division via API: ${divisionIdentifier}`);

    try {
      // 4. API Call
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ division: divisionIdentifier }),
      });

      // 5. Handle API Response
      if (!response.ok) {
        // --- Specific Check for 401 Unauthorized ---
        if (response.status === 401) {
          console.error(`API Error (${response.status}): Unauthorized. Server session invalid/expired. Redirecting to auth.`);
          // Redirect to sign-in page, optionally passing error and callback
          signIn(undefined, { callbackUrl: href, error: "SessionRequired" }); // Use error code if needed
        }
        // --- Handle other errors ---
        else {
            const errorText = await response.text().catch(() => 'Could not read error response.'); // Add catch for text()
            console.error(`API Error (${response.status}): Failed to update user division.`, errorText);
            // Show generic error to user
            alert(`Error: Could not select division. Server responded with status ${response.status}.`);
        }
        return; // Stop execution after handling error
      }

      // --- Success Case ---
      // API call was successful (status 2xx)
      const responseData = await response.json(); // Process successful response if needed
      console.log("User division updated successfully via API.", responseData);
      // Navigate the user to the selected game's page
      router.push(href);

    } catch (error) {
      // 6. Handle Network/Fetch Errors
      console.error("Network or other error during division update:", error);
      alert("Error: Could not connect to the server to select division.");
    }
  };

  // --- Card Content Structure (Ensure correct CSS Module class names) ---
  const cardContent = (
    <>
      <div className={styles.imageWrapper}>
         {comingSoon && <span className={styles.badge}>Coming Soon</span>}
        <Image
          src={imageUrl}
          alt={`${title} game banner`}
          fill
          // Make sure sizes reflect your LARGEST card display size (e.g., 41.25rem)
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 41.25rem"
          className={styles.image}
          priority={!comingSoon}
          unoptimized={imageUrl.includes('placeholder')} // Optional
        />
      </div>
      {/* Assumes .contentArea exists in your CSS Module for layout */}
      <div className={styles.contentArea}>
          <h3 className={styles.title}>{title}</h3>
          {comingSoon ? (
              <span className={styles.comingSoonText}>Coming Soon</span>
          ) : (
              <span className={styles.actionText}>Select Division</span>
          )}
      </div>
    </>
  );

  // Render div acting as button
  return (
    <div
      // Ensure CSS Module class names match your file
      className={`${styles.root} ${comingSoon ? styles.comingSoon : styles.interactive}`}
      onClick={!comingSoon ? handleClick : undefined}
      style={{ cursor: comingSoon ? 'default' : 'pointer' }}
      role={!comingSoon ? "button" : undefined}
      tabIndex={!comingSoon ? 0 : undefined}
      aria-disabled={comingSoon}
      aria-label={!comingSoon ? `Select ${title} Division` : `${title} (Coming Soon)`}
      onKeyDown={!comingSoon ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } } : undefined}
    >
      {/* Render the structured content */}
      {cardContent}
    </div>
  );
}