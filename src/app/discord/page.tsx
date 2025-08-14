// src/app/discord/page.tsx
import DiscordWidget from '../components/common/DiscordWidget';

export const metadata = {
    title: 'Discord – Galactic Phantom Division',
  };

  export default function DiscordPage() {
    const serverId = process.env.NEXT_PUBLIC_DISCORD_SERVER_ID ?? '';
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Join our Discord</h1>
        {/* Embed the Discord server chat widget */}
        <DiscordWidget serverId={serverId} />
        <p>
          Or join us at{' '}
          <a
            href="https://discord.gg/gptfleet"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://discord.gg/gptfleet
          </a>
        </p>
      </main>
    );
  }
  