import { logger } from '@/lib/logger';

function maskDiscordWebhookUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const isDiscordWebhook = parts[0] === 'api' && parts[1] === 'webhooks';
    if (isDiscordWebhook && parts.length >= 3) {
      const id = parts[2];
      return `${parsed.hostname}/api/webhooks/${id}/***`;
    }
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return 'invalid_url';
  }
}
const DISCORD_API = 'https://discord.com/api/v10';

function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    timeoutPromise,
  ]);
}

export async function getUserGuildMember(accessToken: string, guildId: string) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`${DISCORD_API}/users/@me/guilds/${guildId}/member`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
      signal: ctrl.signal,
    }).finally(() => clearTimeout(t));
    if (res.status === 401 || res.status === 403) {
      return { error: 'forbidden_or_expired', status: res.status };
    }
    if (res.status === 404) {
      return { error: 'not_in_guild_or_app_missing', status: 404 };
    }
    if (!res.ok) {
      return { error: `discord_${res.status}`, status: res.status };
    }
    return await res.json(); // { user, nick, roles: string[], ... }
  } catch (e) {
    return { error: 'network_or_timeout' };
  }
}

export async function getGuildRolesViaBot(guildId: string, botToken?: string) {
  if (!botToken) return null;
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${botToken}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return (await res.json()) as Array<{ id: string; name: string }>;
}

export async function postDiscordWebhook(message: string) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;
  try {
    const masked = maskDiscordWebhookUrl(url);
    logger.info('Posting default Discord webhook', {
      url: masked,
      payload: { hasContent: Boolean(message), contentLength: String(message ?? '').length },
    });
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      logger.error('Default Discord webhook failed', { url: masked, status: res.status, err });
      return;
    }
    logger.info('Default Discord webhook succeeded', { url: masked });
  } catch (e) {
    logger.error('Default Discord webhook threw', { error: String(e) });
  }
}
