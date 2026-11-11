import type { Metadata } from 'next';
import { PACKAGES } from '@/lib/packages';

export const metadata: Metadata = {
  title: 'Solar Packages & Installation in Lagos',
  description:
    'Solar and battery packages for Lagos shops, salons, pharmacies and offices from ₦850,000. 2,400Wh to 9,600Wh backup, 900W to 3,600W solar. Free site assessment.',
  alternates: { canonical: '/services' },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Empyreal Energy solar packages',
    itemListElement: PACKAGES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: `${p.name} solar package`,
        description: `${p.backupWh}Wh battery backup and ${p.solarW}W solar supply. ${p.bestFor}.`,
        areaServed: 'Lagos, Nigeria',
        provider: { '@type': 'Organization', name: 'Empyreal Energy Solutions' },
        offers: { '@type': 'Offer', price: p.price, priceCurrency: 'NGN', availability: 'https://schema.org/InStock' },
      },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
