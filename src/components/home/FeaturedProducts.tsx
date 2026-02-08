'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ProductCard } from '../products/ProductCard';
import { Product } from '@/types/product';
import { getCollection } from '@/lib/firebase/firestore';
import { where, limit } from 'firebase/firestore';

export const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const featuredProducts = await getCollection<Product>('products', [
          where('featured', '==', true),
          where('inStock', '==', true),
          limit(6),
        ]);
        setProducts(featuredProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Featured Products</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Premium solar equipment for your energy needs. 
            Shop our best-selling panels, batteries, and inverters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/products">
            <Button size="lg">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
