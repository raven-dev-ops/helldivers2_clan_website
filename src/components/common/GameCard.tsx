// src/components/common/GameCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./GameCard.module.css";

interface GameCardProps {
  title: string;
  imageUrl?: string;
  comingSoon?: boolean;
  link?: string;
}

export default function GameCard({
  title,
  imageUrl = "/images/placeholder.png",
  comingSoon = false,
  link = "#",
}: GameCardProps) {
  return (
    <div className={`${styles.root} ${comingSoon ? styles.comingSoon : ""}`}>
      <div className={styles.badge}>
        {comingSoon ? "Coming Soon" : "Live"}
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className={styles.image}
          unoptimized
        />
      </div>

      <h3 className={styles.title}>{title}</h3>

      {!comingSoon ? (
        <Link href={link} className={styles.button}>
          Explore
        </Link>
      ) : (
        <span className={styles.comingSoonText}>Coming Soon</span>
      )}
    </div>
  );
}
