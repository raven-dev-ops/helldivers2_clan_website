'use client';

import { signIn, useSession } from 'next-auth/react';
import styled from 'styled-components';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  background: #1a1a2e;
  color: #e0e0e0;
`;

const Button = styled.button`
  background: #00bcd4;
  color: #1a1a2e;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #0097a7;
  }
`;

export default function AuthPage() {
  const { status } = useSession();

  // While the session is loading, render nothing (or a loader)
  if (status === 'loading') return null;

  return (
    <AuthContainer>
      <h1>Sign Up / Sign In</h1>
      <Button onClick={() => signIn('discord', { callbackUrl: '/' })}>
        Continue with Discord
      </Button>
      <Button onClick={() => signIn('google', { callbackUrl: '/' })}>
        Continue with Google
      </Button>
    </AuthContainer>
  );
}
