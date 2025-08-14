import React from 'react';

export const metadata = {
  title: 'Support Us',
  description: 'Help keep the Galactic Phantom Division running.'
};

export default function SupportPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', color: 'var(--color-text-primary, #e0e0e0)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Support Our Division</h1>
      <p style={{ marginBottom: '1rem' }}>
        Our community is maintained by volunteers. Your support helps cover hosting costs
        and allows us to build new features. If you would like to contribute, please consider
        donating using the link below.
      </p>
      <p>
        <a href="https://www.buymeacoffee.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary, #facc15)' }}>
          Buy us a coffee
        </a>
      </p>
    </main>
  );
}
