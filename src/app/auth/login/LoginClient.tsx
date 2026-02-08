// app/auth/login/LoginClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { isValidEmail } from '@/lib/utils';
import { LogIn } from 'lucide-react';

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login } = useAuth();

  const redirectPath = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (user) router.push(redirectPath);
  }, [user, router, redirectPath]);

  // ⬇️ everything else stays exactly the same
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      router.push(redirectPath);
    } else {
      setGeneralError(result.error || 'Failed to login. Please check your credentials.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-dark-bg" />
              </div>
              <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-2">
                <span className="text-gradient">Welcome Back</span>
              </h1>
              <p className="text-text-muted">
                Login to your Empyreal Energy account
              </p>
            </div>

            <Card hover={false}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {generalError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {generalError}
                  </div>
                )}

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="your@email.com"
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="••••••••"
                  required
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-text-muted cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Remember me</span>
                  </label>
                  <Link 
                    href="/auth/reset-password" 
                    className="text-primary-green hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={loading}
                >
                  Login
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-primary-green/10 text-center">
                <p className="text-text-muted text-sm">
                  Don't have an account?{' '}
                  <Link 
                    href={`/auth/register${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`}
                    className="text-primary-green hover:underline font-semibold"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </Card>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-text-muted text-sm">
                By logging in, you agree to our{' '}
                <Link href="/terms" className="text-primary-green hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-green hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
