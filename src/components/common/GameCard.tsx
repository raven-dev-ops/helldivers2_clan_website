// src/components/common/GameCard.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";

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
    <div
      className={`relative flex-shrink-0 bg-[#162447] border border-[#2a3b64] rounded-lg overflow-hidden w-64 text-center shadow-lg transform transition-transform duration-300 hover:scale-[1.03] ${
        comingSoon ? "opacity-70" : ""
      }`}
    >
      {/* Label Badge */}
      <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded uppercase">
        {comingSoon ? "Coming Soon" : "Live"}
      </div>

      {/* Image */}
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover rounded-t-md"
          unoptimized // for external images
        />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold my-3 text-[#e0e0e0]">{title}</h3>

      {/* Button or Coming Soon */}
      {!comingSoon ? (
        <Link
          href={link}
          className="inline-block mb-4 bg-[#00bcd4] text-[#1a1a2e] py-1 px-4 rounded font-bold hover:bg-[#0097a7] transition duration-300 text-sm"
        >
          Explore
        </Link>
      ) : (
        <span className="block mb-4 text-gray-400 italic text-sm">Coming Soon</span>
      )}
    </div>
  );
}
