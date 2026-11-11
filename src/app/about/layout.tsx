import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Empyreal Energy Solutions',
  description:
    'Engineer-led solar installation for Lagos businesses. Meet Engr. Adeleke Olasope and see how our site assessment, design and installation process works.',
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
