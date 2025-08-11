// src/app/(main)/settings/page.tsx
"use client";

import styled from 'styled-components';
import ProfileEditForm from '@/app/components/forum/ProfileEditForm';
import StatsSubmitForm from '@/app/components/forum/StatsSubmitForm';

const Container = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  width: 100%;
  padding: 2rem 1rem;
  color: var(--color-text-primary);
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1000px;
`;

const Header = styled.header`
  margin-bottom: 1.75rem;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 5vw, 2.25rem);
  font-weight: 800;
  margin-bottom: 0.25rem;
  color: var(--color-primary);
`;

const Description = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
`;

const Section = styled.section`
  margin-bottom: 1.75rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.25rem, 3.5vw, 1.5rem);
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary);
`;

export default function SettingsPage() {
  return (
    <Container>
      <Inner>
        <Header>
          <Title>Settings</Title>
          <Description>Manage your profile and submit your Helldivers 2 stats.</Description>
        </Header>

        <Section>
          <SectionTitle>Edit Profile</SectionTitle>
          <ProfileEditForm />
        </Section>

        <Section>
          <SectionTitle>Submit Stats</SectionTitle>
          <StatsSubmitForm />
        </Section>
      </Inner>
    </Container>
  );
}