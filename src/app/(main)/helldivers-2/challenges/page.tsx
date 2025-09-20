'use client';

import Expander from '@/components/common/Expander';
import base from '@/app/(main)/helldivers-2/styles/HelldiversBase.module.css';
import code from '@/components/common/CodeBlocks.module.css';
import YoutubeCarouselPlaceholder from '@/components/campaigns/YoutubeCarouselCampaign';

export interface ChallengeLevelData {
  id: string;
  levelTitle: string;
  details: string;
  videoUrls?: string[];
}

export default function Challenges({ items }: { items: ChallengeLevelData[] }) {
  return (
    <>
      {items.map((ch) => (
        <Expander
          key={ch.id}
          id={ch.id}
          title={ch.levelTitle}
          titleClassName={base.subHeading}
          style={{ scrollMarginTop: 96 }}
        >
          <pre className={code.codeBlock}>{ch.details}</pre>
          <YoutubeCarouselPlaceholder
            videoUrls={ch.videoUrls ?? []}
            title={ch.levelTitle}
          />
        </Expander>
      ))}
    </>
  );
}
