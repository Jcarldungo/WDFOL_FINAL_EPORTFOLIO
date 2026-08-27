import type { MetadataRoute } from 'next';
import { projects } from '@/lib/content';

const BASE = 'https://janncarl.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/about', '/projects', '/contact'].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
  }));
  const projectRoutes = projects.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: now,
  }));
  return [...staticRoutes, ...projectRoutes];
}
