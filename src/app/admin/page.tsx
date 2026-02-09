'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getCollection } from '@/lib/firebase/firestore';
import { Order } from '@/types/order';
import { Product } from '@/types/product';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, ShoppingCart, MessageSquare, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    totalInquiries: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all orders
        const orders = await getCollection<Order>('orders', []);
        const products = await getCollection<Product>('products', []);
        const inquiries = await getCollection<any>('inquiries', []);

        // Calculate stats
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;
        const lowStockProducts = products.filter(p => p.inStock && p.stockQuantity < 10).length;

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
          lowStockProducts,
          pendingOrders,
          totalInquiries: inquiries.length,
        });

        // Get recent orders (last 5)
        const sorted = orders.sort((a, b) => {
          const aTime = a.createdAt?.toMillis() || 0;
          const bTime = b.createdAt?.toMillis() || 0;
          return bTime - aTime;
        });
        setRecentOrders(sorted.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20">
          <div className="spinner w-8 h-8" />
        </div>
      </AdminLayout>
    );
  }

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

  return (
    <AdminLayout>
      <div>
        <h1 className="font-orbitron text-3xl font-bold mb-8">
          <span className="text-gradient">Dashboard</span>
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue */}
          <Card hover={false} className="bg-gradient-to-br from-primary-green/10 to-primary-green/5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-primary-green">
                  {formatPrice(stats.totalRevenue)}
                </h3>
              </div>
              <div className="w-12 h-12 bg-primary-green/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-green" />
              </div>
            </div>
            <p className="text-xs text-text-muted mt-4 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              From {stats.totalOrders} orders
            </p>
          </Card>

          {/* Total Orders */}
          <Card hover={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Total Orders</p>
                <h3 className="text-3xl font-bold">{stats.totalOrders}</h3>
              </div>
              <div className="w-12 h-12 bg-secondary-green/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-secondary-green" />
              </div>
            </div>
            {stats.pendingOrders > 0 && (
              <p className="text-xs text-accent-yellow mt-4 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {stats.pendingOrders} pending
              </p>
            )}
          </Card>

          {/* Total Products */}
          <Card hover={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Total Products</p>
                <h3 className="text-3xl font-bold">{stats.totalProducts}</h3>
              </div>
              <div className="w-12 h-12 bg-accent-yellow/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-accent-yellow" />
              </div>
            </div>
            {stats.lowStockProducts > 0 && (
              <p className="text-xs text-red-400 mt-4 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {stats.lowStockProducts} low stock
              </p>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/products/new">
            <Card hover className="text-center cursor-pointer">
              <Package className="w-8 h-8 text-primary-green mx-auto mb-2" />
              <h3 className="font-semibold">Add Product</h3>
            </Card>
          </Link>
          <Link href="/admin/orders">
            <Card hover className="text-center cursor-pointer">
              <ShoppingCart className="w-8 h-8 text-secondary-green mx-auto mb-2" />
              <h3 className="font-semibold">View Orders</h3>
            </Card>
          </Link>
          <Link href="/admin/inquiries">
            <Card hover className="text-center cursor-pointer">
              <MessageSquare className="w-8 h-8 text-accent-yellow mx-auto mb-2" />
              <h3 className="font-semibold">View Inquiries ({stats.totalInquiries})</h3>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-orbitron text-xl font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary-green hover:underline text-sm">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-center text-text-muted py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-primary-green/5 rounded-lg border border-primary-green/10"
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">#{order.orderNumber}</h3>
                      <Badge variant={getStatusColor(order.orderStatus) as any}>
                        {order.orderStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-muted">
                      {order.customerInfo.name} • {order.items.length} items
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {order.createdAt && formatDate(order.createdAt.toDate())}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-green">
                      {formatPrice(order.total)}
                    </p>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-primary-green hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}