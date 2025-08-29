// src/lib/discordWebhook.ts

export async function postDiscordWebhook(
  webhookUrl: string,
  payload: { content?: string; embeds?: unknown[] }
) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Discord webhook error ${res.status}: ${err}`);
  }
}
