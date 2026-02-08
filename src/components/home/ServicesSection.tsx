import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Zap, Building, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const services = [
  {
    name: 'The Essential',
    badge: 'Most Popular',
    icon: Zap,
    bestFor: 'Small Shops • Kiosks • Barbers',
    price: 756000,
    features: [
      '4-6 LED Bulbs',
      '2 Standing Fans',
      '1 Laptop / POS System',
      'Phone Charging Station',
    ],
  },
  {
    name: 'The Professional',
    badge: 'Best Value',
    icon: Building,
    bestFor: 'Salons • Pharmacies • Business Centers',
    price: 1140000,
    features: [
      '8-10 LED Bulbs',
      '4 Standing Fans',
      '1 Small Fridge or Freezer',
      '2 Laptops / TV / Sound System',
    ],
  },
  {
    name: 'The Executive',
    badge: 'Premium',
    icon: Sparkles,
    bestFor: 'Offices • Mini-Marts • Advanced Setups',
    price: 1400000,
    features: [
      '15+ LED Bulbs',
      '5 Standing Fans',
      '1 Inverter AC (1HP)',
      '1 Large Fridge/Freezer',
      'Multiple Laptops & Workstations',
    ],
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-transparent to-card-bg/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Installation Packages</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Complete solar solutions tailored to your business needs. 
            Professional installation included.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="badge">{service.badge}</span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-dark-bg" />
                </div>

                {/* Content */}
                <h3 className="font-orbitron text-2xl font-bold mb-2">
                  {service.name}
                </h3>
                <p className="text-text-muted text-sm mb-4">{service.bestFor}</p>
                
                <div className="mb-6">
                  <div className="text-sm text-text-muted mb-1">starting from</div>
                  <div className="text-3xl font-bold text-primary-green">
                    {formatPrice(service.price)}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                      <span className="text-primary-green mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/services">
            <Button size="lg">
              View All Service Packages
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
