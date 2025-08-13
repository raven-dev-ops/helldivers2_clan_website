// src/app/(main)/helldivers-2/ReviewsRotator.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './HelldiversPage.module.css';

export interface Review { id: number; author: string; title: string; text: string; rating: number; }

export default function ReviewsRotator({ reviews }: { reviews: Review[] }) {
  const [currentReviewStartIndex, setCurrentReviewStartIndex] = useState(0);
  const [isReviewVisible, setIsReviewVisible] = useState(true);

  useEffect(() => {
    if (reviews.length <= 3) return;
    const intervalId = setInterval(() => {
      setIsReviewVisible(false);
      setTimeout(() => {
        setCurrentReviewStartIndex((prevIndex) => (prevIndex + 3 >= reviews.length ? 0 : prevIndex + 3));
        setIsReviewVisible(true);
      }, 600);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [reviews.length]);

  const reviewsToShow = reviews.slice(currentReviewStartIndex, currentReviewStartIndex + 3);

  return (
    <div className={styles.reviewSectionContainer}>
      <div className={`${styles.reviewCardsWrapper} ${!isReviewVisible ? styles.reviewCardsWrapperHidden : ''}`}>
        {reviewsToShow.map((review) => (
          <div key={review.id} className={styles.individualReviewCard}>
            <div className={styles.reviewStars}>{Array.from({ length: review.rating }).map((_, i) => (<FaStar key={i} />))}</div>
            <h3 className={styles.reviewTitle}>{review.title}</h3>
            <p className={styles.reviewText}>"{review.text}"</p>
            <p className={styles.reviewAuthor}>- {review.author}</p>
          </div>
        ))}
        </div>
      </div>
    );
}