'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-primary-green/10 animate-slide-down">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 animate-pulse-glow">
              <Image
                src="/images/empyreal_energy_logo.png"
                alt="Empyreal Energy"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="hidden sm:block font-orbitron text-xl md:text-2xl font-bold text-gradient">
              Empyreal Energy
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-text-light hover:text-primary-green transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-text-light hover:text-primary-green transition-colors"
            >
              Products
            </Link>
            <Link 
              href="/services" 
              className="text-text-light hover:text-primary-green transition-colors"
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className="text-text-light hover:text-primary-green transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-text-light hover:text-primary-green transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-2 text-text-light hover:text-primary-green transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-green text-dark-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-primary-green hover:bg-primary-green/10 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-light hover:text-primary-green transition-colors"
                >
                  <User className="w-4 h-4" />
                  {userProfile?.firstName || 'Account'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-text-light hover:text-primary-green transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm bg-gradient-green text-dark-bg rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-light hover:text-primary-green transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-green/10 animate-fade-in">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-text-light hover:text-primary-green hover:bg-primary-green/5 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-text-light hover:text-primary-green hover:bg-primary-green/5 rounded-lg transition-colors"
              >
                Products
              </Link>
              <Link 
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-text-light hover:text-primary-green hover:bg-primary-green/5 rounded-lg transition-colors"
              >
                Services
              </Link>
              <Link 
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-text-light hover:text-primary-green hover:bg-primary-green/5 rounded-lg transition-colors"
              >
                About
              </Link>
              <Link 
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-text-light hover:text-primary-green hover:bg-primary-green/5 rounded-lg transition-colors"
              >
                Contact
              </Link>

              {user ? (
                <>
                  <div className="border-t border-primary-green/10 my-2" />
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-primary-green hover:bg-primary-green/5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-text-light hover:text-primary-green hover:bg-primary-green/5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-left text-red-400 hover:bg-red-400/5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-primary-green/10 my-2" />
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-text-light hover:text-primary-green hover:bg-primary-green/5 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-4 py-3 text-center bg-gradient-green text-dark-bg rounded-lg font-semibold hover:scale-105 transition-transform"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
