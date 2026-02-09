'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, Home } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();

  // Redirect if not admin
  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/admin');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card-bg/95 backdrop-blur-md border-b border-primary-green/10">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-orbitron font-bold text-gradient">
              Empyreal Energy
            </Link>
            <span className="px-3 py-1 bg-primary-green/10 text-primary-green text-xs font-semibold rounded-full">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-primary-green transition-colors"
            >
              <Home className="w-4 h-4" />
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-4rem)] bg-card-bg border-r border-primary-green/10">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-green/10 text-primary-green'
                      : 'text-text-muted hover:bg-primary-green/5 hover:text-primary-green'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card-bg border-t border-primary-green/10 px-4 py-3 flex justify-around z-50">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-primary-green' : 'text-text-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}