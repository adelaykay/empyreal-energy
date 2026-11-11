'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { PackageCard } from '@/components/home/PackageCard';
import { PACKAGES, CAPACITY_NOTE, formatNumber } from '@/lib/packages';
import { formatPrice } from '@/lib/utils';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Check, Calendar } from 'lucide-react';

const EMPTY = {
  firstName: '', lastName: '', businessName: '', phone: '',
  email: '', address: '', preferredDate: '', additionalInfo: '',
};

export default function ServicesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selected = PACKAGES.find((p) => p.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setShowSuccess(false);
    setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'First name is required';
    if (!formData.lastName.trim()) e.lastName = 'Last name is required';
    if (!formData.businessName.trim()) e.businessName = 'Business name is required';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    if (!formData.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || !selected) return;
    setLoading(true);
    const message = `
=== SOLAR INSTALLATION INQUIRY ===

Source: Services Page
Package: ${selected.name} (${formatPrice(selected.price)}) - ${formatNumber(selected.backupWh)}Wh backup, ${formatNumber(selected.solarW)}W solar
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
      setFormData(EMPTY);
      setSelectedId(null);
      setTimeout(() => document.getElementById('success-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      alert('Failed to submit request. Please try again or contact us via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <MainLayout>
      <section className="section-padding grid-bg">
        <div className="container-custom">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Installation packages</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Solar packages for <span className="text-gradient">Lagos businesses</span>
            </h1>
            <p className="text-text-muted text-lg max-w-3xl mx-auto">
              Choose the backup capacity and solar supply that fit your load. Book a free site assessment and we
              will confirm the final design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} showIncludes>
                <Button className="w-full" onClick={() => handleSelect(pkg.id)}>
                  <Calendar className="w-4 h-4 mr-2" /> Book free assessment
                </Button>
              </PackageCard>
            ))}
          </div>
          <p className="text-center text-xs text-text-muted max-w-2xl mx-auto">{CAPACITY_NOTE}</p>
        </div>
      </section>

      <section id="booking" className="section-padding pt-0">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            {selected && (
              <Card hover={false}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Schedule site assessment</h2>
                  <p className="text-text-muted mb-4">Our technician will visit to finalise installation details.</p>
                  <Badge className="inline-block">{selected.name} - {formatPrice(selected.price)}</Badge>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
                    <Input label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} required />
                  </div>
                  <Input label="Business name" name="businessName" value={formData.businessName} onChange={handleChange} error={errors.businessName} required />
                  <Input label="Phone number" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="08012345678" required />
                  <Input label="Email address (optional)" type="email" name="email" value={formData.email} onChange={handleChange} />
                  <Textarea label="Business address" name="address" value={formData.address} onChange={handleChange} error={errors.address} placeholder="Full address including landmarks" required />
                  <Input label="Preferred assessment date (optional)" type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} />
                  <Textarea label="Additional information (optional)" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} placeholder="Appliances you want to run, questions, concerns..." />
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedId(null)}>Cancel</Button>
                    <Button type="submit" className="flex-1" isLoading={loading}>Submit request</Button>
                  </div>
                </form>
              </Card>
            )}
            {!selected && !showSuccess && (
              <p className="text-center text-text-muted">Select a package above to book your free site assessment.</p>
            )}
            {showSuccess && (
              <div id="success-message">
                <Card hover={false} className="text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Request submitted</h3>
                  <p className="text-text-muted">
                    Thank you for choosing Empyreal Energy Solutions. Our team will contact you within 24 hours.
                  </p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
