// src/app/page.tsx
import GameCard from "@/components/common/GameCard";
import Link from "next/link";
import {
  FaDiscord,
  FaTwitch,
  FaTrophy,
  FaUsers,
  FaCode,
  FaStream,
} from "react-icons/fa";
import styles from "./page.module.css";

const HeroSection = () => (
  <div className={styles.heroSection}>
    <div className={styles.heroOverlay} />
    <div className={styles.heroContent}>
      <h1 className={styles.heroTitle}>Galactic Phantom Division</h1>
      <p className={styles.heroSubtitle}>
        The Zero Point for the Galaxy’s Elite. Forge your legend, conquer the
        stars.
      </p>
      <Link href="/divisions" className={styles.heroLink}>
        Embark on Your Mission
      </Link>
    </div>
  </div>
);

const GameCarousel = () => (
  <section id="games" className={styles.section}>
    <h2 className={styles.sectionTitle}>Deploy to Your Chosen Division</h2>
    <div className={styles.carouselContainer}>
      <div className={styles.carouselInner}>
        <GameCard
          title="Helldivers 2: Liberate the Galaxy"
          imageUrl="https://mir-s3-cdn-cf.behance.net/project_modules/fs/267488191720439.65d03f0f43c2a.jpg"
          link="/games/helldivers-2"
        />
        <GameCard
          title="Dune: Awakening – Arrakis Awaits"
          imageUrl="https://visitarrakis.com/wp-content/uploads/2024/08/nggallery_import/DA_KA_Desktop_1920x1200.jpg"
          comingSoon
        />
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section className={styles.aboutSection}>
    <div className={styles.aboutContainer}>
      <h2 className={styles.aboutTitle}>Unleash Your Potential</h2>
      <p className={styles.aboutText}>
        From the legendary GPT Fleet, where legends are forged, to the Galactic
        Phantom Division, we empower every Helldiver.
      </p>
      <p className={styles.aboutText}>
        Join the ranks where Kevindanilooo, the first 1 Million Career Kill
        Helldiver, made his mark.
      </p>
      <p className={styles.aboutText}>
        We offer more than a clan; we offer a legacy. Experience cutting-edge
        Discord bots, Spartan-style training, and a community that values your
        story.
      </p>
      <Link href="/about" className={styles.aboutLink}>
        Discover Our Story
      </Link>
    </div>
  </section>
);

const CommunityHighlights = () => (
  <section className={styles.highlightSection}>
    <h2 className={styles.sectionTitle}>Community Highlights</h2>
    <div className={styles.grid3}>
      {[
        {
          icon: <FaDiscord className={styles.cardIcon} />,
          title: "Active Discord",
          text:
            "Engage with fellow Helldivers in real-time. Share strategies, form squads, and stay updated.",
          link: "/discord",
          linkText: "Join Discord",
        },
        {
          icon: <FaTwitch className={styles.cardIcon} />,
          title: "Twitch Streams",
          text:
            "Witness the skill and camaraderie of our elite Helldivers live on Twitch.",
          link: "/twitch",
          linkText: "Watch Streams",
        },
        {
          icon: <FaTrophy className={styles.cardIcon} />,
          title: "Leaderboards",
          text:
            "Prove your worth and climb the ranks on our community leaderboards.",
          link: "/leaderboard",
          linkText: "View Leaderboards",
        },
      ].map(({ icon, title, text, link, linkText }) => (
        <div key={title} className={styles.card}>
          {icon}
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardText}>{text}</p>
          <Link href={link} className={styles.cardLink}>
            {linkText}
          </Link>
        </div>
      ))}
    </div>
  </section>
);

const AdditionalFeatures = () => (
  <section className={styles.highlightSection}>
    <h2 className={styles.sectionTitle}>More From Our Community</h2>
    <div className={styles.grid3}>
      {[
        {
          icon: <FaUsers className={styles.cardIcon} />,
          title: "Dedicated Community",
          text:
            "Join a thriving community of passionate Helldivers. Find squads, share tips, and build lasting friendships.",
        },
        {
          icon: <FaCode className={styles.cardIcon} />,
          title: "Custom Discord Bots",
          text:
            "Experience unique Discord bots designed to enhance your gameplay and community interaction.",
        },
        {
          icon: <FaStream className={styles.cardIcon} />,
          title: "Streaming Team",
          text:
            "Support our rising star Twitch streamers and join their journey to galactic fame.",
        },
      ].map(({ icon, title, text }) => (
        <div key={title} className={styles.card}>
          {icon}
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardText}>{text}</p>
        </div>
      ))}
    </div>
  </section>
);

export default function Home() {
  return (
    <div>
      <HeroSection />
      <GameCarousel />
      <AboutSection />
      <CommunityHighlights />
      <AdditionalFeatures />
    </div>
  );
}
