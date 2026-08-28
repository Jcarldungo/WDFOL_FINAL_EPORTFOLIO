import type { MetadataRoute } from 'next';

const BASE = 'https://janncarl.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: BASE, lastModified: new Date() }];
}
