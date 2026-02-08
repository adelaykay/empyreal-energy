'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Product } from '@/types/product';
import { getCollection } from '@/lib/firebase/firestore';
import { where, limit } from 'firebase/firestore';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Check, X, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getCollection<Product>('products', [
          where('slug', '==', slug),
          limit(1),
        ]);
        
        if (products.length > 0) {
          setProduct(products[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    await addItem(product.id);
    setIsAdding(false);
  };

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

  if (!product) {
    return (
      <MainLayout>
        <div className="section-padding">
          <div className="container-custom text-center">
            <h1 className="font-orbitron text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-text-muted mb-8">The product you're looking for doesn't exist.</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <MainLayout>
      <div className="section-padding">
        <div className="container-custom">
          {/* Back Button */}
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary-green transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="relative w-full h-96 bg-dark-bg rounded-2xl overflow-hidden mb-4">
                {product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    No Image Available
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {!product.inStock && (
                    <Badge variant="danger">Out of Stock</Badge>
                  )}
                  {discount > 0 && (
                    <Badge variant="warning">-{discount}% OFF</Badge>
                  )}
                  {product.featured && (
                    <Badge variant="primary">Featured</Badge>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 bg-dark-bg rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary-green'
                          : 'border-transparent hover:border-primary-green/50'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-primary-green">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-text-muted line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-accent-yellow text-sm">
                    You save {formatPrice(product.compareAtPrice! - product.price)} ({discount}%)
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">In Stock ({product.stockQuantity} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <X className="w-5 h-5" />
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-orbitron text-lg font-semibold text-primary-green mb-2">
                  Description
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {Object.keys(product.specifications).length > 0 && (
                <Card className="mb-6" hover={false}>
                  <h3 className="font-orbitron text-lg font-semibold text-primary-green mb-4">
                    Specifications
                  </h3>
                  <dl className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-primary-green/10 last:border-0">
                        <dt className="text-text-muted">{key}:</dt>
                        <dd className="text-text-light font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              )}

              {/* Add to Cart */}
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                isLoading={isAdding}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-primary-green/5 rounded-xl border border-primary-green/10">
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary-green" />
                    Free delivery within Lagos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary-green" />
                    Manufacturer warranty included
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary-green" />
                    Professional installation support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
