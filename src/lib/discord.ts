const DISCORD_API = 'https://discord.com/api/v10';

function withTimeout<T>(p: Promise<T>, ms = 8000): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return Promise.race([
    p.finally(() => clearTimeout(t)),
    // @ts-ignore
  ]);
}

export async function getUserGuildMember(accessToken: string, guildId: string) {
  try {
    const res = await withTimeout(fetch(`${DISCORD_API}/users/@me/guilds/${guildId}/member`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }));
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
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });
  } catch { /* ignore */ }
}
