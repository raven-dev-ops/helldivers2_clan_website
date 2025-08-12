// src/app/(main)/helldivers-2/creators/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTwitch, FaCircle } from 'react-icons/fa';
import styles from './CreatorsPage.module.css'; // Import the CSS Module

// Define the structure for creator data fetched from *your* API route
interface CreatorData {
  channelName: string;
  displayName?: string;
  description?: string;
  profileImageUrl?: string;
  isLive: boolean;
}

// List of Twitch channel *names* used to initially populate the state
const initialTwitchChannelNames = [
  'mrswimson', 'charredviolet',
  'gingercynic', 'chappzs', 'thywizz', 'helldiver_black_snow',
];

export default function CreatorsPage() {
  const [creatorsData, setCreatorsData] = useState<CreatorData[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCreatorsFromApi = async () => {
      setIsLoadingPage(true);
      setPageError(null);
      try {
        const response = await fetch('/api/twitch/creators');
        if (!response.ok) {
          let errorMsg = `Failed to load creators (Status: ${response.status})`;
          try { const errorData = await response.json(); errorMsg = errorData.error || errorMsg; } catch (_) {}
          throw new Error(errorMsg);
        }
        const data: CreatorData[] = await response.json();
        if (isMounted) {
          // Order data based on initial list, filtering out any not found in API response
          const orderedData = initialTwitchChannelNames
            .map(name => data.find(d => d.channelName === name))
            .filter((d): d is CreatorData => !!d); // Type guard to remove undefined
          setCreatorsData(orderedData);
        }
      } catch (error: any) {
        console.error("Error fetching creators:", error);
        if (isMounted) {
          setPageError(error.message || "An unknown error occurred while fetching creator data.");
          setCreatorsData([]); // Clear data on error
        }
      } finally {
        if (isMounted) setIsLoadingPage(false);
      }
    };
    fetchCreatorsFromApi();
    return () => { isMounted = false; };
  }, []);

  // --- Twitch Embed Parent Domain ---
  // Ensure this is set in your .env.local or Vercel environment variables
  const twitchEmbedParent = process.env.NEXT_PUBLIC_TWITCH_EMBED_PARENT || (typeof window !== 'undefined' ? window.location.hostname : "localhost");
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_TWITCH_EMBED_PARENT && window.location.hostname !== 'localhost') {
    console.warn("NEXT_PUBLIC_TWITCH_EMBED_PARENT environment variable is not set. Twitch embeds may not work on deployed sites.");
  }

  return (
    // Use the page container class from the module
    <main className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>GPT HD2 Creators</h1>
      <p className={styles.pageSubtitle}>
        Discover or connect with content creators in the GPT community.
      </p>

      {isLoadingPage && (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Loading Creator Channels...</p>
        </div>
      )}

      {pageError && !isLoadingPage && (
         <div className={styles.errorContainer}>
             <p className={styles.errorTitle}>Error Loading Creators:</p>
             <p>{pageError}</p>
             <p className={styles.errorHint}>Please try refreshing the page or contact support if the issue persists.</p>
         </div>
      )}

      {!isLoadingPage && !pageError && creatorsData.length > 0 && (
        <div className={styles.creatorsGrid}>
          {creatorsData.map((creator) => (
            <div key={creator.channelName} className={styles.creatorCard}>
              <div className={styles.embedWrapper}>
                <iframe
                  src={`https://player.twitch.tv/?channel=${creator.channelName}&parent=${twitchEmbedParent}&muted=true&autoplay=false`}
                  height="100%" width="100%"
                  allowFullScreen={true} scrolling="no"
                  title={`${creator.displayName || creator.channelName}'s Twitch Stream`}
                  className={styles.twitchEmbed}
                  sandbox="allow-scripts allow-same-origin allow-popups" // Security sandbox
                ></iframe>
              </div>

              <div className={styles.infoSection}>
                <div className={styles.headerSection}>
                  <div className={styles.profileImageWrapper}>
                    {creator.profileImageUrl ? (
                      <Image
                        src={creator.profileImageUrl}
                        alt={`${creator.displayName || creator.channelName} profile picture`}
                        width={64} height={64}
                        className={styles.profileImage} // Use class from module
                        onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }} // Fallback placeholder
                        unoptimized // Good practice for external images not known at build time
                      />
                    ) : (
                      <div className={styles.profileImagePlaceholder}>
                        <FaTwitch className={styles.placeholderIcon} />
                      </div>
                    )}
                    {creator.isLive && (
                      <div className={styles.liveBadge}>
                        <FaCircle className={styles.liveDot} />
                        LIVE
                      </div>
                    )}
                  </div>
                  <div className={styles.channelInfo}>
                    <a href={`https://www.twitch.tv/${creator.channelName}`} target="_blank" rel="noopener noreferrer" className={styles.channelNameLink} title={creator.displayName || creator.channelName}>
                      {creator.displayName || creator.channelName}
                    </a>
                    <a href={`https://www.twitch.tv/${creator.channelName}`} target="_blank" rel="noopener noreferrer" className={styles.channelUrlLink} >
                         twitch.tv/{creator.channelName}
                     </a>
                  </div>
                </div>

                {creator.description ? (
                  <p className={styles.descriptionText}>
                    {creator.description}
                  </p>
                ) : (
                  <p className={styles.noDescriptionText}>No description available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoadingPage && !pageError && creatorsData.length === 0 && (
         <div className={styles.noCreatorsContainer}>
             <p className={styles.noCreatorsText}>No community creators found or configured.</p>
         </div>
      )}
    </main>
  );
}