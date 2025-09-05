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

export interface TwitchCreator {
  channelName: string;
  displayName?: string;
  description?: string;
  profileImageUrl?: string;
  isLive: boolean;
}

export const TWITCH_CHANNEL_NAMES = [
  'galacticphantomtaskforce',
  'kevindanilooo',
  'mrhellpod',
  'mrswimson',
  'gingercynic',
  'chappzs',
  'popekingx',
  'mr_black_snow',
  'helldiver_black_snow',
  'darcyboy',
];

export async function getTwitchAppAccessToken(): Promise<string | null> {
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

interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  description: string;
  profile_image_url: string;
}

interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  type: 'live' | '';
}

export async function fetchTwitchCreators(
  channelNames: string[] = TWITCH_CHANNEL_NAMES
): Promise<TwitchCreator[] | null> {
  if (!TWITCH_CLIENT_ID) {
    logger.error('Twitch Client ID not configured on server.');
    return null;
  }

  const accessToken = await getTwitchAppAccessToken();
  if (!accessToken) {
    logger.error('Failed to obtain Twitch authorization.');
    return null;
  }

  const headers = {
    'Client-ID': TWITCH_CLIENT_ID,
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const userQuery = channelNames.map((login) => `login=${login}`).join('&');
    const streamQuery = channelNames
      .map((login) => `user_login=${login}`)
      .join('&');

    // Add short timeouts to upstream requests
    const mkCtrl = () => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 5000);
      return { ctrl, t };
    };
    const u = mkCtrl();
    const s = mkCtrl();
    const [userResponse, streamResponse] = await Promise.all([
      fetch(`https://api.twitch.tv/helix/users?${userQuery}`, { headers, signal: u.ctrl.signal }).finally(() => clearTimeout(u.t)),
      fetch(`https://api.twitch.tv/helix/streams?${streamQuery}`, { headers, signal: s.ctrl.signal }).finally(() => clearTimeout(s.t)),
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

    return channelNames.map((name) => {
      const user = usersMap.get(name);
      return {
        channelName: name,
        displayName: user?.display_name,
        description: user?.description,
        profileImageUrl: user?.profile_image_url,
        isLive: liveStreamsSet.has(name),
      };
    });
  } catch (error: unknown) {
    logger.error('Error fetching Twitch creators:', error);
    return null;
  }
}
