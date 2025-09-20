'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

import styles from './page.module.css';

import type { Route } from 'next';
import GameCard from '@/components/common/GameCard';
import ReviewsRotator from '@/components/home/ReviewsRotator';
import { reviews as helldiversReviews } from '@/components/home/reviews';

interface GameDivision {
  id: string;
  title: string;
  imageUrl: string;
  href: Route;
  comingSoon: boolean;
}

const gameDivisions: GameDivision[] = [
  {
    id: 'helldivers2',
    title: 'Helldivers 2',
    imageUrl: '/images/helldivers2-select-card.jpg',
    href: '/helldivers-2' as Route,
    comingSoon: false,
  },
  {
    id: 'dune',
    title: 'Dune: Awakening',
    imageUrl: '/images/dune-awakening-select-card.jpg',
    href: '/dune-awakening' as Route,
    comingSoon: true,
  },
  {
    id: 'future0',
    title: 'Vote August 2025',
    imageUrl: '/images/placeholder-select-card.jpg',
    href: '/future0' as Route,
    comingSoon: true,
  },
  {
    id: 'future1',
    title: 'Vote February 2026',
    imageUrl: '/images/placeholder-select-card.jpg',
    href: '/future1' as Route,
    comingSoon: true,
  },
  {
    id: 'future2',
    title: 'Vote August 2026',
    imageUrl: '/images/placeholder-select-card.jpg',
    href: '/future2' as Route,
    comingSoon: true,
  },
];

export default function Home() {
  return (
    <>
      {/* Carousel Section */}
      <section className={styles.section} aria-label="Choose a division">
        <h2 className={styles.sectionTitle}>Select a Division</h2>

        <div className={styles.carouselContainer}>
          <Swiper
            modules={[Navigation, EffectCoverflow, A11y]}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop={gameDivisions.length > 4}
            slidesPerView="auto"
            spaceBetween={-50}
            coverflowEffect={{
              rotate: 20,
              stretch: -100,
              depth: 250,
              modifier: 1,
              scale: 0.6,
              slideShadows: false,
            }}
            navigation
            a11y={{ prevSlideMessage: 'Previous', nextSlideMessage: 'Next' }}
          >
            {gameDivisions.map((game) => (
              <SwiperSlide key={game.id}>
                <GameCard
                  title={game.title}
                  imageUrl={game.imageUrl}
                  href={game.href}
                  comingSoon={game.comingSoon}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Reviews */}
      <section className={styles.section} aria-label="Community Reviews">
        <h2 className={styles.sectionTitle}>What Players Say</h2>
        <ReviewsRotator reviews={helldiversReviews} />
      </section>
    </>
  );
}
