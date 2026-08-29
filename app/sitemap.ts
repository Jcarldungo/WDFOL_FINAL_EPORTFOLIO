import type { MetadataRoute } from 'next';
import { publishedProjects } from '@/lib/content';

const BASE = 'https://janncarl.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date() },
    ...publishedProjects.map((p) => ({
      url: `${BASE}/work/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}
