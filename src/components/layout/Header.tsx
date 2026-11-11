'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Packages' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const Header: React.FC = () => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-primary-green/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-18 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/images/empyreal_energy_logo.png" alt="Empyreal Energy" fill className="object-contain" priority />
            </div>
            <span className="hidden sm:block font-orbitron text-lg font-bold text-gradient">Empyreal Energy</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm text-text-light/80 hover:text-primary-green transition-colors">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/services#booking"
              className="hidden md:inline-flex px-4 py-2 text-sm bg-gradient-green text-dark-bg rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Free assessment
            </Link>
            {user && (
              <div className="hidden md:flex items-center">
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-primary-green hover:bg-primary-green/10 rounded-lg">
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link href="/account" className="flex items-center gap-2 px-3 py-2 text-sm text-text-light hover:text-primary-green">
                  <User className="w-4 h-4" /> {userProfile?.firstName || 'Account'}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-red-400">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-text-light hover:text-primary-green"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-primary-green/10 animate-fade-in">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="px-4 py-3 text-text-light hover:text-primary-green hover:bg-primary-green/5 rounded-lg">
                  {n.label}
                </Link>
              ))}
              <Link href="/services#booking" onClick={() => setOpen(false)} className="mx-4 mt-2 py-3 text-center bg-gradient-green text-dark-bg rounded-xl font-semibold">
                Free assessment
              </Link>
              {user && (
                <>
                  <div className="border-t border-primary-green/10 my-2" />
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setOpen(false)} className="px-4 py-3 text-primary-green flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Admin dashboard
                    </Link>
                  )}
                  <Link href="/account" onClick={() => setOpen(false)} className="px-4 py-3 text-text-light flex items-center gap-2">
                    <User className="w-4 h-4" /> My account
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-3 text-left text-red-400 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
