import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

// Recursively discover all route paths based on the Next.js app directory
function getRoutes(dir: string, base = ''): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Skip folders that shouldn't appear in the sitemap
      if (['api', 'components'].includes(entry.name)) continue;

      // Route groups like (main) are not part of the URL
      const segment =
        entry.name.startsWith('(') && entry.name.endsWith(')')
          ? ''
          : `/${entry.name}`;
      routes.push(...getRoutes(path.join(dir, entry.name), base + segment));
    } else if (/^page\.(t|j)sx?$/.test(entry.name)) {
      routes.push(base || '/');
    }
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
  const appDir = path.join(process.cwd(), 'src', 'app');
  const pages = Array.from(new Set(getRoutes(appDir)));

  return pages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
