'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Product, PRODUCT_CATEGORIES } from '@/types/product';
import { getCollection } from '@/lib/firebase/firestore';
import { where, orderBy } from 'firebase/firestore';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getCollection<Product>('products', [
          orderBy('createdAt', 'desc'),
        ]);
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <MainLayout>
      <div className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Our Products</span>
            </h1>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Premium solar equipment for homes and businesses. 
              All products come with warranty and professional installation support.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
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

            {/* Category Filter */}
            <Select
              options={[
                { value: '', label: 'All Categories' },
                ...PRODUCT_CATEGORIES,
              ]}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />

            {/* Sort */}
            <Select
              options={[
                { value: 'name', label: 'Sort by Name' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner w-8 h-8" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">
                No products found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-text-muted text-sm">
                Showing {filteredProducts.length} of {products.length} products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
