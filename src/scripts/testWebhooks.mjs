// src/scripts/testWebhooks.mjs
import 'dotenv/config';

function log(level, message, meta) {
  console[level](
    JSON.stringify({
      level,
      message,
      meta,
      timestamp: new Date().toISOString(),
    })
  );
}

function maskDiscordWebhookUrl(url) {
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

async function postDiscordWebhook(webhookUrl, payload) {
  const masked = maskDiscordWebhookUrl(webhookUrl);
  const payloadMeta = {
    hasContent: Boolean(payload?.content),
    contentLength: payload?.content ? String(payload.content).length : 0,
    embedsCount: Array.isArray(payload?.embeds) ? payload.embeds.length : 0,
  };
  log('info', 'Posting Discord webhook', { url: masked, payload: payloadMeta });
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    log('error', 'Discord webhook failed', { url: masked, err, status: res.status });
    throw new Error(`Discord webhook error ${res.status}: ${err}`);
  }
  log('info', 'Discord webhook succeeded', { url: masked, status: res.status });
}

async function main() {
  const entries = Object.entries(process.env).filter(
    ([key, value]) =>
      key.startsWith('DISCORD') && key.endsWith('WEBHOOK_URL') && value
  );

  if (entries.length === 0) {
    log('warn', 'No webhook environment variables found');
    return;
  }

  let successCount = 0;
  let failureCount = 0;
  for (const [key, url] of entries) {
    try {
      log('info', `Testing webhook ${key}`);
      await postDiscordWebhook(url, {
        content: `Test message for ${key}`,
      });
      successCount += 1;
    } catch (err) {
      log('error', `Failed to send test message for ${key}`, { error: String(err) });
      failureCount += 1;
    }
  }

  log('info', 'Webhook test dispatch complete', {
    total: entries.length,
    successCount,
    failureCount,
  });
}

main();
