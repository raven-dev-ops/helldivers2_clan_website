import { NextResponse } from 'next/server';
import { fetchTwitchCreators } from '@/lib/twitch';

export async function GET() {
  const creatorsData = await fetchTwitchCreators();
  if (!creatorsData) {
    return NextResponse.json(
      { error: 'Failed to fetch data from Twitch.' },
      { status: 500 }
    );
  }

  const response = NextResponse.json(creatorsData);
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=120'
  ); // Cache for 60s, allow stale for 120s
  return response;
}
