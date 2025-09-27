import { getChallengeLevels } from '@/lib/challenges';
import ChallengeList from '@/components/challenges/ChallengeList';

<<<<<<< HEAD:src/app/challenges/page.tsx
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import SubmitChallengeModal from '@/components/SubmitChallengeModal';
import YoutubeCarouselPlaceholder from '@/components/YoutubeCarouselCampaign';

// --- Import CSS Modules ---
import base from '../Base.module.css';
import exp from '../styles/Expanders.module.css';
import code from '../styles/CodeBlocks.module.css';

// --- John Helldiver Challenge Data ---
interface ChallengeLevelData {
  id: string;
  levelTitle: string;
  details: string;
  videoUrls?: string[];
=======
export const revalidate = 60;

export default async function ChallengesPage() {
  const items = await getChallengeLevels();
  return <ChallengeList items={items} />;
>>>>>>> main:src/app/(main)/helldivers-2/challenges/page.tsx
}
