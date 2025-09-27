'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from '@/styles/Reviews.module.css';

export interface Review {
  id: number | string;
  author: string;
  title: string;
  text: string;
  rating: number; // 0–5
}

export default function ReviewsRotator({
  reviews,
  autoPlayMs = 6000,
  ariaLabel = 'Player reviews',
}: {
  reviews: Review[];
  autoPlayMs?: number;
  ariaLabel?: string;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const computeItemsPerPage = useCallback(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 0;
    if (w >= 1024) return 3; // desktop
    if (w >= 640) return 2;  // tablet
    return 1;                // mobile
  }, []);

  useEffect(() => {
    const update = () => setItemsPerPage(computeItemsPerPage());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [computeItemsPerPage]);

  const pages = useMemo(() => {
    const out: Review[][] = [];
    for (let i = 0; i < reviews.length; i += itemsPerPage) {
      out.push(reviews.slice(i, i + itemsPerPage));
    }
    return out;
  }, [reviews, itemsPerPage]);

  const totalPages = pages.length || 1;

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const goto = useCallback((idx: number) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const clamped = Math.max(0, Math.min(idx, totalPages - 1));
    setPage(clamped);
    vp.scrollTo({ left: clamped * vp.clientWidth, behavior: 'smooth' });
  }, [totalPages]);

  const prev = () => goto(page - 1);
  const next = () => goto(page + 1);

  // sync with manual scroll/drag
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const i = Math.round(vp.scrollLeft / vp.clientWidth);
        if (i !== page) setPage(i);
        ticking = false;
      });
    };
    vp.addEventListener('scroll', onScroll, { passive: true });
    return () => vp.removeEventListener('scroll', onScroll);
  }, [page]);

  // autoplay (pauses on hover, respects reduced motion)
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || autoPlayMs <= 0) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) return;

    let hover = false;
    const enter = () => (hover = true);
    const leave = () => (hover = false);
    vp.addEventListener('mouseenter', enter);
    vp.addEventListener('mouseleave', leave);

    const id = setInterval(() => {
      if (hover || totalPages <= 1) return;
      goto((page + 1) % totalPages);
    }, autoPlayMs);

    return () => {
      clearInterval(id);
      vp.removeEventListener('mouseenter', enter);
      vp.removeEventListener('mouseleave', leave);
    };
  }, [autoPlayMs, goto, page, totalPages]);

  const Stars = ({ n = 0 }: { n?: number }) => {
    const full = Math.max(0, Math.min(5, Math.round(n)));
    return (
      <div className={styles.reviewStars} aria-label={`${full} out of 5 stars`}>
        {Array.from({ length: full }).map((_, i) => <FaStar key={i} />)}
        {Array.from({ length: 5 - full }).map((_, i) => (
          <FaStar key={`m-${i}`} className={styles.starsMuted} />
        ))}
      </div>
    );
  };

  return (
    <section
      className={styles.reviewSectionContainer}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div
        className={`${styles.carouselViewport} ${styles.edgeFade}`}
        ref={viewportRef}
        aria-live="polite"
      >
        <div className={styles.carouselTrack}>
          {pages.map((group, gi) => (
            <div
              key={`page-${gi}`}
              className={styles.carouselPage}
              aria-roledescription="slide"
              aria-label={`Slide ${gi + 1} of ${totalPages}`}
            >
              {group.map((r) => (
                <article key={r.id} className={styles.individualReviewCard}>
                  <Stars n={r.rating} />
                  <h4 className={styles.reviewTitle}>{r.title}</h4>
                  <p className={styles.reviewText}>{r.text}</p>
                  <div className={styles.reviewAuthor}>— {r.author}</div>
                </article>
              ))}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navPrev}`}
              onClick={prev}
              aria-label="Previous reviews"
              disabled={page === 0}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navNext}`}
              onClick={next}
              aria-label="Next reviews"
              disabled={page === totalPages - 1}
            >
              ›
            </button>
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Review pages">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={page === i}
              aria-controls={`page-${i}`}
              className={`${styles.dot} ${page === i ? styles.dotActive : ''}`}
              onClick={() => goto(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
