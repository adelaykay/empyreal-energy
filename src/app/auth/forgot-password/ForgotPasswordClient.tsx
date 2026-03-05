'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Mail } from 'lucide-react';
import { auth } from '@/lib/firebase/config';
import { isValidEmail } from '@/lib/utils';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export function ForgotPasswordClient() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Email address is required.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('A password reset link has been sent to your email.');
      setEmail('');
    } catch (err: any) {
      console.error('Error sending reset email:', err);
      if (err.code === 'auth/user-not-found') {
         setError('No account found with this email address.');
      } else {
         setError('Failed to send reset email. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-12 md:py-20 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Reset Password</span>
            </h1>
            <p className="text-text-muted">
              Enter your email address to receive a password reset link.
            </p>
          </div>

          <Card hover={false}>
            {successMessage ? (
              <div className="space-y-6 text-center">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md text-green-500 mb-6">
                  {successMessage}
                </div>
                <Link href="/auth/login" className="inline-block w-full">
                  <Button className="w-full">Return to Login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending Link...' : 'Send Reset Link'}
                </Button>
                
                <div className="mt-6 text-center text-sm text-text-muted">
                  Remember your password?{' '}
                  <Link href="/auth/login" className="text-primary hover:underline font-medium transition-colors">
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}