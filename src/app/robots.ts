import type { MetadataRoute } from 'next';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://empyrealenergy.com.ng';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/account', '/auth', '/cart', '/checkout', '/api'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
