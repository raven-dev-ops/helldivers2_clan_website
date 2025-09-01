// src/scripts/scheduler.mjs

const baseUrl = process.env.SCHEDULER_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://gptfleet.com';
const token = process.env.CRON_SECRET;

if (!token) {
	console.error('CRON_SECRET is required for scheduler');
	process.exit(1);
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function post(path) {
	const url = `${baseUrl.replace(/\/$/, '')}${path}`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});
	if (!res.ok) {
		const txt = await res.text().catch(() => '');
		console.error(JSON.stringify({ level: 'error', message: 'scheduler_post_failed', meta: { url, status: res.status, err: txt }, timestamp: new Date().toISOString() }));
		return false;
	}
	console.log(JSON.stringify({ level: 'info', message: 'scheduler_post_ok', meta: { url, status: res.status }, timestamp: new Date().toISOString() }));
	return true;
}

async function runOnce() {
	// Trigger war-news (up to 3 items)
	await post('/api/cron/post-war-news');
	// Trigger leaderboards (all scopes and partner channels)
	await post('/api/cron/post-leaderboards');
}

async function main() {
	const mode = process.env.SCHEDULER_MODE || 'interval';
	if (mode === 'once') {
		await runOnce();
		return;
	}
	// Default: loop forever, every 10 minutes with jitter up to ±60s
	const baseMs = Number(process.env.SCHEDULER_INTERVAL_MS || 10 * 60 * 1000);
	while (true) {
		try {
			await runOnce();
		} catch (e) {
			console.error(JSON.stringify({ level: 'error', message: 'scheduler_run_error', meta: { error: String(e) }, timestamp: new Date().toISOString() }));
		}
		const jitter = Math.floor((Math.random() - 0.5) * 120_000); // ±60s
		await sleep(baseMs + jitter);
	}
}

main().catch((e) => {
	console.error(JSON.stringify({ level: 'error', message: 'scheduler_fatal', meta: { error: String(e) }, timestamp: new Date().toISOString() }));
	process.exit(1);
});