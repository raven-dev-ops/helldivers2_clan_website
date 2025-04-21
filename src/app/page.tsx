"use client";

import styled, { keyframes } from 'styled-components';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

// Import the GameCard component
import GameCard from '@/components/common/GameCard'; // Adjust path if needed

// --- Define Type for Game Division Data ---
interface GameDivision {
  id: string;
  title: string;
  imageUrl: string;
  href: string;
  comingSoon: boolean;
}

// --- Data for Game Divisions (with Explicit Type) ---
const gameDivisions: GameDivision[] = [ // Added type annotation
  { id: 'helldivers2', title: "Helldivers 2", imageUrl: "/images/helldivers2-select-card.jpg", href: "/helldivers-2", comingSoon: false },
  { id: 'dune',        title: "Dune: Awakening",    imageUrl: "/images/dune-awakening-select-card.jpg", href: "/dune-awakening",    comingSoon: false  },
  { id: 'future0',     title: "Vote August 2025",      imageUrl: "/images/placeholder-select-card.jpg",   href: "/future0",           comingSoon: true  },
  { id: 'future1',     title: "Vote Febuary 2026",      imageUrl: "/images/placeholder-select-card.jpg",   href: "/future1",           comingSoon: true  },
  { id: 'future2',     title: "Vote August 2026",      imageUrl: "/images/placeholder-select-card.jpg",   href: "/future2",           comingSoon: true  },
];

// --- Keyframes ---
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// --- Styled Components ---
const Container = styled.div`
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  min-height: calc(100vh - 120px); /* Adjust based on layout */
  width: 100%; padding: 2rem 0; /* Only vertical padding */
  color: var(--color-text-primary, #e0e0e0);
  overflow-x: hidden;
`;
const CarouselSection = styled.section`
  padding: 0; width: 100%; max-width: 1400px;
  display: flex; flex-direction: column; align-items: center;
`;
// CarouselTitle Removed
const SwiperWrapper = styled.div`
  position: relative; width: 100%; padding: 1rem 0; /* Reduced vertical padding slightly */ margin: 0 auto;
  .swiper-button-prev, .swiper-button-next {
    color: var(--color-primary, #00bcd4); background-color: rgba(30, 41, 59, 0.6); backdrop-filter: blur(4px);
    width: 50px; height: 50px; border-radius: 50%; border: 1px solid var(--color-border, #334155);
    transition: all 0.2s ease; top: 50%; transform: translateY(-50%); z-index: 30; position: fixed;
    &:hover { background-color: rgba(51, 65, 85, 0.85); color: #ffffff; transform: translateY(-50%) scale(1.05); }
    &::after { font-size: 1.2rem; font-weight: bold; }
  }
  .swiper-button-prev { left: 1.5rem; }
  .swiper-button-next { right: 1.5rem; }
  .swiper-button-disabled { opacity: 0.3; cursor: not-allowed; pointer-events: none; }
  .swiper { padding: 4rem 5vw; overflow: visible !important; } /* Adjusted padding */
  .swiper-slide {
    width: auto; transform: scale(0.55); opacity: 0.4; filter: grayscale(75%) brightness(0.65);
    transition: transform 0.5s ease, opacity 0.5s ease, filter 0.5s ease; display: flex; justify-content: center; align-items: center;
    backface-visibility: hidden; perspective: 1000px;
    & > div { flex-shrink: 0; }
  }
  .swiper-slide-active { transform: scale(1.5); opacity: 1; filter: grayscale(0%) brightness(1); z-index: 10; }
  .swiper-slide-active > div { cursor: pointer; }
`;
const LoadingMessage = styled.p` text-align: center; padding: 8rem 1rem; font-size: 1.2rem; color: var(--color-text-secondary, #90a4ae); font-style: italic; animation: ${pulse} 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; `;
const FallbackContainer = styled(Container)` min-height: 60vh; `;
const SignInButton = styled.button` background-color: var(--color-primary, #00bcd4); color: var(--color-background-alt, #1a1a2e); padding: 0.85rem 1.75rem; border-radius: 9999px; font-weight: 700; font-size: 1rem; border: none; cursor: pointer; transition: background-color 0.2s ease, transform 0.2s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.2); &:hover { background-color: var(--color-primary-hover, #00acc1); transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.25); } &:focus-visible { outline: 2px solid var(--color-primary-focus, #80deea); outline-offset: 2px; } `;
// --- End Styled Components ---

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Authentication Effect
  useEffect(() => { if (status === 'unauthenticated') router.replace('/auth'); }, [status, router]);

  // Loading State
  if (status === 'loading') return <Container style={{ minHeight: '100vh' }}><LoadingMessage>Loading...</LoadingMessage></Container>;

  // Unauthenticated State
  if (status === 'unauthenticated') return null;

  // Authenticated State
  if (status === 'authenticated' && session?.user) {
    return (
      <Container>
        <CarouselSection>
          {/* Title Removed */}
          <SwiperWrapper>
            <Swiper
              modules={[Navigation, EffectCoverflow, A11y]}
              effect="coverflow"
              grabCursor
              centeredSlides
              loop={gameDivisions.length > 4}
              slidesPerView={"auto"} // Keep as auto
              spaceBetween={-50} // Adjust for bigger base cards + scaling
              coverflowEffect={{
                rotate: 20,
                stretch: -100, // More negative stretch needed
                depth: 250,    // Adjust depth
                modifier: 1,
                scale: 0.6,    // Inactive scale
                slideShadows: false,
              }}
              navigation={true}
              a11y={{ prevSlideMessage: 'Previous', nextSlideMessage: 'Next' }}
              className="mySwiper"
            >
              {/* Map over explicitly typed array */}
              {gameDivisions.map(game => (
                <SwiperSlide key={game.id}>
                  <GameCard
                    title={game.title} imageUrl={game.imageUrl}
                    href={game.href} comingSoon={game.comingSoon}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperWrapper>
        </CarouselSection>
      </Container>
    );
  }

  // Fallback Error State
  return ( <FallbackContainer style={{ minHeight: '100vh' }}> {/* ... Error content ... */} </FallbackContainer> );
}