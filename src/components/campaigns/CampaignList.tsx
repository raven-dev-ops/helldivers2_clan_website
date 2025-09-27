// src/components/campaigns/CampaignList.tsx
'use client';

import Expander from '@/components/common/Expander';
import code from '@/components/common/CodeBlocks.module.css';
import YoutubeCarouselPlaceholder from '@/components/campaigns/YoutubeCarouselCampaigns';
import base from '@/styles/Base.module.css';
import type { PrestigeMissionData } from '@/lib/campaigns'; // adjust path if needed

type CampaignListProps = {
  items: PrestigeMissionData[];
  videoUrlMap?: Record<string, string[]>; // defaults to empty map
};

export default function CampaignList({
  items,
  videoUrlMap = {},
}: CampaignListProps) {
  return (
    <>
      {items.map((c) => (
        <Expander
          key={c.id}
          id={c.id}
          title={c.title}
          titleClassName={base.subHeading}
          style={{ scrollMarginTop: 96 }}
        >
          <pre className={code.codeBlock}>{c.details}</pre>
          <YoutubeCarouselPlaceholder
            videoUrls={videoUrlMap[c.id] ?? []}
            title={c.title}
          />
        </Expander>
      ))}
    </>
  );
}
