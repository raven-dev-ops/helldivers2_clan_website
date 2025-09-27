// src/lib/discordWebhook.ts
// Server-only Discord webhook helper with safer defaults, thread support, and retries.

type AllowedMentionParse = Array<'roles' | 'users' | 'everyone'>;

export type DiscordEmbed = {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string; // ISO string
  color?: number; // decimal (e.g., 0xffaa00 -> 16755200)
  footer?: { text: string; icon_url?: string };
  image?: { url: string };
  thumbnail?: { url: string };
  author?: { name: string; url?: string; icon_url?: string };
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
};

export type DiscordWebhookPayload = {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
  // Prevent accidental mass pings by default
  allowed_mentions?: {
    parse?: AllowedMentionParse;
    users?: string[];
    roles?: string[];
    replied_user?: boolean;
  };
  // NOTE: Discord expects thread_id in the *query string*, not the JSON body.
  // You can pass it here and we'll move it to the URL.
  thread_id?: string;
};

type PostOptions = {
  /** Retry once on 429/5xx (default: true) */
  retry?: boolean;
  /** Abort/timeout in ms (default: 10000) */
  timeoutMs?: number;
  /** Override webhook URL (rare; default: process.env.DISCORD_WEBHOOK_URL) */
  webhookUrlOverride?: string;
};

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL ?? '';

const DISCORD_MAX_CONTENT = 2000;
const DISCORD_MAX_EMBEDS = 10;

function isServer() {
  return typeof window === 'undefined';
}

function buildWebhookUrl(baseUrl: string, threadId?: string): string {
  if (!threadId) return baseUrl;
  try {
    const u = new URL(baseUrl);
    u.searchParams.set('thread_id', threadId);
    return u.toString();
  } catch {
    // If baseUrl is malformed, just return as-is (fetch will throw later)
    return baseUrl;
  }
}

function truncateContent(content?: string): string | undefined {
  if (typeof content !== 'string') return content;
  if (content.length <= DISCORD_MAX_CONTENT) return content;
  return content.slice(0, DISCORD_MAX_CONTENT - 1) + '…';
}

/**
 * Send a message to a Discord webhook.
 * Safe by default: suppresses @everyone/@here, truncates content, limits embeds, retries on 429/5xx.
 */
export async function postToDiscord(
  payload: DiscordWebhookPayload,
  opts: PostOptions = {}
): Promise<void> {
  if (!isServer()) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('postToDiscord called on the client — ignoring');
    }
    return;
  }

  const webhookUrl = (opts.webhookUrlOverride ?? WEBHOOK_URL).trim();
  if (!webhookUrl) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('DISCORD_WEBHOOK_URL is not set; skipping Discord post.');
    }
    return;
  }

  // default: suppress @everyone/@here unless explicitly allowed
  const safePayload: DiscordWebhookPayload = {
    allowed_mentions: { parse: [] },
    ...payload,
  };

  // Enforce Discord constraints
  const content = truncateContent(safePayload.content);
  const embeds = Array.isArray(safePayload.embeds)
    ? safePayload.embeds.slice(0, DISCORD_MAX_EMBEDS)
    : undefined;

  // Discord requires thread_id as query param, not in body
  const url = buildWebhookUrl(webhookUrl, safePayload.thread_id);

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    opts.timeoutMs ?? 10_000
  );

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Only include fields Discord accepts
      body: JSON.stringify({
        content,
        username: safePayload.username,
        avatar_url: safePayload.avatar_url,
        embeds,
        allowed_mentions: safePayload.allowed_mentions,
      }),
      cache: 'no-store',
      signal: controller.signal,
    });

    if (res.ok) {
      // 204 No Content is typical for success
      return;
    }

    // Retry once on 429/5xx
    if ((res.status === 429 || res.status >= 500) && (opts.retry ?? true)) {
      const retryAfterHeader = res.headers.get('retry-after');
      const retryAfter =
        (retryAfterHeader ? Number(retryAfterHeader) : NaN) || 1; // seconds
      const jitterMs = Math.floor(Math.random() * 250);
      await new Promise((r) => setTimeout(r, retryAfter * 1000 + jitterMs));

      // second attempt: disable retry to avoid infinite loops
      return postToDiscord(payload, {
        ...opts,
        retry: false,
      });
    }

    const text = await res.text().catch(() => '');
    throw new Error(
      `Discord webhook failed: ${res.status} ${res.statusText} ${text}`
    );
  } finally {
    clearTimeout(timeout);
  }
}

/** Convenience helpers */
export async function postInfo(content: string) {
  return postToDiscord({ content });
}

export async function postError(message: string, error?: unknown) {
  const desc =
    '```\n' +
    (error instanceof Error
      ? `${error.name}: ${error.message}\n${error.stack ?? ''}`
      : typeof error === 'string'
      ? error
      : JSON.stringify(error, null, 2)) +
    '\n```';

  return postToDiscord({
    content: message,
    embeds: [
      {
        title: 'Error',
        description: desc,
        color: 0xff4d4f,
        timestamp: new Date().toISOString(),
      },
    ],
  });
}

/** Optional alias: keep old import names working if you used postDiscordWebhook elsewhere */
export const postDiscordWebhook = postToDiscord;
