"use client";

// Using styled-components for styling this page
import styled from 'styled-components';
import { useSession, signIn } from 'next-auth/react'; // NextAuth hooks
import { useRouter } from 'next/navigation'; // Next.js navigation
import { useEffect } from 'react';

// Import the GameCard component with session/API logic
import GameCard from '@/components/common/GameCard'; // Adjust path if needed

// --- Styled Components Definitions ---
const Container = styled.div`
  margin: 0 auto;
  padding: 0 1rem 4rem; /* Add bottom padding */
  max-width: 1200px;
  color: #e0e0e0;
`;

const Hero = styled.section`
  text-align: center;
  padding: 4rem 1rem 3.5rem;
  background: linear-gradient(180deg, #121e3a 0%, #1a1a2e 100%); /* Gradient background */
  border-radius: 0 0 12px 12px; /* Softer rounding */
  margin: -1rem -1rem 3rem; /* Extend slightly outside container padding */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative; /* For potential pseudo-elements */
  overflow: hidden;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 6vw, 3rem); /* Responsive font size */
  color: #00bcd4;
  margin-bottom: 0.75rem;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 3vw, 1.25rem); /* Responsive font size */
  color: #b0bec5;
  margin-bottom: 2.5rem;
  max-width: 600px; /* Limit subtitle width */
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const SignInButton = styled.button`
  background-color: #00bcd4;
  color: #1a1a2e;
  padding: 0.85rem 1.75rem;
  border-radius: 9999px;
  font-weight: 700; /* Bolder */
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);

  &:hover {
    background-color: #00acc1; /* Slightly different hover */
    transform: translateY(-2px); /* Subtle lift */
    box-shadow: 0 4px 8px rgba(0,0,0,0.25);
  }

   &:focus-visible {
    outline: 2px solid #80deea;
    outline-offset: 2px;
  }
`;

const CarouselSection = styled.section`
  padding: 2rem 0;
`;

const CarouselTitle = styled.h2`
    text-align: center;
    font-size: clamp(1.5rem, 5vw, 2rem); /* Responsive title */
    margin-bottom: 2.5rem;
    color: #cfd8dc;
    font-weight: 600;
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 1.75rem; /* Increased gap */
  overflow-x: auto;
  padding: 1rem 0.75rem; /* Adjust padding */
  margin: 0 -0.75rem; /* Counteract padding for full-bleed effect */

  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar { display: none; }

  /* Improve scrolling experience on touch devices */
  -webkit-overflow-scrolling: touch;
`;

const LoadingMessage = styled.p`
    text-align: center;
    padding: 6rem 1rem;
    font-size: 1.2rem;
    color: #90a4ae;
    font-style: italic;
`;
// --- End Styled Components Definitions ---

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- Authentication Handling Effect ---
  useEffect(() => {
    // Redirect immediately if unauthenticated after initial check
    if (status === 'unauthenticated') {
      console.log("Homepage: User unauthenticated, redirecting to /auth");
      router.replace('/auth'); // Use replace to avoid back button issues
    }
  }, [status, router]);

  // --- Render States ---
  // 1. Loading State
  if (status === 'loading') {
    return <LoadingMessage>Loading Galactic Status...</LoadingMessage>;
  }

  // 2. Unauthenticated State (Redirect is in progress, render null)
  if (status === 'unauthenticated') {
    return null;
  }

  // 3. Authenticated State (Primary Render Path)
  if (status === 'authenticated' && session) { // Ensure session object is also available
    return (
      <Container>
        <Hero>
          <HeroTitle>Welcome, Commander!</HeroTitle>
          <HeroSubtitle>The Galaxy Needs You. Select Your Deployment Zone.</HeroSubtitle>
          {/* No sign-in button needed here as user is authenticated */}
        </Hero>

        <CarouselSection>
          <CarouselTitle>
            Choose Your Division
          </CarouselTitle>
          <ScrollContainer>
            {/* --- Game Cards for Division Selection --- */}
            <GameCard
              title="Helldivers 2"
              imageUrl="/images/helldivers2-select-card.jpg" // Use specific images for this page context
              href="/helldivers-2" // Path used for API & final navigation
              comingSoon={false}
            />
            <GameCard
              title="Dune: Awakening"
              imageUrl="/images/dune-awakening-select-card.jpg" // Specific image
              href="/dune-awakening"
              comingSoon={true} // Non-interactive
            />
            <GameCard
              title="Future Game 0"
              imageUrl="/images/placeholder-select-card.jpg" // Placeholder
              href="/future0"
              comingSoon={true} // Non-interactive
            />
            {/* Add more GameCards for other potential divisions */}
          </ScrollContainer>
        </CarouselSection>

        {/* Add more sections to your homepage below */}

      </Container>
    );
  }

  // Fallback state (e.g., if status is authenticated but session is somehow null)
  // This should be rare with NextAuth v5+ patterns but good to handle.
  console.warn("Homepage: Reached fallback render state (authenticated but no session?).");
  return (
       <Container>
         <Hero>
            <HeroTitle>Authentication Error</HeroTitle>
            <HeroSubtitle>There was an issue verifying your session. Please try signing in again.</HeroSubtitle>
             <SignInButton onClick={() => signIn('discord', { callbackUrl: '/' })}>
                Sign In
            </SignInButton>
         </Hero>
       </Container>
  );
}