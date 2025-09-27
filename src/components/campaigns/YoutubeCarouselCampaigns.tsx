'use client';

import React, { useMemo } from 'react';
import YoutubeCarousel, { YoutubeVideo } from '../home/YoutubeCarousel';
import styles from '@/styles/YoutubeCarouselCampaign.module.css';

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    // youtu.be/<id>
    if (host.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim();
      return id || null;
    }

    // youtube.com variations
    if (host.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/watch')) {
        return parsed.searchParams.get('v');
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/').pop() || null;
      }
      const shortsIdx = parsed.pathname.indexOf('/shorts/');
      if (shortsIdx >= 0) {
        return parsed.pathname.split('/').pop() || null;
      }
    }
  } catch {
    // ignore and fall through
  }
  return null;
}

function toEmbedUrl(url: string): { id: string; embedUrl: string } | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return { id, embedUrl: `https://www.youtube.com/embed/${id}?rel=0` };
}

export default function YoutubeCarouselCampaigns({
  videoUrls,
  title,
}: {
  videoUrls?: string[];
  title?: string;
}) {
  const videos: YoutubeVideo[] = useMemo(() => {
    if (!videoUrls || videoUrls.length === 0) return [];
    return videoUrls
      .map(toEmbedUrl)
      .filter((v): v is { id: string; embedUrl: string } => Boolean(v))
      .map((v) => ({ id: v.id, embedUrl: v.embedUrl }));
  }, [videoUrls]);

  if (!videos.length) {
    return (
      <div
        className={styles.youtubePlaceholder}
        role="note"
        aria-label="YouTube videos placeholder"
      >
        <div className={styles.youtubePlaceholderTitle}>No videos yet</div>
        <p className={styles.youtubePlaceholderText}>
          Add YouTube links to this campaign to show a carousel. Edit the
          <span> videoUrls </span>
          field for this campaign in the page data
          {title ? ` (${title})` : ''}.
        </p>
      </div>
    );
  }

  return <YoutubeCarousel videos={videos} />;
}
