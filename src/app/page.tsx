// src/app/page.tsx

import GameCard from "@/components/common/GameCard";
import Link from "next/link";
import { FaDiscord, FaTwitch, FaTrophy, FaUsers, FaCode, FaStream } from "react-icons/fa";

const HeroSection = () => (
  <div className="relative min-h-[80vh] flex flex-col justify-center items-center text-center text-white p-5">
    {/* Subtle overlay if you want to darken the hero area a bit more */}
    <div className="absolute inset-0 bg-black/60 z-0" />
    {/* Foreground content */}
    <div className="relative z-10 max-w-4xl mx-auto p-6 bg-black/30 backdrop-blur-md rounded-lg">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-wide">
        Galactic Phantom Division
      </h1>
      <p className="text-xl md:text-2xl mb-8 leading-relaxed">
        The Zero Point for the Galaxy's Elite. Forge your legend, conquer the stars.
      </p>
      <Link
        href="/divisions"
        className="inline-block bg-[#00bcd4] text-[#1a1a2e] py-3 px-8 rounded-full font-semibold text-lg 
                   hover:bg-[#0097a7] transition-colors duration-300 shadow-md hover:shadow-lg"
      >
        Embark on Your Mission
      </Link>
    </div>
  </div>
);

const GameCarousel = () => (
  <section id="games" className="py-16 px-4">
    <div className="container mx-auto">
      <h2 className="text-4xl font-semibold mb-10 text-center">
        Deploy to Your Chosen Division
      </h2>
      <div className="flex justify-center relative overflow-x-auto pb-4">
        <div className="flex gap-8 px-1 w-max">
          <GameCard
            title="Helldivers 2: Liberate the Galaxy"
            imageUrl="https://mir-s3-cdn-cf.behance.net/project_modules/fs/267488191720439.65d03f0f43c2a.jpg"
            link="/games/helldivers-2"
          />
          <GameCard
            title="Dune: Awakening - Arrakis Awaits"
            imageUrl="https://visitarrakis.com/wp-content/uploads/2024/08/nggallery_import/DA_KA_Desktop_1920x1200.jpg"
            comingSoon
          />
        </div>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section className="py-12 px-4 my-12">
    <div className="container mx-auto bg-black/30 backdrop-blur-md rounded-lg p-8 text-center">
      <h2 className="text-3xl font-semibold mb-6">Unleash Your Potential</h2>
      <p className="mb-4 text-lg leading-relaxed">
        From the legendary GPT Fleet, where legends are forged, to the Galactic Phantom Division,
        we empower every Helldiver.
      </p>
      <p className="mb-4 text-lg leading-relaxed">
        Join the ranks where Kevindanilooo, the first 1 Million Career Kill Helldiver, made his mark.
      </p>
      <p className="mb-6 text-lg leading-relaxed">
        We offer more than a clan; we offer a legacy. Experience cutting-edge Discord bots,
        Spartan-style training, and a community that values your story.
      </p>
      <Link
        href="/about"
        className="bg-[#00bcd4] text-[#1a1a2e] py-3 px-8 rounded-full font-semibold text-lg
                   hover:bg-[#0097a7] transition-colors duration-300 shadow-md hover:shadow-lg"
      >
        Discover Our Story
      </Link>
    </div>
  </section>
);

const CommunityHighlights = () => (
  <section className="py-16 px-4 my-12 bg-black/20 rounded-lg">
    <div className="container mx-auto">
      <h2 className="text-4xl font-semibold mb-10 text-center">
        Community Highlights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-black/30 rounded-lg hover:shadow-xl transition-shadow">
          <FaDiscord className="text-5xl text-[#00bcd4] mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Active Discord</h3>
          <p className="text-lg leading-relaxed mb-4">
            Engage with fellow Helldivers in real-time. Share strategies,
            form squads, and stay updated with the latest news and events.
          </p>
          <Link
            href="/discord"
            className="text-[#00bcd4] hover:underline mt-4 inline-block transition-colors"
          >
            Join Discord
          </Link>
        </div>
        <div className="text-center p-6 bg-black/30 rounded-lg hover:shadow-xl transition-shadow">
          <FaTwitch className="text-5xl text-[#00bcd4] mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Twitch Streams</h3>
          <p className="text-lg leading-relaxed mb-4">
            Witness the skill and camaraderie of our elite Helldivers live on Twitch.
            Learn from their tactics and cheer them on in their galactic missions.
          </p>
          <Link
            href="/twitch"
            className="text-[#00bcd4] hover:underline mt-4 inline-block transition-colors"
          >
            Watch Streams
          </Link>
        </div>
        <div className="text-center p-6 bg-black/30 rounded-lg hover:shadow-xl transition-shadow">
          <FaTrophy className="text-5xl text-[#00bcd4] mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Leaderboards</h3>
          <p className="text-lg leading-relaxed mb-4">
            Prove your worth and climb the ranks on our community leaderboards.
            Showcase your achievements and compete for glory.
          </p>
          <Link
            href="/leaderboard"
            className="text-[#00bcd4] hover:underline mt-4 inline-block transition-colors"
          >
            View Leaderboards
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const AdditionalFeatures = () => (
  <section className="py-16 px-4 bg-black/20 rounded-lg my-12">
    <div className="container mx-auto">
      <h2 className="text-4xl font-semibold mb-10 text-center">
        More From Our Community
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-black/30 rounded-lg hover:shadow-xl transition-shadow">
          <FaUsers className="text-5xl text-[#00bcd4] mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Dedicated Community</h3>
          <p className="text-lg leading-relaxed mb-4">
            Join a thriving community of passionate Helldivers. Find squads,
            share tips, and build lasting friendships.
          </p>
        </div>
        <div className="text-center p-6 bg-black/30 rounded-lg hover:shadow-xl transition-shadow">
          <FaCode className="text-5xl text-[#00bcd4] mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Custom Discord Bots</h3>
          <p className="text-lg leading-relaxed mb-4">
            Experience unique Discord bots designed to enhance your gameplay
            and community interaction.
          </p>
        </div>
        <div className="text-center p-6 bg-black/30 rounded-lg hover:shadow-xl transition-shadow">
          <FaStream className="text-5xl text-[#00bcd4] mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Streaming Team</h3>
          <p className="text-lg leading-relaxed mb-4">
            Support our rising star Twitch streamers and join their journey to
            galactic fame.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <GameCarousel />
      <AboutSection />
      <CommunityHighlights />
      <AdditionalFeatures />
    </div>
  );
}
