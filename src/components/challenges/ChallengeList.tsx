'use client';

import Expander from '@/components/common/Expander';
import code from '@/components/common/CodeBlocks.module.css';
import YoutubeCarouselPlaceholder from '@/components/challenges/YoutubeCarouselChallenges';
import base from '@/styles/Base.module.css';
import type { ChallengeLevelData } from '@/lib/challenges';

type ChallengeListProps = {
  items: ChallengeLevelData[];
};

export default function ChallengeList({ items }: ChallengeListProps) {
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
