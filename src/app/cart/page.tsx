'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, loading } = useCart();
  const { user } = useAuth();

  const deliveryFee = parseInt(process.env.NEXT_PUBLIC_DELIVERY_FEE || '5000');
  const grandTotal = totalPrice + deliveryFee;

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

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="section-padding">
          <div className="container-custom">
            <Card className="max-w-md mx-auto text-center py-12" hover={false}>
              <div className="w-20 h-20 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-primary-green" />
              </div>
              <h2 className="font-orbitron text-2xl font-bold mb-2">Your Cart is Empty</h2>
              <p className="text-text-muted mb-6">
                Add some products to get started!
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
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
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-8">
            <span className="text-gradient">Shopping Cart</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.productId} hover={false}>
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-dark-bg rounded-lg overflow-hidden flex-shrink-0">
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

                    {/* Product Info */}
                    <div className="flex-grow">
                      <Link 
                        href={`/products/${item.productId}`}
                        className="font-orbitron font-semibold text-lg hover:text-primary-green transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-primary-green font-bold mt-1">
                        {formatPrice(item.price)}
                      </p>
                      
                      {/* Stock warning */}
                      {!item.inStock && (
                        <p className="text-red-400 text-sm mt-1">Out of stock</p>
                      )}
                      {item.inStock && item.quantity > item.stockQuantity && (
                        <p className="text-accent-yellow text-sm mt-1">
                          Only {item.stockQuantity} in stock
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-4">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-text-muted hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-primary-green/10 hover:bg-primary-green/20 text-primary-green flex items-center justify-center transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-primary-green/10 hover:bg-primary-green/20 text-primary-green flex items-center justify-center transition-colors"
                          disabled={item.quantity >= item.stockQuantity}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <p className="font-bold text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card hover={false} className="sticky top-24">
                <h2 className="font-orbitron text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="border-t border-primary-green/10 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary-green">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                {user ? (
                  <Link href="/checkout">
                    <Button size="lg" className="w-full">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <div>
                    <Link href="/auth/login?redirect=/checkout">
                      <Button size="lg" className="w-full">
                        Login to Checkout
                      </Button>
                    </Link>
                    <p className="text-center text-text-muted text-sm mt-4">
                      Don't have an account?{' '}
                      <Link href="/auth/register?redirect=/checkout" className="text-primary-green hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </div>
                )}

                <div className="mt-6 p-4 bg-primary-green/5 rounded-lg border border-primary-green/10">
                  <p className="text-sm text-text-muted">
                    ✓ Free delivery within Lagos<br />
                    ✓ Secure payment with Paystack<br />
                    ✓ Professional installation support
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
