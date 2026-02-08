'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Order } from '@/types/order';
import { getDocument } from '@/lib/firebase/firestore';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { CheckCircle, Package, Home } from 'lucide-react';


export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const orderData = await getDocument<Order>('orders', orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

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
                We couldn't find your order. Please check your order history.
              </p>
              <Link href="/account/orders">
                <Button>View Orders</Button>
              </Link>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Success Message */}
            <Card hover={false} className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="font-orbitron text-3xl font-bold mb-2">
                <span className="text-gradient">Order Successful!</span>
              </h1>
              <p className="text-text-muted mb-6">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
              <div className="inline-flex items-center gap-2 bg-primary-green/10 px-6 py-3 rounded-lg">
                <Package className="w-5 h-5 text-primary-green" />
                <span className="font-orbitron font-bold text-primary-green">
                  Order #{order.orderNumber}
                </span>
              </div>
            </Card>

            {/* Order Details */}
            <Card hover={false} className="mb-8">
              <h2 className="font-orbitron text-xl font-bold mb-6">Order Details</h2>
              
              <div className="space-y-4">
                {/* Order Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-primary-green/10">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Order Number</p>
                    <p className="font-semibold">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">Order Date</p>
                    <p className="font-semibold">
                      {order.createdAt && formatDateTime(order.createdAt.toDate())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">Payment Status</p>
                    <p className="font-semibold text-green-400 capitalize">{order.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">Order Status</p>
                    <p className="font-semibold text-accent-yellow capitalize">{order.orderStatus}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="pb-4 border-b border-primary-green/10">
                  <h3 className="font-semibold mb-3">Items Ordered</h3>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-text-muted">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="pb-4 border-b border-primary-green/10">
                  <h3 className="font-semibold mb-3">Delivery Address</h3>
                  <p className="text-sm text-text-muted">
                    {order.deliveryAddress.street}<br />
                    {order.deliveryAddress.area}, {order.deliveryAddress.lga}<br />
                    {order.deliveryAddress.landmark && (
                      <>Landmark: {order.deliveryAddress.landmark}</>
                    )}
                  </p>
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-primary-green/10">
                    <span>Total Paid</span>
                    <span className="text-primary-green">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            <Card hover={false} className="bg-primary-green/5 border-primary-green/20">
              <h3 className="font-orbitron font-semibold mb-4">What's Next?</h3>
              <ul className="space-y-3 text-sm text-text-muted mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-green mt-0.5 flex-shrink-0" />
                  <span>You'll receive a confirmation email at {order.customerInfo.email}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-green mt-0.5 flex-shrink-0" />
                  <span>We'll call you on {order.customerInfo.phone} to schedule delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-green mt-0.5 flex-shrink-0" />
                  <span>Delivery within 2-5 business days to Lagos addresses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-green mt-0.5 flex-shrink-0" />
                  <span>Professional installation support available</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/account/orders" className="flex-1">
                  <Button variant="secondary" className="w-full">
                    <Package className="w-4 h-4 mr-2" />
                    View My Orders
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
