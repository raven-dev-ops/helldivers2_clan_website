// src/app/(main)/helldivers-2/creators/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTwitch, FaCircle, FaYoutube } from 'react-icons/fa';
import styles from './CreatorsPage.module.css'; // Import the CSS Module
import { logger } from '@/lib/logger';
import base from '../HelldiversBase.module.css';

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
  'mrswimson',
  'helldiver_black_snow',
  'gingercynic',
  'chappzs',
  'darcyboy',
];

const youtubeCreators = [
  {
    name: 'GPT Fleet',
    channelId: 'UCp2w5Gz7kR5_2J4_2dJ4yZQ',
    youtubeHandle: '@gptfleet',
    description: 'Official GPT Fleet YouTube channel.',
  },
  {
    name: 'darincboy',
    channelId: 'UC5gW5-a0P9-xfx2HCH-pE5A',
    youtubeHandle: '@darincboy',
    description: 'Variety streamer with a focus on community and fun.',
  },
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
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch (_) {}
          throw new Error(errorMsg);
        }
        const data: CreatorData[] = await response.json();
        if (isMounted) {
          // Order data based on initial list, filtering out any not found in API response
          const orderedData = initialTwitchChannelNames
            .map((name) => data.find((d) => d.channelName === name))
            .filter((d): d is CreatorData => !!d); // Type guard to remove undefined
          setCreatorsData(orderedData);
        }
      } catch (error: any) {
        logger.error('Error fetching creators:', error);
        if (isMounted) {
          setPageError(
            error.message ||
              'An unknown error occurred while fetching creator data.'
          );
          setCreatorsData([]); // Clear data on error
        }
      } finally {
        if (isMounted) setIsLoadingPage(false);
      }
    };
    fetchCreatorsFromApi();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- Twitch Embed Parent Domain ---
  // Ensure this is set in your .env.local or Vercel environment variables
  const twitchEmbedParent =
    process.env.NEXT_PUBLIC_TWITCH_EMBED_PARENT ||
    (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
  if (
    typeof window !== 'undefined' &&
    !process.env.NEXT_PUBLIC_TWITCH_EMBED_PARENT &&
    window.location.hostname !== 'localhost'
  ) {
    logger.warn(
      'NEXT_PUBLIC_TWITCH_EMBED_PARENT environment variable is not set. Twitch embeds may not work on deployed sites.'
    );
  }

  const liveCreators = creatorsData.filter((c) => c.isLive);
  const featured = liveCreators[0] || null;
  const restCreators = creatorsData.filter(
    (c) => !featured || c.channelName !== featured.channelName
  );

  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />
      {/* Use the page container class from the module */}
      <main className={`${base.pageContainer} ${styles.pageContainer}`}>
        <div className={styles.titleCard}>
          <h1 className={styles.pageTitle}>GPT Streamers</h1>
          <p className={styles.pageSubtitle}>
            Discover and connect with our GPT-powered content creators in the
            HD2 community.
          </p>
        </div>

        {/* Twitch Section */}
        <h2 className={styles.pageTitle} style={{ fontSize: '1.5rem' }}>
          Twitch
        </h2>

        {isLoadingPage && (
          <div className={styles.loadingContainer}>
            <p className={styles.loadingText}>Loading Twitch Channels...</p>
          </div>
        )}

        {pageError && !isLoadingPage && (
          <div className={styles.errorContainer}>
            <p className={styles.errorTitle}>Error Loading Creators:</p>
            <p>{pageError}</p>
            <p className={styles.errorHint}>
              Please try refreshing the page or contact support if the issue
              persists.
            </p>
          </div>
        )}

        {!isLoadingPage && !pageError && creatorsData.length > 0 && (
          <>
            {/* Player profile card above featured embeds */}
            {featured && (
              <div className={styles.playerCard}>
                <div className={styles.playerCardHeader}>
                  <div className={styles.playerAvatar}>
                    {featured.profileImageUrl ? (
                      <Image
                        src={featured.profileImageUrl}
                        alt={`${featured.displayName || featured.channelName} avatar`}
                        width={56}
                        height={56}
                      />
                    ) : (
                      <FaTwitch />
                    )}
                  </div>
                  <div>
                    <div className={styles.playerName}>
                      {featured.displayName || featured.channelName}
                    </div>
                    <div className={styles.playerSubline}>
                      twitch.tv/{featured.channelName}
                    </div>
                  </div>
                </div>
                <div className={styles.playerActions}>
                  <a
                    href={`https://www.twitch.tv/${featured.channelName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.channelNameLink}
                  >
                    Watch on Twitch
                  </a>
                </div>
              </div>
            )}

            {/* Featured live stream with chat on desktop */}
            {featured && (
              <div className={styles.featuredContainer}>
                <div className={styles.featuredVideoCard}>
                  <div className={styles.featuredTitleBar}>
                    <div className={styles.featuredTitle}>
                      {featured.displayName || featured.channelName}
                    </div>
                    <a
                      href={`https://www.twitch.tv/${featured.channelName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Twitch"
                    >
                      <FaTwitch />
                    </a>
                  </div>
                  <div className={styles.featuredVideoWrapper}>
                    <iframe
                      src={`https://player.twitch.tv/?channel=${featured.channelName}&parent=${twitchEmbedParent}&muted=false&autoplay=true`}
                      height="100%"
                      width="100%"
                      allowFullScreen={true}
                      scrolling="no"
                      title={`${featured.displayName || featured.channelName}'s Twitch Stream`}
                      className={styles.twitchEmbed}
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    ></iframe>
                  </div>
                </div>
                <div className={styles.featuredChatCard}>
                  <div className={styles.featuredTitleBar}>
                    <div className={styles.featuredTitle}>Chat</div>
                  </div>
                  <iframe
                    src={`https://www.twitch.tv/embed/${featured.channelName}/chat?parent=${twitchEmbedParent}`}
                    height="100%"
                    width="100%"
                    title={`${featured.displayName || featured.channelName} Twitch Chat`}
                    style={{ border: 'none', display: 'block' }}
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Remaining creators in grid */}
            <div className={styles.creatorsGrid}>
              {restCreators.map((creator) => (
                <div key={creator.channelName} className={styles.creatorCard}>
                  <div className={styles.embedWrapper}>
                    <iframe
                      src={`https://player.twitch.tv/?channel=${creator.channelName}&parent=${twitchEmbedParent}&muted=true&autoplay=false`}
                      height="100%"
                      width="100%"
                      allowFullScreen={true}
                      scrolling="no"
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
                            width={64}
                            height={64}
                            className={styles.profileImage} // Use class from module
                            onError={(e) => {
                              (e.currentTarget as any).src =
                                '/images/placeholder.png';
                            }} // Fallback placeholder
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
                    {creator.description ? (
                      <p className={styles.descriptionText}>
                        {creator.description}
                      </p>
                    ) : (
                      <p className={styles.noDescriptionText}>
                        No description available.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Other Platforms Sections */}
        <div id="youtube" style={{ marginTop: '3rem' }}>
          <h2 className={styles.pageTitle} style={{ fontSize: '1.5rem' }}>
            YouTube
          </h2>
          <div className={styles.creatorsGrid}>
            {youtubeCreators.map((creator) => (
              <div key={creator.channelId} className={styles.creatorCard}>
                <div className={styles.embedWrapper}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/videoseries?list=${`UU${creator.channelId.slice(2)}`}&autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`}
                    title={`${creator.name} Latest Uploads`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.twitchEmbed}
                    referrerPolicy="strict-origin-when-cross-origin"
                  ></iframe>
                </div>
                <div className={styles.infoSection}>
                  <div className={styles.headerSection}>
                    <div className={styles.profileImagePlaceholder}>
                      <FaYoutube className={styles.placeholderIcon} />
                    </div>
                    <div className={styles.channelInfo}>
                      <a
                        href={`https://www.youtube.com/${creator.youtubeHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.channelNameLink}
                        title={creator.name}
                      >
                        {creator.name}
                      </a>
                      <a
                        href={`https://www.youtube.com/${creator.youtubeHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.channelUrlLink}
                      >
                        youtube.com/{creator.youtubeHandle}
                      </a>
                    </div>
                  </div>
                  <p className={styles.noDescriptionText}>
                    {creator.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
