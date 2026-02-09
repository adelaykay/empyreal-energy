'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Zap, Building, Sparkles, Check, Calendar } from 'lucide-react';

const packages = [
  {
    id: 'essential',
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
    includes: [
      'Battery & Power System',
      'Monocrystalline Panels',
      'PWM Charge Controller',
      'Complete Wiring & Setup',
      'Free Delivery (Lagos)',
    ],
  },
  {
    id: 'professional',
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
    includes: [
      '2x 200Ah Batteries (Tubular/Gel)',
      '2x 400W Solar Panels',
      'Pure Sine Wave Inverter',
      'Complete Wiring & Setup',
      'Free Delivery (Lagos)',
    ],
  },
  {
    id: 'executive',
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
    includes: [
      'Premium Dual Battery System',
      '4x Solar Panel Array',
      'MPPT Smart Controller',
      'Heavy-Duty Wiring & Setup',
      'Free Delivery (Lagos)',
    ],
  },
];

export default function ServicesPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    phone: '',
    email: '',
    address: '',
    preferredDate: '',
    additionalInfo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('booking-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedPackage) return;

    setLoading(true);

    const selectedPkg = packages.find(p => p.id === selectedPackage);
    const message = `
=== SOLAR INSTALLATION INQUIRY ===

Source: Services Page
Package: ${selectedPkg?.name} (${formatPrice(selectedPkg?.price || 0)})
Business: ${formData.businessName}
Phone: ${formData.phone}
Email: ${formData.email || 'Not provided'}
Address: ${formData.address}
Preferred Date: ${formData.preferredDate || 'Not specified'}

Additional Information:
${formData.additionalInfo || 'None'}
    `.trim();

    try {
      await addDoc(collection(db, 'inquiries'), {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        message,
        timestamp: serverTimestamp(),
      });

      setShowSuccess(true);
      setShowForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        businessName: '',
        phone: '',
        email: '',
        address: '',
        preferredDate: '',
        additionalInfo: '',
      });
      setSelectedPackage(null);

      // Scroll to success message
      setTimeout(() => {
        document.getElementById('success-message')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit request. Please try again or contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setShowSuccess(false);
    setShowForm(false);
    setSelectedPackage(null);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-transparent to-card-bg/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Installation Packages</span>
            </h1>
            <p className="text-text-muted text-lg max-w-3xl mx-auto">
              Professional solar installation designed for Nigerian businesses. 
              Choose your package and schedule a free site assessment today.
            </p>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <Card key={pkg.id} className="relative">
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge>{pkg.badge}</Badge>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-green rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-dark-bg" />
                  </div>

                  {/* Content */}
                  <h2 className="font-orbitron text-2xl font-bold mb-2">
                    {pkg.name}
                  </h2>
                  <p className="text-text-muted text-sm mb-4">{pkg.bestFor}</p>
                  
                  <div className="mb-6">
                    <div className="text-sm text-text-muted mb-1">starting from</div>
                    <div className="text-4xl font-bold text-primary-green mb-2">
                      {formatPrice(pkg.price)}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-primary-green">Powers:</h3>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary-green mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Includes */}
                  <div className="mb-6 p-4 bg-primary-green/5 rounded-xl border border-primary-green/10">
                    <h4 className="text-xs uppercase font-semibold text-primary-green mb-2">
                      Package Includes:
                    </h4>
                    <ul className="space-y-1">
                      {pkg.includes.map((item, i) => (
                        <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                          <Check className="w-3 h-3 text-primary-green mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Button 
                    className="w-full"
                    onClick={() => handleSelectPackage(pkg.id)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Free Assessment
                  </Button>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-sm text-text-muted">
            *Actual capacity varies by appliance wattage. All packages include professional installation.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      {showForm && (
        <section id="booking-form" className="section-padding">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <Card hover={false}>
                <div className="text-center mb-8">
                  <h2 className="font-orbitron text-2xl font-bold mb-2">
                    Schedule Site Assessment
                  </h2>
                  <p className="text-text-muted mb-4">
                    Our technician will visit your location to finalize installation details
                  </p>
                  {selectedPackage && (
                    <Badge className="inline-block">
                      {packages.find(p => p.id === selectedPackage)?.name} - {' '}
                      {formatPrice(packages.find(p => p.id === selectedPackage)?.price || 0)}
                    </Badge>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      required
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      required
                    />
                  </div>

                  <Input
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    error={errors.businessName}
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="08012345678"
                    required
                  />

                  <Input
                    label="Email Address (Optional)"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <Textarea
                    label="Business Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    placeholder="Please provide your complete business address including landmarks"
                    required
                  />

                  <Input
                    label="Preferred Assessment Date (Optional)"
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                  />

                  <Textarea
                    label="Additional Information (Optional)"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Any specific requirements, questions, or concerns about the installation?"
                  />

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      isLoading={loading}
                    >
                      Submit Request
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Success Message */}
      {showSuccess && (
        <section id="success-message" className="section-padding">
          <div className="container-custom">
            <div className="max-w-md mx-auto">
              <Card hover={false} className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-orbitron text-2xl font-bold mb-2">
                  Request Submitted!
                </h3>
                <p className="text-text-muted mb-6">
                  Thank you for choosing Empyreal Energy Solutions. Our team will contact you within 24 hours to schedule your site assessment.
                </p>
                <Button onClick={resetForm}>
                  Submit Another Request
                </Button>
              </Card>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}