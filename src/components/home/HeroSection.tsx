'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary-green/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-secondary-green/5 to-transparent" />
      </div>

      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Power Your Business with{' '}
            <span className="text-gradient glow-green">Solar Energy</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-text-muted mb-8 max-w-2xl mx-auto">
            Professional solar installation packages designed for Nigerian small businesses. 
            Reliable power, predictable costs, unlimited potential.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                Shop Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Services
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-orbitron font-bold text-primary-green mb-2">500+</div>
              <div className="text-sm text-text-muted">Installations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-orbitron font-bold text-primary-green mb-2">5 Years</div>
              <div className="text-sm text-text-muted">Warranty</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-orbitron font-bold text-primary-green mb-2">24/7</div>
              <div className="text-sm text-text-muted">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
