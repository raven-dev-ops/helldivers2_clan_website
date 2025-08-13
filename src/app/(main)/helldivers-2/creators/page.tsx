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

// Lightweight stats type
interface CreatorStats {
  kills?: number;
  accuracy?: string;
  deaths?: number;
}

// List of Twitch channel *names* used to initially populate the state
const initialTwitchChannelNames = [
  'mrswimson', 'charredviolet', 'helldiver_black_snow',
  'javy1402', 'gingercynic', 'chappzs', 'thywizz',
];

export default function CreatorsPage() {
  const [creatorsData, setCreatorsData] = useState<CreatorData[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  // Lightweight leaderboard stats for featured profile card
  const [featuredStats, setFeaturedStats] = useState<CreatorStats | null>(null);
  // Per-creator stats map
  const [creatorStats, setCreatorStats] = useState<Record<string, CreatorStats>>({});

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

  const liveCreators = creatorsData.filter(c => c.isLive);
  const featured = liveCreators[0] || null;
  const restCreators = creatorsData.filter(c => !featured || c.channelName !== featured.channelName);

  // Fetch minimal leaderboard stats for featured creator (client-side for now)
  useEffect(() => {
    let isCancelled = false;
    async function fetchFeaturedStats() {
      if (!featured) { setFeaturedStats(null); return; }
      try {
        const now = new Date();
        const params = new URLSearchParams({ sortBy: 'Kills', sortDir: 'desc', limit: '100', scope: 'month', month: String(now.getUTCMonth() + 1), year: String(now.getUTCFullYear()) });
        const res = await fetch(`/api/helldivers/leaderboard?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Leaderboard fetch failed: ${res.status}`);
        const payload = await res.json();
        const rows: any[] = payload?.results || [];
        const match = rows.find(r => (r.player_name || '').toLowerCase() === (featured.displayName || featured.channelName).toLowerCase());
        if (!isCancelled) {
          setFeaturedStats(match ? { kills: Number(match.Kills) || 0, accuracy: String(match.Accuracy) || '', deaths: Number(match.Deaths) || 0 } : null);
        }
      } catch (_e) {
        if (!isCancelled) setFeaturedStats(null);
      }
    }
    fetchFeaturedStats();
    return () => { isCancelled = true; };
  }, [featured]);

  // Fetch stats for all creators displayed in grid (best-effort)
  useEffect(() => {
    let isCancelled = false;
    async function fetchAllStats() {
      try {
        const now = new Date();
        const params = new URLSearchParams({ sortBy: 'Kills', sortDir: 'desc', limit: '1000', scope: 'month', month: String(now.getUTCMonth() + 1), year: String(now.getUTCFullYear()) });
        const res = await fetch(`/api/helldivers/leaderboard?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Leaderboard fetch failed: ${res.status}`);
        const payload = await res.json();
        const rows: any[] = payload?.results || [];
        const map: Record<string, CreatorStats> = {};
        creatorsData.forEach((creator) => {
          const key = creator.displayName || creator.channelName;
          const match = rows.find(r => (r.player_name || '').toLowerCase() === key.toLowerCase());
          if (match) {
            map[creator.channelName] = {
              kills: Number(match.Kills) || 0,
              accuracy: String(match.Accuracy) || '',
              deaths: Number(match.Deaths) || 0,
            };
          }
        });
        if (!isCancelled) setCreatorStats(map);
      } catch (_e) {
        if (!isCancelled) setCreatorStats({});
      }
    }
    if (creatorsData.length) fetchAllStats();
    return () => { isCancelled = true; };
  }, [creatorsData]);

  return (
    // Use the page container class from the module
    <main className={styles.pageContainer}>
      <div className={styles.titleCard}>
        <h1 className={styles.pageTitle}>GPT HD2 Streamers</h1>
        <p className={styles.pageSubtitle}>
          Discover or connect with content creators in the GPT community. You must be an Officer to join the stream team, check out the Academy &gt; Applications and apply with your interest.
        </p>
      </div>

      {/* Twitch Section */}
      <h2 className={styles.pageTitle} style={{ fontSize: '1.5rem' }}>Twitch</h2>

      {isLoadingPage && (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Loading Twitch Channels...</p>
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
        <>
          {/* Player profile card above featured embeds */}
          {featured && (
            <div className={styles.playerCard}>
              <div className={styles.playerCardHeader}>
                <div className={styles.playerAvatar}>
                  {featured.profileImageUrl ? (
                    <Image src={featured.profileImageUrl} alt={`${featured.displayName || featured.channelName} avatar`} width={56} height={56} unoptimized />
                  ) : (
                    <FaTwitch />
                  )}
                </div>
                <div>
                  <div className={styles.playerName}>{featured.displayName || featured.channelName}</div>
                  <div className={styles.playerSubline}>twitch.tv/{featured.channelName}</div>
                </div>
              </div>
              <div className={styles.playerStats}>
                <div className={styles.playerStat}>Kills: {featuredStats?.kills ?? '—'}</div>
                <div className={styles.playerStat}>Accuracy: {featuredStats?.accuracy ?? '—'}</div>
                <div className={styles.playerStat}>Deaths: {featuredStats?.deaths ?? '—'}</div>
              </div>
              <div className={styles.playerActions}>
                <a href={`https://www.twitch.tv/${featured.channelName}`} target="_blank" rel="noopener noreferrer" className={styles.channelNameLink}>
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
                  <div className={styles.featuredTitle}>{featured.displayName || featured.channelName}</div>
                  <a href={`https://www.twitch.tv/${featured.channelName}`} target="_blank" rel="noopener noreferrer" aria-label="Open Twitch">
                    <FaTwitch />
                  </a>
                </div>
                <div className={styles.featuredVideoWrapper}>
                  <iframe
                    src={`https://player.twitch.tv/?channel=${featured.channelName}&parent=${twitchEmbedParent}&muted=false&autoplay=true`}
                    height="100%" width="100%"
                    allowFullScreen={true} scrolling="no"
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
                  height="100%" width="100%"
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
                          onError={(e) => { (e.currentTarget as any).src = '/images/placeholder.png'; }} // Fallback placeholder
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

                  {/* Inline stats row per creator if available */}
                  <div className={styles.playerStats}>
                    <div className={styles.playerStat}>Kills: {creatorStats[creator.channelName]?.kills ?? '—'}</div>
                    <div className={styles.playerStat}>Accuracy: {creatorStats[creator.channelName]?.accuracy ?? '—'}</div>
                    <div className={styles.playerStat}>Deaths: {creatorStats[creator.channelName]?.deaths ?? '—'}</div>
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
        </>
      )}

      {/* Other Platforms Sections */}
      <div style={{ marginTop: '3rem' }}>
        <h2 className={styles.pageTitle} style={{ fontSize: '1.5rem' }}>YouTube</h2>
        <p className={styles.pageSubtitle}>Coming soon.</p>
        <div className={styles.creatorsGrid}>
          <div className={styles.creatorCard} style={{ opacity: 0.6 }}>
            <div className={styles.embedWrapper} />
            <div className={styles.infoSection}>
              <div className={styles.headerSection}>
                <div className={styles.profileImagePlaceholder} />
                <div className={styles.channelInfo}>
                  <div className={styles.channelNameLink}>YouTube</div>
                  <div className={styles.channelUrlLink}>Integration not available yet</div>
                </div>
              </div>
              <p className={styles.noDescriptionText}>Platform integration is not available yet.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 className={styles.pageTitle} style={{ fontSize: '1.5rem' }}>TikTok</h2>
        <p className={styles.pageSubtitle}>Coming soon.</p>
      </div>

    </main>
  );
}