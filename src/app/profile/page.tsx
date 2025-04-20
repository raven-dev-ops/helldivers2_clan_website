'use client';

import { useSession } from 'next-auth/react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  min-height: 60vh;
  background-color: #1a1a2e;
  color: #e0e0e0;
  padding: 2rem;
`;

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <ProfileContainer>Loading...</ProfileContainer>;
  }

  if (!session) {
    return (
      <ProfileContainer>
        <p>Please <a href="/auth">sign in</a> to view your profile.</p>
      </ProfileContainer>
    );
  }

  const { user } = session;
  return (
    <ProfileContainer>
      <h1>{user?.name}</h1>
      <p>Email: {user?.email}</p>
      {user?.image && <img src={user.image} alt="Avatar" width={100} height={100} style={{ borderRadius: '50%' }} />}
      {/* GAME‑SPECIFIC DATA will go here later, based on query params or profile settings */}
    </ProfileContainer>
  );
}
