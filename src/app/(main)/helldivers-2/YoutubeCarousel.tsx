// src/app/(main)/helldivers-2/YoutubeCarousel.tsx
"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import styles from './HelldiversPage.module.css';

export interface YoutubeVideo { id: string; embedUrl: string; }

export default function YoutubeCarousel({ videos }: { videos: YoutubeVideo[] }) {
  return (
    <div className={styles.youtubeCarouselContainer}>
      <Swiper
        modules={[Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={30}
        slidesPerView={1}
        navigation={true}
        loop={true}
        className="helldivers-youtube-swiper"
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id}>
            <div className={styles.youtubeSlide}>
              <iframe
                className={styles.youtubeIframe}
                src={video.embedUrl}
                title={`YouTube video player for ${video.id}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}