'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/order';
import { getCollection } from '@/lib/firebase/firestore';
import { where, orderBy, limit } from 'firebase/firestore';
import { formatPrice, formatDate } from '@/lib/utils';
import { User, Package, LogOut, ShoppingBag } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, userProfile, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/account');
      return;
    }

    const fetchOrders = async () => {
      try {
        const userOrders = await getCollection<Order>('orders', [
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5),
        ]);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user || !userProfile) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'primary';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <MainLayout>
      <div className="section-padding">
        <div className="container-custom">
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-8">
            <span className="text-gradient">My Account</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card hover={false}>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-primary-green/10">
                  <div className="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-dark-bg" />
                  </div>
                  <div>
                    <h2 className="font-orbitron font-bold text-lg">
                      {userProfile.firstName} {userProfile.lastName}
                    </h2>
                    <p className="text-sm text-text-muted">{userProfile.email}</p>
                  </div>
                </div>

                <nav className="space-y-2 mb-6">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-green/10 text-primary-green"
                  >
                    <Package className="w-5 h-5" />
                    <span className="font-semibold">Orders</span>
                  </Link>
                  <Link
                    href="/account/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-primary-green/5 hover:text-primary-green transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-semibold">Profile</span>
                  </Link>
                </nav>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-400 hover:bg-red-400/5 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-semibold">Logout</span>
                </button>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Orders */}
              <Card hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-orbitron text-xl font-bold">Recent Orders</h2>
                  {orders.length > 0 && (
                    <Link href="/account/orders" className="text-primary-green hover:underline text-sm">
                      View All
                    </Link>
                  )}
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="spinner w-6 h-6" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-primary-green" />
                    </div>
                    <h3 className="font-orbitron font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-text-muted mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Link href="/products">
                      <Button>Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-primary-green/10 rounded-lg p-4 hover:border-primary-green/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-orbitron font-semibold mb-1">
                              Order #{order.orderNumber}
                            </p>
                            <p className="text-sm text-text-muted">
                              {order.createdAt && formatDate(order.createdAt.toDate())}
                            </p>
                          </div>
                          <Badge variant={getStatusColor(order.orderStatus) as any}>
                            {order.orderStatus}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-text-muted">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </div>
                          <div className="text-lg font-bold text-primary-green">
                            {formatPrice(order.total)}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-primary-green/10">
                          <Link href={`/account/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Account Info */}
              <Card hover={false}>
                <h2 className="font-orbitron text-xl font-bold mb-6">Account Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Email</p>
                    <p className="font-semibold">{userProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">Phone</p>
                    <p className="font-semibold">{userProfile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">Role</p>
                    <p className="font-semibold capitalize">{userProfile.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">Member Since</p>
                    <p className="font-semibold">
                      {userProfile.createdAt && formatDate(userProfile.createdAt.toDate())}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/account/profile">
                    <Button variant="secondary" size="sm">
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}