// src/app/(main)/helldivers-2/creators/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Using Next.js Image for optimization
import { FaTwitch, FaCircle } from 'react-icons/fa'; // Icons
import styles from './CreatorsPage.module.css'; // Import CSS Module

// Define the structure for creator data fetched from *your* API route
interface CreatorData {
  channelName: string;
  displayName?: string;
  description?: string;
  profileImageUrl?: string;
  isLive: boolean;
}

// List of Twitch channel *names* used to initially populate the state
// Your backend API route should ideally fetch based on this or a dynamic source
const initialTwitchChannelNames = [
  'galacticphantomtaskforce',
  'kevindanilooo',
  'mrswimson',
  'charredviolet',
  'javy1402',
  'gingercynic',
  'chappzs',
];

export default function CreatorsPage() {
  // State to hold the creator data fetched from the API route
  const [creatorsData, setCreatorsData] = useState<CreatorData[]>([]);
  // State for overall page loading status
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // State for page-level errors (e.g., API route failure)
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCreatorsFromApi = async () => {
      setIsLoadingPage(true);
      setPageError(null);

      try {
        const response = await fetch('/api/twitch/creators'); // Fetch from your API route

        if (!response.ok) {
          let errorMsg = `Failed to load creators (Status: ${response.status})`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch (_) { /* Ignore if response body is not JSON */ }
          throw new Error(errorMsg);
        }

        const data: CreatorData[] = await response.json();

        if (isMounted) {
          const orderedData = initialTwitchChannelNames
            .map(name => data.find(d => d.channelName === name))
            .filter((d): d is CreatorData => !!d);
          setCreatorsData(orderedData);
        }
      } catch (error: any) {
        console.error("Error fetching creators:", error);
        if (isMounted) {
          setPageError(error.message || "An unknown error occurred while fetching creator data.");
          setCreatorsData([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPage(false);
        }
      }
    };

    fetchCreatorsFromApi();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- Twitch Embed Parent Domain ---
  const twitchEmbedParent = process.env.NEXT_PUBLIC_TWITCH_EMBED_PARENT || "localhost";
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_TWITCH_EMBED_PARENT && window.location.hostname !== 'localhost') {
    console.warn("NEXT_PUBLIC_TWITCH_EMBED_PARENT environment variable is not set. Twitch embeds may not work on deployed sites.");
  }

  return (
    <main className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Community Creators</h1>
      <p className={styles.pageSubtitle}>
        Discover or connect with content creators in the GPT community.
      </p>

      {/* Loading State */}
      {isLoadingPage && (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Loading Creator Channels...</p>
          {/* Add a spinner CSS animation if desired */}
        </div>
      )}

      {/* Error State */}
      {pageError && !isLoadingPage && (
         <div className={styles.errorContainer}>
             <p className={styles.errorTitle}>Error Loading Creators:</p>
             <p>{pageError}</p>
             <p className={styles.errorHint}>Please try refreshing the page or contact support if the issue persists.</p>
         </div>
      )}

       {/* Creator Cards Display */}
      {!isLoadingPage && !pageError && creatorsData.length > 0 && (
        <div className={styles.creatorsGrid}>
          {creatorsData.map((creator) => (
            <div key={creator.channelName} className={styles.creatorCard}>
              {/* Twitch Embed */}
              <div className={styles.embedWrapper}>
                <iframe
                  src={`https://player.twitch.tv/?channel=${creator.channelName}&parent=${twitchEmbedParent}&muted=true&autoplay=false`}
                  height="100%"
                  width="100%"
                  allowFullScreen={true}
                  scrolling="no"
                  title={`${creator.displayName || creator.channelName}'s Twitch Stream`}
                  className={styles.twitchEmbed}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                ></iframe>
              </div>

              {/* Channel Info Section */}
              <div className={styles.infoSection}>
                <div className={styles.headerSection}>
                  {/* Profile Image and Live Badge */}
                  <div className={styles.profileImageWrapper}>
                    {creator.profileImageUrl ? (
                      <Image
                        src={creator.profileImageUrl}
                        alt={`${creator.displayName || creator.channelName} profile picture`}
                        width={64}
                        height={64}
                        className={styles.profileImage}
                      />
                    ) : (
                      <div className={styles.profileImagePlaceholder}>
                        <FaTwitch className={styles.placeholderIcon} />
                      </div>
                    )}
                    {/* LIVE Badge */}
                    {creator.isLive && (
                      <div className={styles.liveBadge}>
                        <FaCircle className={styles.liveDot} />
                        LIVE
                      </div>
                    )}
                  </div>
                  {/* Channel Name and Link */}
                  <div className={styles.channelInfo}>
                    <a
                      href={`https://www.twitch.tv/${creator.channelName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.channelNameLink}
                      title={creator.displayName || creator.channelName}
                    >
                      {creator.displayName || creator.channelName}
                    </a>
                    <a
                        href={`https://www.twitch.tv/${creator.channelName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.channelUrlLink}
                     >
                         twitch.tv/{creator.channelName}
                     </a>
                  </div>
                </div>

                {/* Description */}
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

      {/* No Creators Found Message */}
      {!isLoadingPage && !pageError && creatorsData.length === 0 && (
         <div className={styles.noCreatorsContainer}>
             <p className={styles.noCreatorsText}>No community creators found or configured.</p>
         </div>
      )}
    </main>
  );
}