// src/app/page.tsx (or wherever your Home page is)

import GameCard from "@/components/common/GameCard";
import Link from "next/link";

// Hero Section
const HeroSection = () => (
  <div className="relative min-h-[60vh] flex flex-col justify-center items-center text-center text-white p-5 overflow-hidden">
    {/* Background overlay */}
    <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-0"></div>

    {/* Hero Content */}
    <div className="relative z-10">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Galactic Phantom Division</h1>
      <p className="text-lg md:text-xl mb-6">The Zero Point for the Greatest Helldivers in the Galaxy.</p>
      <button className="bg-[#00bcd4] text-[#1a1a2e] py-2 px-6 rounded font-bold hover:bg-[#0097a7] transition duration-300">
        Explore Divisions
      </button>
    </div>
  </div>
);

// Game Section
const GameCarousel = () => (
  <section id="games" className="py-12 text-center">
    <h2 className="text-3xl font-semibold mb-8">Choose Your Division</h2>
    <div className="flex justify-center items-center gap-8 flex-wrap px-4">
      <GameCard
        title="Helldivers 2"
        imageUrl="https://mir-s3-cdn-cf.behance.net/project_modules/fs/267488191720439.65d03f0f43c2a.jpg"
        link="/games/helldivers-2"
      />
      <GameCard
        title="Dune: Awakening"
        imageUrl="https://visitarrakis.com/wp-content/uploads/2024/08/nggallery_import/DA_KA_Desktop_1920x1200.jpg"
        comingSoon
      />
    </div>
  </section>
);

export default function Home() {
  return (
    <div>
      <HeroSection />
      <GameCarousel />

      <section className="py-10 px-4 text-center bg-black/20 rounded-lg my-8">
        <h2 className="text-2xl font-semibold mb-4">About Us Snippet</h2>
        <p className="mb-2">
          From the elite GPT Fleet to the expanding Galactic Phantom Division...{" "}
          <Link href="/about" className="text-[#00bcd4] hover:underline">
            Read More
          </Link>
        </p>
        <p>Home to Kevindanilooo, the world's first 1 Million Career Kill Helldiver!</p>
      </section>
    </div>
  );
}
