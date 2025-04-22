// Example: src/app/api/twitch/creators/route.ts (App Router)
import { NextResponse } from 'next/server';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET; // Keep secret!

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
        console.error("Twitch API credentials missing in environment variables.");
        return null;
    }
    // TODO: Implement caching for the token to avoid fetching every time
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
             console.error("Failed to fetch Twitch App Access Token:", response.status, await response.text());
            return null;
        }
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error getting Twitch App Access Token:", error);
        return null;
    }
}

export async function GET() {
    const channelNames = [ // Keep this list manageable or pass via query params
        'galacticphantomtaskforce',
        'kevindanilooo',
        'mrswimson',
        'charredviolet',
        'javy1402',
        'gingercynic',
        'chappzs',
    ];

    if (!TWITCH_CLIENT_ID) {
        return NextResponse.json({ error: 'Twitch Client ID not configured on server.' }, { status: 500 });
    }

    const accessToken = await getTwitchAppAccessToken();
    if (!accessToken) {
        return NextResponse.json({ error: 'Failed to obtain Twitch authorization.' }, { status: 503 });
    }

    const headers = {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
    };

    try {
        // --- Fetch User and Stream data in parallel for efficiency ---
        const userQuery = channelNames.map(login => `login=${login}`).join('&');
        const streamQuery = channelNames.map(login => `user_login=${login}`).join('&');

        const [userResponse, streamResponse] = await Promise.all([
            fetch(`https://api.twitch.tv/helix/users?${userQuery}`, { headers }),
            fetch(`https://api.twitch.tv/helix/streams?${streamQuery}`, { headers }),
        ]);

        if (!userResponse.ok) throw new Error(`Failed to fetch users: ${userResponse.status}`);
        if (!streamResponse.ok) throw new Error(`Failed to fetch streams: ${streamResponse.status}`);

        const userData = await userResponse.json();
        const streamData = await streamResponse.json();

        const usersMap = new Map<string, TwitchUser>(userData.data?.map((user: TwitchUser) => [user.login, user]) || []);
        const liveStreamsSet = new Set<string>(streamData.data?.map((stream: TwitchStream) => stream.user_login) || []);

        // Combine data
        const creatorsData: CreatorData[] = channelNames.map(name => {
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
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120'); // Cache for 60s, allow stale for 120s
        return response;

    } catch (error: any) {
        console.error("Error in Twitch API route:", error);
        return NextResponse.json({ error: 'Failed to fetch data from Twitch.', details: error.message }, { status: 500 });
    }
}