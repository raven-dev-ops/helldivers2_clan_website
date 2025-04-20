'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface GameCardProps {
  title: string;
  imageUrl: string;
  link?: string;
  comingSoon?: boolean;
}

export default function GameCard({ title, imageUrl, link = '/', comingSoon }: GameCardProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = async () => {
    // If user not logged in, send them to /auth
    if (!session) {
      return router.push('/auth');
    }

    // Example: Save the user’s chosen "division" to your API
    await fetch('/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ division: link.replace('/', '') }),
    });

    // Then redirect them back to the homepage, or wherever
    router.replace('/');
  };

  return (
    <div
      onClick={!comingSoon ? handleClick : undefined}
      style={{ 
        cursor: comingSoon ? 'default' : 'pointer',
        border: '1px solid #333', 
        padding: '1rem',
        margin: '1rem'
      }}
    >
      <Image src={imageUrl} alt={title} width={300} height={200} />
      <h2>{title}</h2>
      {comingSoon && <p>Coming Soon</p>}
    </div>
  );
}
