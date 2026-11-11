import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Headphones, Wrench } from 'lucide-react';
import { Button } from '../ui/Button';
import { PACKAGES, formatNumber } from '@/lib/packages';
import { formatPrice } from '@/lib/utils';

export const HeroSection: React.FC = () => (
  <section className="relative overflow-hidden grid-bg">
    <div className="absolute inset-0 -z-10 bg-gradient-radial from-primary-green/10 via-transparent to-transparent" />
    <div className="container-custom py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7 animate-fade-in">
        <p className="eyebrow mb-5">Solar for Nigerian businesses</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
          Stop paying for fuel.{' '}
          <span className="text-gradient glow-green">Run on the sun.</span>
        </h1>
        <p className="text-lg md:text-xl text-text-muted mb-8 max-w-xl">
          Complete solar and battery systems for shops, salons, pharmacies and offices in Lagos. Fixed price,
          professional installation, no generator noise.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Link href="/services#booking">
            <Button size="lg" className="w-full sm:w-auto">
              Book a free site assessment <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">View packages</Button>
          </Link>
        </div>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-text-muted">
          <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary-green" /> 5-year warranty</li>
          <li className="flex items-center gap-2"><Wrench className="w-4 h-4 text-primary-green" /> Installation included</li>
          <li className="flex items-center gap-2"><Headphones className="w-4 h-4 text-primary-green" /> 24/7 support</li>
        </ul>
      </div>

      <div className="lg:col-span-5">
        <div className="glass rounded-3xl p-6 md:p-8">
          <p className="eyebrow mb-4">Sizing at a glance</p>
          <div className="divide-y divide-primary-green/10">
            {PACKAGES.map((p) => (
              <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div>
                  <div className="font-orbitron font-semibold">{p.name.replace('The ', '')}</div>
                  <div className="text-xs text-text-muted">
                    {formatNumber(p.backupWh)} Wh backup · {formatNumber(p.solarW)} W solar
                  </div>
                </div>
                <div className="text-primary-green font-bold whitespace-nowrap">{formatPrice(p.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
