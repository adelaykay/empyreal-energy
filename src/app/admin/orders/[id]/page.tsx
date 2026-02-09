'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Order } from '@/types/order';
import { getDocument } from '@/lib/firebase/firestore';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { ArrowLeft, Save, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const orderData = await getDocument<Order>('orders', orderId);
      setOrder(orderData);
      if (orderData) {
        setOrderStatus(orderData.orderStatus);
        setPaymentStatus(orderData.paymentStatus);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order) return;

    setSaving(true);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        orderStatus,
        paymentStatus,
        updatedAt: serverTimestamp(),
      });
      
      alert('Order status updated successfully!');
      await fetchOrder();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20">
          <div className="spinner w-8 h-8" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <h2 className="font-orbitron text-2xl font-bold mb-4">Order Not Found</h2>
          <Link href="/admin/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const hasChanges = orderStatus !== order.orderStatus || paymentStatus !== order.paymentStatus;

  return (
    <AdminLayout>
      <div>
        {/* Back Button */}
        <Link 
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary-green transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card hover={false}>
              <h2 className="font-orbitron text-xl font-bold mb-6">Order Items</h2>
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

            {/* Customer Information */}
            <Card hover={false}>
              <h2 className="font-orbitron text-xl font-bold mb-6">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-muted mb-1">Name</p>
                  <p className="font-semibold">{order.customerInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Email</p>
                  <a 
                    href={`mailto:${order.customerInfo.email}`}
                    className="font-semibold text-primary-green hover:underline flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    {order.customerInfo.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Phone</p>
                  <a 
                    href={`tel:${order.customerInfo.phone}`}
                    className="font-semibold text-primary-green hover:underline flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    {order.customerInfo.phone}
                  </a>
                </div>
              </div>
            </Card>

            {/* Delivery Address */}
            <Card hover={false}>
              <h2 className="font-orbitron text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-green" />
                Delivery Address
              </h2>
              <div className="text-text-muted">
                <p>{order.deliveryAddress.street}</p>
                <p>{order.deliveryAddress.area}, {order.deliveryAddress.lga}</p>
                {order.deliveryAddress.landmark && (
                  <p className="text-sm mt-2">Landmark: {order.deliveryAddress.landmark}</p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Update */}
            <Card hover={false}>
              <h2 className="font-orbitron text-xl font-bold mb-6">Update Status</h2>
              
              <div className="space-y-4 mb-6">
                <Select
                  label="Order Status"
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'shipped', label: 'Shipped' },
                    { value: 'delivered', label: 'Delivered' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                />

                <Select
                  label="Payment Status"
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'failed', label: 'Failed' },
                  ]}
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleUpdateStatus}
                isLoading={saving}
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </Card>

            {/* Order Summary */}
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
                <p className="font-semibold mb-2">Payment Details</p>
                <p className="text-text-muted capitalize">Method: {order.paymentMethod.replace('_', ' ')}</p>
                {order.paystackReference && (
                  <p className="text-xs text-text-muted mt-2 break-all">
                    Ref: {order.paystackReference}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}