'use client';

import styled from 'styled-components';
import GameCard from '@/components/common/GameCard';
import Link from 'next/link';

const Container = styled.div`
  margin: 0;
  padding: 0;
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  background: url('/images/space-bg.png') center/cover no-repeat;
  text-align: center;
  color: #ffffff;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const CarouselSection = styled.section`
  padding: 2rem;
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
`;

export default function Home() {
  return (
    <Container>
      <Hero>
        <HeroTitle>Welcome to Galactic Phantom Division</HeroTitle>
        <HeroSubtitle>Select your division to join the fight!</HeroSubtitle>
        <Link href="/auth" passHref>
          {/* could be a styled button */}
          <a style={{
            backgroundColor: '#00bcd4',
            color: '#1a1a2e',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Sign Up / Sign In
          </a>
        </Link>
      </Hero>

      <CarouselSection>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>
          Deploy to Your Chosen Division
        </h2>
        <ScrollContainer>
          <GameCard
            title="Helldivers 2"
            imageUrl="https://mir-s3-cdn-cf.behance.net/project_modules/fs/267488191720439.65d03f0f43c2a.jpg"
            link="/profile/me?division=helldivers-2"
          />
          <GameCard
            title="Dune: Awakening"
            imageUrl="https://visitarrakis.com/wp-content/uploads/2024/08/nggallery_import/DA_KA_Desktop_1920x1200.jpg"
            comingSoon
          />
          {/* add more divisions here */}
        </ScrollContainer>
      </CarouselSection>
    </Container>
  );
}
