'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Order } from '@/types/order';
import { getCollection } from '@/lib/firebase/firestore';
import { orderBy } from 'firebase/firestore';
import { formatPrice, formatDate } from '@/lib/utils';
import { Eye, Download } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, paymentFilter]);

  const fetchOrders = async () => {
    try {
      const allOrders = await getCollection<Order>('orders', [
        orderBy('createdAt', 'desc'),
      ]);
      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter) {
      filtered = filtered.filter(o => o.orderStatus === statusFilter);
    }

    if (paymentFilter) {
      filtered = filtered.filter(o => o.paymentStatus === paymentFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'processing':
      case 'confirmed': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  const totalRevenue = filteredOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20">
          <div className="spinner w-8 h-8" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="font-orbitron text-3xl font-bold">
            <span className="text-gradient">Orders Management</span>
          </h1>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card hover={false} className="text-center">
            <p className="text-sm text-text-muted mb-1">Total Orders</p>
            <p className="text-3xl font-bold">{filteredOrders.length}</p>
          </Card>
          <Card hover={false} className="text-center">
            <p className="text-sm text-text-muted mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-primary-green">
              {formatPrice(totalRevenue)}
            </p>
          </Card>
          <Card hover={false} className="text-center">
            <p className="text-sm text-text-muted mb-1">Pending</p>
            <p className="text-3xl font-bold text-accent-yellow">
              {filteredOrders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card hover={false} className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Order Status"
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'processing', label: 'Processing' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              label="Payment Status"
              options={[
                { value: '', label: 'All Payments' },
                { value: 'pending', label: 'Pending' },
                { value: 'paid', label: 'Paid' },
                { value: 'failed', label: 'Failed' },
              ]}
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            />
          </div>
        </Card>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <Card hover={false} className="text-center py-12">
            <p className="text-text-muted">No orders found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} hover={false}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Order Info */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-orbitron text-lg font-bold mb-1">
                          #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-text-muted">
                          {order.createdAt && formatDate(order.createdAt.toDate())}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getStatusColor(order.orderStatus) as any}>
                          {order.orderStatus}
                        </Badge>
                        <Badge variant={getPaymentColor(order.paymentStatus) as any}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-text-muted">Customer:</span>{' '}
                        <span className="font-semibold">{order.customerInfo.name}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Items:</span>{' '}
                        <span className="font-semibold">{order.items.length}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Total:</span>{' '}
                        <span className="font-semibold text-primary-green">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-text-muted">
                      <span className="font-semibold">Delivery:</span> {order.deliveryAddress.area}, {order.deliveryAddress.lga}
                    </div>
                  </div>

                  {/* Actions */}
                  <Link href={`/admin/orders/${order.id}`}>
                    <button className="btn-outline flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}