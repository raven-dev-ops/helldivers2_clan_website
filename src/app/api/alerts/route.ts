import { NextResponse } from 'next/server';
import type { Alert } from '@/_types/alerts';

export async function GET() {
  const now = new Date().toISOString();
  const alerts: Alert[] = [
    {
      id: 'twitch-test',
      type: 'twitch_live',
      variant: 'purple',
      message: 'Test: Twitch live alerts ready',
      createdAt: now,
    },
    {
      id: 'youtube-test',
      type: 'youtube_live',
      variant: 'red',
      message: 'Test: YouTube live alerts ready',
      createdAt: now,
    },
    {
      id: 'mission-test',
      type: 'mission_submitted',
      variant: 'green',
      message: 'Test: Mission submission alerts ready',
      createdAt: now,
    },
    {
      id: 'order-test',
      type: 'major_order',
      variant: 'blue',
      message: 'Test: Major order alerts ready',
      createdAt: now,
    },
  ];
  return NextResponse.json({ alerts });
}
