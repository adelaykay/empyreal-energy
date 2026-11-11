import type { Metadata, Viewport } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', weight: ['600', '700', '800'], display: 'swap' });

const SITE = 'https://empyrealenergy.com.ng';

export const viewport: Viewport = { themeColor: '#0A0F1C', width: 'device-width', initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Empyreal Energy Solutions | Solar & Battery Systems for Lagos Businesses',
    template: '%s | Empyreal Energy Solutions',
  },
  description:
    'Complete solar and battery backup systems for Lagos shops, salons, pharmacies and offices. Fixed prices from ₦850,000, professional installation and a 5-year warranty.',
  keywords: [
    'solar installation Lagos', 'solar power for business Nigeria', 'solar inverter battery Lagos',
    'solar for shops', 'solar for salons', 'solar for offices', 'Empyreal Energy',
  ],
  authors: [{ name: 'Empyreal Energy Solutions' }],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Empyreal Energy Solutions | Solar for Business',
    description: 'Fixed-price solar packages with professional installation for Lagos businesses.',
    url: SITE,
    siteName: 'Empyreal Energy Solutions',
    images: [{ url: '/images/og-preview.png', width: 1200, height: 630, alt: 'Empyreal Energy Solutions - Solar Power for Business' }],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Empyreal Energy Solutions | Solar for Business',
    description: 'Fixed-price solar packages with professional installation for Lagos businesses.',
    images: ['/images/og-preview.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE}/#business`,
  name: 'Empyreal Energy Solutions',
  url: SITE,
  logo: `${SITE}/images/empyreal_energy_logo.png`,
  image: `${SITE}/images/og-preview.png`,
  telephone: '+2347072773143',
  email: 'info@empyrealenergy.com.ng',
  address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
  areaServed: { '@type': 'AdministrativeArea', name: 'Lagos' },
  priceRange: '₦₦₦',
  description: 'Solar and battery backup system installation for businesses in Lagos, Nigeria.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${inter.variable} ${orbitron.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
