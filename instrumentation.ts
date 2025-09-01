import * as Sentry from '@sentry/nextjs';

export const onRequestError = Sentry.captureRequestError;

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
    // Opportunistically warm Mongo connection pool on boot without failing startup
    try {
      const { default: dbConnect } = await import('@/lib/dbConnect');
      // Fire and forget warmup; do not block boot
      dbConnect().catch(() => {});
    } catch {}
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
