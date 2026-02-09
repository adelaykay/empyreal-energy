'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { isValidPhone } from '@/lib/utils';
import { ArrowLeft, Save, User } from 'lucide-react';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, userProfile, refreshUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/account/profile');
      return;
    }

    if (userProfile) {
      setFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
      });
    }
  }, [user, userProfile, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;

    setLoading(true);
    setSuccess(false);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      await refreshUserProfile();
      setSuccess(true);

      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!user || !userProfile) {
    return null;
  }

  return (
    <MainLayout>
      <div className="section-padding">
        <div className="container-custom">
          {/* Back Button */}
          <Link 
            href="/account"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary-green transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Link>

          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-dark-bg" />
              </div>
              <h1 className="font-orbitron text-3xl font-bold mb-2">
                <span className="text-gradient">Edit Profile</span>
              </h1>
              <p className="text-text-muted">
                Update your account information
              </p>
            </div>

            <Card hover={false}>
              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-center">
                  ✓ Profile updated successfully! Redirecting...
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (Read-only) */}
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    disabled
                    className="input-field opacity-50 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-text-muted">
                    Email cannot be changed
                  </p>
                </div>

                {/* First Name */}
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                />

                {/* Last Name */}
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                />

                {/* Phone */}
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

                {/* Account Info */}
                <div className="p-4 bg-primary-green/5 rounded-lg border border-primary-green/10">
                  <h3 className="font-semibold text-sm mb-2">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-text-muted">Role</p>
                      <p className="font-semibold capitalize">{userProfile.role}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Member Since</p>
                      <p className="font-semibold">
                        {userProfile.createdAt && new Date(userProfile.createdAt.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Link href="/account" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1"
                    isLoading={loading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}