import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Talk to Empyreal Energy Solutions in Lagos about solar and battery systems. Call +234 707 277 3143, WhatsApp, or send a message. We reply within 24 hours.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
