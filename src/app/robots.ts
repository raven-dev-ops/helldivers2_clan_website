import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { logger } from '@/lib/logger';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
  // Next 15: headers() returns a Promise<ReadonlyHeaders>
  const h = await headers();
  const userAgent = h.get('user-agent');

  logger.info('robots.txt requested', { userAgent });

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
