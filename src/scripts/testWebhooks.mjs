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

async function postDiscordWebhook(webhookUrl, payload) {
  log('info', 'Posting Discord webhook', { webhookUrl, payload });
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    log('error', 'Discord webhook failed', {
      webhookUrl,
      err,
      status: res.status,
    });
    throw new Error(`Discord webhook error ${res.status}: ${err}`);
  }
  log('info', 'Discord webhook succeeded', { webhookUrl });
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

  for (const [key, url] of entries) {
    try {
      log('info', `Testing webhook ${key}`);
      await postDiscordWebhook(url, {
        content: `Test message for ${key}`,
      });
    } catch (err) {
      log('error', `Failed to send test message for ${key}`, err);
    }
  }
}

main();
