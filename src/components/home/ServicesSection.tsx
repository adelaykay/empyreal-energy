import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { PackageCard } from './PackageCard';
import { PACKAGES, CAPACITY_NOTE } from '@/lib/packages';

export const ServicesSection: React.FC = () => (
  <section className="section-padding" id="packages">
    <div className="container-custom">
      <div className="text-center mb-14">
        <p className="eyebrow mb-3">Solar packages</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Sized by <span className="text-gradient">watt-hours</span>, not guesswork
        </h2>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Pick the backup capacity and solar supply your business needs. Professional installation is included.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {PACKAGES.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg}>
            <Link href="/services#booking">
              <Button variant="secondary" className="w-full">Book free assessment</Button>
            </Link>
          </PackageCard>
        ))}
      </div>
      <p className="text-center text-xs text-text-muted max-w-2xl mx-auto">{CAPACITY_NOTE}</p>
    </div>
  </section>
);
