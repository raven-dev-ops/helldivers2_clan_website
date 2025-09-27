import { getChallengeLevels } from '@/lib/challenges';
import ChallengeList from '@/components/challenges/ChallengeList';

import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import SubmitChallengeModal from '@/components/challenges/SubmitChallengeModal';
import YoutubeCarouselPlaceholder from '@/components/campaigns/YoutubeCarouselCampaigns';

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
}
