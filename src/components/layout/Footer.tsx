import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { PACKAGES } from '@/lib/packages';

export const Footer: React.FC = () => (
  <footer className="bg-card-bg/60 border-t border-primary-green/10 mt-20">
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="font-orbitron text-xl font-bold text-gradient mb-4">Empyreal Energy</h3>
          <p className="text-text-muted text-sm max-w-sm">
            Solar and battery backup systems for Nigerian businesses. Reliable power, predictable costs.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="text-text-muted hover:text-primary-green">Packages</Link></li>
            {PACKAGES.map((p) => (
              <li key={p.id}>
                <Link href="/services" className="text-text-muted hover:text-primary-green">{p.name}</Link>
              </li>
            ))}
            <li><Link href="/about" className="text-text-muted hover:text-primary-green">About us</Link></li>
            <li><Link href="/contact" className="text-text-muted hover:text-primary-green">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-text-muted">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary-green mt-0.5" /> Lagos, Nigeria</li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary-green" />
              <a href="tel:+2347072773143" className="hover:text-primary-green">+234 707 277 3143</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-green" />
              <a href="mailto:info@empyrealenergy.com.ng" className="hover:text-primary-green">info@empyrealenergy.com.ng</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-green/10 mt-8 pt-8 text-center text-sm text-text-muted">
        &copy; {new Date().getFullYear()} Empyreal Energy Solutions. Managed by{' '}
        <a href="https://www.linkedin.com/company/empyreal-digital-works/" target="_blank" rel="noopener noreferrer" className="text-primary-green hover:underline">
          Empyreal Digital Works
        </a>
      </div>
    </div>
  </footer>
);
