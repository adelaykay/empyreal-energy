'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Product, PRODUCT_CATEGORIES } from '@/types/product';
import { getCollection, deleteDocument } from '@/lib/firebase/firestore';
import { formatPrice } from '@/lib/utils';
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, categoryFilter, stockFilter]);

  const fetchProducts = async () => {
    try {
      const allProducts = await getCollection<Product>('products', []);
      setProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter === 'in-stock') {
      filtered = filtered.filter(p => p.inStock && p.stockQuantity > 0);
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter(p => !p.inStock || p.stockQuantity === 0);
    } else if (stockFilter === 'low-stock') {
      filtered = filtered.filter(p => p.inStock && p.stockQuantity > 0 && p.stockQuantity < 10);
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const result = await deleteDocument('products', id);
      if (result.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        alert('Product deleted successfully');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
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

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="font-orbitron text-3xl font-bold">
            <span className="text-gradient">Products</span>
          </h1>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card hover={false} className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={[
                { value: '', label: 'All Categories' },
                ...PRODUCT_CATEGORIES,
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              options={[
                { value: '', label: 'All Stock Levels' },
                { value: 'in-stock', label: 'In Stock' },
                { value: 'low-stock', label: 'Low Stock (<10)' },
                { value: 'out-of-stock', label: 'Out of Stock' },
              ]}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            />
          </div>
        </Card>

        {/* Results Count */}
        <p className="text-sm text-text-muted mb-4">
          Showing {filteredProducts.length} of {products.length} products
        </p>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <Card hover={false} className="text-center py-12">
            <p className="text-text-muted">No products found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} hover={false}>
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-dark-bg rounded-lg overflow-hidden flex-shrink-0">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-orbitron font-semibold text-lg mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-text-muted line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {product.featured && <Badge>Featured</Badge>}
                        {!product.inStock && <Badge variant="danger">Out of Stock</Badge>}
                        {product.inStock && product.stockQuantity < 10 && (
                          <Badge variant="warning">Low Stock</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div>
                        <span className="text-text-muted">Category:</span>{' '}
                        <span className="font-semibold capitalize">{product.category}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Price:</span>{' '}
                        <span className="font-semibold text-primary-green">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted">Stock:</span>{' '}
                        <span className={`font-semibold ${
                          product.stockQuantity < 10 ? 'text-accent-yellow' : 'text-text-light'
                        }`}>
                          {product.stockQuantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[100px]">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-400 border-red-400/50 hover:bg-red-400/10"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}