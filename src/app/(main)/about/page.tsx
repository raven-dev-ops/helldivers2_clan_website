// Example: src/app/(main)/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Galactic Phantom Division',
  // Add other metadata as needed
};

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">About Galactic Phantom Division</h1>
      <div className="space-y-4">
        <p>
          Welcome to the Galactic Phantom Division, formerly known as the Galactic Phantom Taskforce (GPT Fleet).
          We originated as the zero point for the greatest Helldivers in the galaxy, fostering a community
          of elite skill and camaraderie.
        </p>
        <p>
          We are proud to be the home of Kevindanilooo, the world's first Helldiver to achieve
          1 million total career kills – a testament to the dedication found within our ranks.
        </p>
        <p>
          As we've grown, our mission has expanded. The Galactic Phantom Division now aims to be a premier
          community across multiple gaming universes, bringing our ethos of excellence and teamwork to new frontiers.
        </p>
        {/* Add more content: History, Mission, Values, Structure etc. */}
      </div>
    </div>
  );
}