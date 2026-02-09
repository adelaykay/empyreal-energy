import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Award, Users, Zap, Shield, Phone, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">About Empyreal Energy</span>
            </h1>
            <p className="text-text-muted text-lg max-w-3xl mx-auto">
              Leading provider of solar energy solutions for Nigerian businesses. 
              We combine engineering excellence with practical energy systems to power your success.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="max-w-4xl mx-auto mb-12" hover={false}>
            <div className="text-center p-8">
              <h2 className="font-orbitron text-2xl font-bold mb-4 text-primary-green">
                Our Mission
              </h2>
              <p className="text-lg text-text-light leading-relaxed">
                To empower Nigerian businesses with reliable, affordable solar energy solutions 
                that reduce dependence on generators and grid power, while contributing to a 
                cleaner, more sustainable future.
              </p>
            </div>
          </Card>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="font-orbitron text-3xl font-bold text-center mb-8">
              Why Choose <span className="text-gradient">Empyreal Energy</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <div className="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-dark-bg" />
                </div>
                <h3 className="font-orbitron font-semibold mb-2">Expert Engineering</h3>
                <p className="text-sm text-text-muted">
                  Led by qualified engineers with deep technical expertise
                </p>
              </Card>

              <Card className="text-center">
                <div className="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-dark-bg" />
                </div>
                <h3 className="font-orbitron font-semibold mb-2">500+ Installations</h3>
                <p className="text-sm text-text-muted">
                  Proven track record across Lagos businesses
                </p>
              </Card>

              <Card className="text-center">
                <div className="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-dark-bg" />
                </div>
                <h3 className="font-orbitron font-semibold mb-2">5-Year Warranty</h3>
                <p className="text-sm text-text-muted">
                  Comprehensive warranty on all installations
                </p>
              </Card>

              <Card className="text-center">
                <div className="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-dark-bg" />
                </div>
                <h3 className="font-orbitron font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-text-muted">
                  Always available when you need assistance
                </p>
              </Card>
            </div>
          </div>

          {/* Technical Leadership */}
          <div className="mb-16">
            <h2 className="font-orbitron text-3xl font-bold text-center mb-8">
              Technical <span className="text-gradient">Leadership</span>
            </h2>
            <Card className="max-w-3xl mx-auto" hover={false}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-32 h-32 bg-gradient-green rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-16 h-16 text-dark-bg" />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="font-orbitron text-xl font-bold mb-2">
                    <a 
                      href="https://www.linkedin.com/in/adeleke-olasope-0a097b19b/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-green hover:underline"
                    >
                      Engr. Adeleke Olasope
                    </a>
                  </h3>
                  <p className="text-text-muted mb-4">
                    Founder & Lead Engineer
                  </p>
                  <p className="text-text-light leading-relaxed">
                    With a background in civil engineering and extensive experience in energy systems, 
                    Engr. Adeleke brings precision and reliability to every installation. His commitment 
                    to quality and customer satisfaction has made Empyreal Energy a trusted name in 
                    Nigerian solar solutions.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Our Process */}
          <div className="mb-16">
            <h2 className="font-orbitron text-3xl font-bold text-center mb-8">
              Our <span className="text-gradient">Installation Process</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '1',
                  title: 'Site Assessment',
                  description: 'Free on-site evaluation of your power needs and property'
                },
                {
                  step: '2',
                  title: 'Custom Design',
                  description: 'Tailored solar system design based on your requirements'
                },
                {
                  step: '3',
                  title: 'Professional Install',
                  description: 'Expert installation with safety and quality checks'
                },
                {
                  step: '4',
                  title: 'Ongoing Support',
                  description: '24/7 technical support and maintenance services'
                }
              ].map((item) => (
                <Card key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-gradient-green rounded-full flex items-center justify-center mx-auto mb-4 font-orbitron font-bold text-2xl text-dark-bg">
                    {item.step}
                  </div>
                  <h3 className="font-orbitron font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-text-muted">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="text-center p-12 bg-gradient-to-br from-primary-green/10 to-secondary-green/10" hover={false}>
            <h2 className="font-orbitron text-3xl font-bold mb-4">
              Ready to Go Solar?
            </h2>
            <p className="text-text-muted mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied businesses across Lagos enjoying reliable, 
              cost-effective solar power.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button size="lg">
                  View Packages
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}