import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { logger } from '@/lib/logger';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
  const userAgent = headers().get('user-agent');

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
