// Example: src/app/api/twitch/creators/route.ts (App Router)
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET; // Keep secret!

interface TokenCache {
  token: string;
  expiresAt: number;
}

// simple in-memory cache using globalThis so the token can be reused across requests
const globalForCache = globalThis as unknown as {
  __twitch_token_cache__?: TokenCache;
};

function readTokenCache(): TokenCache | null {
  try {
    return globalForCache.__twitch_token_cache__ ?? null;
  } catch (error) {
    logger.error('Failed to read Twitch token cache:', error);
    return null;
  }
}

function writeTokenCache(cache: TokenCache): void {
  try {
    globalForCache.__twitch_token_cache__ = cache;
  } catch (error) {
    logger.error('Failed to write Twitch token cache:', error);
  }
}

interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  description: string;
  profile_image_url: string;
  // ... other fields
}

interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  type: 'live' | '';
  // ... other fields
}

interface CreatorData {
  channelName: string;
  displayName?: string;
  description?: string;
  profileImageUrl?: string;
  isLive: boolean;
}

// Function to get App Access Token (cached recommended)
async function getTwitchAppAccessToken(): Promise<string | null> {
  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
    logger.error('Twitch API credentials missing in environment variables.');
    return null;
  }
  const cached = readTokenCache();
  if (cached && cached.expiresAt > Date.now()) {
    return cached.token;
  }

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
      cache: 'no-store', // Don't cache the token request itself (but cache the result)
    });
    if (!response.ok) {
      const body = await response.text();
      logger.error('Failed to fetch Twitch App Access Token:', {
        status: response.status,
        body,
      });
      return null;
    }
    const data = await response.json();
    const newCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 0) * 1000 - 60_000, // refresh 1 min early
    };
    writeTokenCache(newCache);
    return data.access_token;
  } catch (error: unknown) {
    logger.error('Error getting Twitch App Access Token:', error);
    return null;
  }
}
export async function GET() {
  const channelNames = [
    // Keep this list manageable or pass via query params
    'galacticphantomtaskforce',
    'kevindanilooo',
    'mrhellpod',
    'mrswimson',
    'gingercynic',
    'chappzs',
    'popekingx',
    'mr_black_snow',
  ];

  if (!TWITCH_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Twitch Client ID not configured on server.' },
      { status: 500 }
    );
  }

  const accessToken = await getTwitchAppAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Failed to obtain Twitch authorization.' },
      { status: 503 }
    );
  }

  const headers = {
    'Client-ID': TWITCH_CLIENT_ID,
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // --- Fetch User and Stream data in parallel for efficiency ---
    const userQuery = channelNames.map((login) => `login=${login}`).join('&');
    const streamQuery = channelNames
      .map((login) => `user_login=${login}`)
      .join('&');

    const [userResponse, streamResponse] = await Promise.all([
      fetch(`https://api.twitch.tv/helix/users?${userQuery}`, { headers }),
      fetch(`https://api.twitch.tv/helix/streams?${streamQuery}`, { headers }),
    ]);

    if (!userResponse.ok)
      throw new Error(`Failed to fetch users: ${userResponse.status}`);
    if (!streamResponse.ok)
      throw new Error(`Failed to fetch streams: ${streamResponse.status}`);

    const userData = await userResponse.json();
    const streamData = await streamResponse.json();

    const usersMap = new Map<string, TwitchUser>(
      userData.data?.map((user: TwitchUser) => [user.login, user]) || []
    );
    const liveStreamsSet = new Set<string>(
      streamData.data?.map((stream: TwitchStream) => stream.user_login) || []
    );

    // Combine data
    const creatorsData: CreatorData[] = channelNames.map((name) => {
      const user = usersMap.get(name);
      return {
        channelName: name,
        displayName: user?.display_name,
        description: user?.description,
        profileImageUrl: user?.profile_image_url,
        isLive: liveStreamsSet.has(name),
      };
    });

    // Set cache headers - revalidate frequently for live status
    const response = NextResponse.json(creatorsData);
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=120'
    ); // Cache for 60s, allow stale for 120s
    return response;
  } catch (error: unknown) {
    logger.error('Error in Twitch API route:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch data from Twitch.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
