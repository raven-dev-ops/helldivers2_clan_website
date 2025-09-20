import { getChallengeLevels } from '@/lib/challenges';
import ChallengeList from '@/components/challenges/ChallengeList';

export const revalidate = 60;

export default async function ChallengesPage() {
  const items = await getChallengeLevels();
  return <ChallengeList items={items} />;
}
