import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['600', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Empyreal Energy Solutions - Solar Power for Nigerian Businesses',
  description: 'Professional solar installation packages for Nigerian small businesses. Choose from Essential, Professional, and Executive plans to power your business with reliable solar energy.',
  keywords: 'Solar Power Nigeria, Solar Installation, Small Business Solar, Solar Energy Plans, Nigerian Solar Solutions, Empyreal Energy, Solar for Shops, Solar for Salons, Solar for Offices',
  authors: [{ name: 'Empyreal Energy Solutions' }],
  openGraph: {
    title: 'Empyreal Energy Solutions | Solar for Business',
    description: 'Professional solar installation for shops, offices, and homes in Lagos.',
    url: 'https://empyrealenergy.com.ng',
    siteName: 'Empyreal Energy Solutions',
    images: [
      {
        url: '/images/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Empyreal Energy Solutions - Solar Power for Business',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Empyreal Energy Solutions | Solar for Business',
    description: 'Professional solar installation for shops, offices, and homes in Lagos.',
    images: ['/images/og-preview.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
