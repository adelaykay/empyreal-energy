'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/order';
import { getDocument } from '@/lib/firebase/firestore';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { ArrowLeft, Package, MapPin, CreditCard, Truck } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/account/orders');
      return;
    }

    const fetchOrder = async () => {
      try {
        const orderData = await getDocument<Order>('orders', orderId);
        
        // Verify order belongs to user
        if (orderData && orderData.userId !== user.uid) {
          router.push('/account');
          return;
        }
        
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, router]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="section-padding">
          <div className="container-custom">
            <div className="flex justify-center items-center py-20">
              <div className="spinner w-8 h-8" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="section-padding">
          <div className="container-custom">
            <Card className="max-w-md mx-auto text-center py-12" hover={false}>
              <h2 className="font-orbitron text-2xl font-bold mb-4">Order Not Found</h2>
              <p className="text-text-muted mb-6">
                This order doesn't exist or you don't have permission to view it.
              </p>
              <Link href="/account">
                <Button>Back to Account</Button>
              </Link>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-orbitron text-3xl font-bold mb-2">
                Order <span className="text-gradient">#{order.orderNumber}</span>
              </h1>
              <p className="text-text-muted">
                Placed on {order.createdAt && formatDateTime(order.createdAt.toDate())}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant={getStatusColor(order.orderStatus) as any}>
                {order.orderStatus.toUpperCase()}
              </Badge>
              <Badge variant={getPaymentStatusColor(order.paymentStatus) as any}>
                Payment: {order.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-green/10 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-green" />
                  </div>
                  <h2 className="font-orbitron text-xl font-bold">Order Items</h2>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 pb-4 border-b border-primary-green/10 last:border-0 last:pb-0"
                    >
                      <div className="relative w-20 h-20 bg-dark-bg rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-text-muted mb-2">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-text-muted">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-green">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Delivery Address */}
              <Card hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-green/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-green" />
                  </div>
                  <h2 className="font-orbitron text-xl font-bold">Delivery Address</h2>
                </div>

                <div className="space-y-2 text-text-muted">
                  <p>{order.deliveryAddress.street}</p>
                  <p>{order.deliveryAddress.area}, {order.deliveryAddress.lga}</p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-sm">Landmark: {order.deliveryAddress.landmark}</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card hover={false}>
                <h2 className="font-orbitron text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                  <div className="border-t border-primary-green/10 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary-green">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary-green/5 rounded-lg border border-primary-green/10 text-sm">
                  <div className="flex items-start gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-primary-green mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary-green mb-1">Payment Method</p>
                      <p className="text-text-muted capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {order.paystackReference && (
                    <p className="text-xs text-text-muted mt-2">
                      Ref: {order.paystackReference}
                    </p>
                  )}
                </div>
              </Card>

              <Card hover={false} className="bg-primary-green/5 border-primary-green/20">
                <div className="flex items-start gap-3 mb-4">
                  <Truck className="w-5 h-5 text-primary-green mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary-green mb-2">Delivery Status</h3>
                    <p className="text-sm text-text-muted">
                      {order.orderStatus === 'pending' && 'Your order is being processed.'}
                      {order.orderStatus === 'confirmed' && 'Your order has been confirmed and will be shipped soon.'}
                      {order.orderStatus === 'processing' && 'Your order is being prepared for shipment.'}
                      {order.orderStatus === 'shipped' && 'Your order is on the way!'}
                      {order.orderStatus === 'delivered' && 'Your order has been delivered.'}
                      {order.orderStatus === 'cancelled' && 'This order has been cancelled.'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-text-muted">
                  Need help? Contact us at +234 802 148 2053
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}