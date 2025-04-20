'use client';

import styled from 'styled-components';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import GameCard from '@/components/common/GameCard';
import Link from 'next/link';

const Container = styled.div`
  margin: 0;
  padding: 0;
`;

const Hero = styled.section`
  /* …same styling as before… */
`;

const HeroTitle = styled.h1`/* … */`;
const HeroSubtitle = styled.p`/* … */`;
const CarouselSection = styled.section`/* … */`;
const ScrollContainer = styled.div`/* … */`;

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If not signed in, redirect them to /auth
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth');
    }
  }, [status, router]);

  // While loading, render nothing (or a spinner)
  if (status !== 'authenticated') return null;

  return (
    <Container>
      <Hero>
        <HeroTitle>Welcome to Galactic Phantom Division</HeroTitle>
        <HeroSubtitle>Select your division to join the fight!</HeroSubtitle>

        {/* If they're on this page but somehow not authenticated, let them sign in */}
        {!session && (
          <button
            onClick={() => signIn('discord', { callbackUrl: '/' })}
            style={{
              backgroundColor: '#00bcd4',
              color: '#1a1a2e',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sign Up / Sign In
          </button>
        )}
      </Hero>

      <CarouselSection>
        <h2 style={{ textAlign: 'center' }}>
          Deploy to Your Chosen Division
        </h2>
        <ScrollContainer>
          <GameCard
            title="Helldivers 2"
            imageUrl="..."
            link="/helldivers-2"
          />
          <GameCard
            title="Dune: Awakening"
            imageUrl="..."
            comingSoon
          />
          {/* … more cards */}
        </ScrollContainer>
      </CarouselSection>
    </Container>
  );
}
