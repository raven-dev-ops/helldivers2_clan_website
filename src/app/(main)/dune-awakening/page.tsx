"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaDiscord, FaStar } from 'react-icons/fa';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from 'swiper/modules';

import styles from './DunePage.module.css'; // ✅ CSS MODULE
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// ✅ INLINE styles only for dynamic bits
const inlineStyles = {
  youtubeSlide: {
    backgroundColor: '#111',
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
  } as React.CSSProperties,

  youtubeIframe: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%', border: 'none',
  } as React.CSSProperties,

  classHeaderHover: {
    backgroundColor: 'var(--color-surface-hover, #374151)',
  } as React.CSSProperties,

  expandIcon: {
    fontSize: '1.2rem',
    color: 'var(--color-text-secondary, #b0b0b0)',
    transition: 'transform 0.3s ease',
  } as React.CSSProperties,

  expandIconRotated: {
    transform: 'rotate(180deg)',
  } as React.CSSProperties,
};

// ✅ Dummy data for YouTube videos and reviews
const youtubeVideos = [
  { id: 'trailer1', embedUrl: 'https://www.youtube.com/embed/plw2gxf7Coc' },
  { id: 'gameplay', embedUrl: 'https://www.youtube.com/embed/r8lxVDqoHLQ' },
];

const reviews = [
  { id: 1, author: "ArrakisExplorer", title: "Promising Survival", text: "Managing water & avoiding worms looks intense!", rating: 5 },
  { id: 2, author: "SpiceTrader88", title: "Deep Faction Play", text: "House politics could be huge if done right.", rating: 4 },
  { id: 3, author: "SandWalker", title: "Arrakis Looks Stunning", text: "Storms and desert scale look perfect.", rating: 5 },
];

// ✅ Replace with your actual data
const duneClasses: any[] = []; // Shortened for brevity

export default function DuneAwakeningPage() {
  const discordServerLink = "https://discord.gg/QjxHdhmfc6";
  const reviewSourceLink = "YOUR_DISBOARD_LINK_HERE";

  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});
  const [discordIconHover, setDiscordIconHover] = useState(false);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);
  const [currentReviewStartIndex, setCurrentReviewStartIndex] = useState(0);
  const [isReviewVisible, setIsReviewVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleClassExpansion = (classId: string) => {
    setExpandedClasses(prev => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  useEffect(() => {
    if (reviews.length <= 3) return;
    const intervalId = setInterval(() => {
      setIsReviewVisible(false);
      setTimeout(() => {
        setCurrentReviewStartIndex((prev) => (prev + 3 >= reviews.length ? 0 : prev + 3));
        setIsReviewVisible(true);
      }, 600);
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const reviewWrapperClass = `${styles.reviewCardsWrapper} ${!isReviewVisible ? styles.reviewCardsWrapperHidden : ''}`;
  const reviewsToShow = reviews.slice(currentReviewStartIndex, currentReviewStartIndex + 3);

  return (
    <div className={styles.pageContainer}>

      {/* Intro */}
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>
          About GPT Dune: Awakening
          <Link
            href={discordServerLink}
            className={styles.discordIconLink}
            onMouseEnter={() => setDiscordIconHover(true)}
            onMouseLeave={() => setDiscordIconHover(false)}
            aria-label="Join Discord"
            title="Join Discord"
          >
            <FaDiscord className={styles.discordIcon} />
          </Link>
        </h1>
        <p className={styles.paragraph}>Welcome to Arrakis. Survive, thrive, and trade spice fairly.</p>
      </section>

      {/* YouTube Carousel */}
      <div className={styles.youtubeCarouselContainer}>
        <Swiper
          modules={[Navigation, EffectFade]}
          effect="fade"
          navigation loop
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {youtubeVideos.map((video, i) => (
            <SwiperSlide key={video.id}>
              <div style={inlineStyles.youtubeSlide}>
                {i === activeIndex && (
                  <iframe
                    style={inlineStyles.youtubeIframe}
                    src={video.embedUrl}
                    title={`YouTube ${video.id}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Example Class Section */}
      {duneClasses.map(dc => {
        const isExpanded = !!expandedClasses[dc.id];
        const isHovered = hoveredClass === dc.id;
        return (
          <div key={dc.id} className={styles.classSection}>
            <div
              className={styles.classHeader}
              style={isHovered ? inlineStyles.classHeaderHover : undefined}
              onClick={() => toggleClassExpansion(dc.id)}
              onMouseEnter={() => setHoveredClass(dc.id)}
              onMouseLeave={() => setHoveredClass(null)}
              role="button"
              aria-expanded={isExpanded}
              tabIndex={0}
            >
              <h2 className={styles.classTitle}>{dc.name}</h2>
              <p className={styles.classSummary}>{dc.summary}</p>
              {isExpanded
                ? <FaChevronUp style={{ ...inlineStyles.expandIcon, ...inlineStyles.expandIconRotated }} />
                : <FaChevronDown style={inlineStyles.expandIcon} />}
            </div>
            <div className={`${styles.collapsibleContent} ${isExpanded ? styles.collapsibleContentExpanded : ''}`}>
              {/* Insert your expanded content here */}
            </div>
          </div>
        );
      })}

      {/* Reviews */}
      <div className={styles.reviewSectionContainer}>
        <div className={reviewWrapperClass}>
          {reviewsToShow.map(r => (
            <div key={r.id} className={styles.individualReviewCard}>
              <div className={styles.reviewStars}>
                {Array.from({ length: r.rating }).map((_, i) => <FaStar key={i} />)}
                {Array.from({ length: 5 - r.rating }).map((_, i) => <FaStar key={`e-${i}`} style={{ opacity: 0.3 }} />)}
              </div>
              <h3 className={styles.reviewTitle}>{r.title}</h3>
              <p className={styles.reviewText}>"{r.text}"</p>
              <p className={styles.reviewAuthor}>- {r.author}</p>
            </div>
          ))}
        </div>
        {reviewSourceLink && reviewSourceLink !== "YOUR_DISBOARD_LINK_HERE" ? (
          <Link href={reviewSourceLink} className={styles.disboardLinkBottom} target="_blank">Read More on Disboard</Link>
        ) : (
          <p className={styles.paragraph} style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Reviews powered by Disboard (link coming soon!)
          </p>
        )}
      </div>

    </div>
  );
}
