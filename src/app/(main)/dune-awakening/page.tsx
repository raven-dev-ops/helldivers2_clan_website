"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaDiscord, FaStar } from 'react-icons/fa';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from 'swiper/modules';

import styles from './DunePage.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// ✅ Inline dynamic styles
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

// ✅ Classes, videos, reviews, final tips
interface Ability { name: string; description: string; details?: string; }
interface EquipmentCategory { category: string; description: string; }
interface DuneClass {
  id: string;
  name: string;
  summary: string;
  lore: string;
  abilities: Ability[];
  combatStyleSolo: string;
  combatStyleGroup: string;
  pveStrategies: string;
  pvpStrategies: string;
  equipment: EquipmentCategory[];
  pros: string[];
  cons: string[];
  recommendedFor: string;
}

const duneClasses: DuneClass[] = [
  {
    id: 'swordmaster',
    name: 'Swordmaster',
    summary: 'Elite Ginaz warrior excelling in melee combat and tanking.',
    lore: 'Elite warriors from the Ginaz School...',
    abilities: [
      { name: 'Deflection', description: 'Blocks projectiles.', details: 'Acts as a shield.' },
    ],
    combatStyleSolo: 'Durable frontline fighters.',
    combatStyleGroup: 'Acts as tank or initiator.',
    pveStrategies: 'Use Deflection, close gaps.',
    pvpStrategies: 'Close distance under fire.',
    equipment: [
      { category: 'Weapons', description: 'Swords, crysknives.' },
      { category: 'Armor', description: 'Heavy armor with shield belt.' },
    ],
    pros: ['High survivability', 'Strong melee'],
    cons: ['Limited range'],
    recommendedFor: 'Players who enjoy tank/warrior roles.',
  },
  // ➜ Add other classes (Bene Gesserit, Mentat, Trooper, Planetologist) fully
];

const youtubeVideos = [
  { id: 'DuneAwakeningTrailer1', embedUrl: 'https://www.youtube.com/embed/plw2gxf7Coc?si=6jvS0yPyjY39Hyww' },
  { id: 'DuneGameplayReveal', embedUrl: 'https://www.youtube.com/embed/r8lxVDqoHLQ?si=OmYVnWHeEmKv4EPL' },
  { id: 'DuneSurvivalMechanics', embedUrl: 'https://www.youtube.com/embed/UA4Q8dTuIio?si=aN77qr5ihaBplfnu' },
];

interface Review { id: number; author: string; title: string; text: string; rating: number; }
const reviews: Review[] = [
  { id: 1, author: "ArrakisExplorer", title: "Promising Survival Mechanics", text: "Managing water and avoiding worms looks intense!", rating: 5 },
  { id: 2, author: "SpiceTrader88", title: "Deep Faction Play", text: "House politics could be huge.", rating: 4 },
  { id: 3, author: "SandWalker", title: "Arrakis Looks Stunning", text: "Storms and desert scale look perfect.", rating: 5 },
];

const finalTips = `All classes can learn other skills over time... Adapt, experiment, and remember: the slow blade penetrates the shield.`;

// ✅ Component
export default function DuneAwakeningPage() {
  const discordServerLink = "https://discord.gg/QjxHdhmfc6";
  const reviewSourceLink = "YOUR_DISBOARD_LINK_HERE";

  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});
  const [discordIconHover, setDiscordIconHover] = useState(false);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);
  const [currentReviewStartIndex, setCurrentReviewStartIndex] = useState(0);
  const [isReviewVisible, setIsReviewVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleClassExpansion = (id: string) => {
    setExpandedClasses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (reviews.length <= 3) return;
    const intervalId = setInterval(() => {
      setIsReviewVisible(false);
      setTimeout(() => {
        setCurrentReviewStartIndex(prev => (prev + 3 >= reviews.length ? 0 : prev + 3));
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
          >
            <FaDiscord className={styles.discordIcon} />
          </Link>
        </h1>
        <p className={styles.paragraph}>Welcome, adventurer, to the harsh deserts of Arrakis. Survive and adapt!</p>
      </section>

      {/* YouTube Carousel */}
      <div className={styles.youtubeCarouselContainer}>
        <Swiper modules={[Navigation, EffectFade]} effect="fade" navigation loop onSlideChange={swiper => setActiveIndex(swiper.realIndex)}>
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

      {/* Classes */}
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
              <h3 className={styles.subHeading}>Lore</h3>
              <p className={styles.paragraph}>{dc.lore}</p>
              <h3 className={styles.subHeading}>Abilities</h3>
              <ul className={styles.contentList}>
                {dc.abilities.map((a, i) => (
                  <li key={i} className={styles.listItem}>
                    <span className={styles.abilityName}>{a.name}:</span> {a.description} {a.details && <span>{a.details}</span>}
                  </li>
                ))}
              </ul>
              {/* Add other sections: combat, equipment, pros/cons */}
            </div>
          </div>
        );
      })}

      {/* Final Tips */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Final Tips</h2>
        <p className={styles.paragraph}>{finalTips}</p>
      </section>

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
        {reviewSourceLink !== "YOUR_DISBOARD_LINK_HERE" ? (
          <Link href={reviewSourceLink} className={styles.disboardLinkBottom} target="_blank">Read More on Disboard</Link>
        ) : (
          <p className={styles.paragraph} style={{ textAlign: 'center', fontSize: '0.9rem' }}>Reviews powered by Disboard (link coming soon!)</p>
        )}
      </div>

    </div>
  );
}
