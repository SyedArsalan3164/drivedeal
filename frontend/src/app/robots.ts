import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login', '/signup'],
    },
    sitemap: 'https://www.drivedeal.tech/sitemap.xml',
  };
}
