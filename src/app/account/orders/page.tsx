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
import { where, orderBy } from 'firebase/firestore';
import { formatPrice, formatDate } from '@/lib/utils';
import { ArrowLeft, Package, ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/account/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        const userOrders = await getCollection<Order>('orders', [
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
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

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'primary';
      case 'processing':
      case 'confirmed':
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
          {/* Back Button */}
          <Link 
            href="/account"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary-green transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Order History</span>
            </h1>
            <p className="text-text-muted">
              View and track all your orders
            </p>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="spinner w-8 h-8" />
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center py-12" hover={false}>
              <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-primary-green" />
              </div>
              <h2 className="font-orbitron text-2xl font-bold mb-2">No Orders Yet</h2>
              <p className="text-text-muted mb-6">
                You haven't placed any orders yet
              </p>
              <Link href="/products">
                <Button>Start Shopping</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => (
                <Card key={order.id} hover={false}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-orbitron text-lg font-bold mb-1">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-text-muted">
                            {order.createdAt && formatDate(order.createdAt.toDate())}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(order.orderStatus) as any}>
                          {order.orderStatus}
                        </Badge>
                      </div>

                      {/* Items Summary */}
                      <div className="flex items-center gap-4 text-sm text-text-muted mt-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-primary-green">
                          {formatPrice(order.total)}
                        </div>
                      </div>

                      {/* Items List (first 3) */}
                      <div className="mt-3 space-y-1">
                        {order.items.slice(0, 3).map((item, index) => (
                          <p key={index} className="text-sm text-text-muted">
                            • {item.name} (×{item.quantity})
                          </p>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-text-muted">
                            + {order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:min-w-[160px]">
                      <Link href={`/account/orders/${order.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      {order.orderStatus === 'delivered' && (
                        <Button variant="secondary" size="sm" className="flex-1">
                          Buy Again
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Help Section */}
          {orders.length > 0 && (
            <Card className="mt-8 bg-primary-green/5 border-primary-green/20" hover={false}>
              <div className="text-center">
                <h3 className="font-orbitron font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-text-muted mb-4">
                  Have questions about your orders? We're here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/contact">
                    <Button variant="secondary" size="sm">
                      Contact Support
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/2348021482053"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      WhatsApp Us
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}