'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice, LAGOS_LGAS } from '@/lib/utils';
import { generatePaystackReference, getPaystackPublicKey, nairaToKobo } from '@/lib/paystack/client';
import { generateOrderNumber } from '@/lib/firebase/firestore';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ShieldCheck, Package, Truck } from 'lucide-react';
import dynamic from 'next/dynamic';
import { calculateDeliveryFee } from '@/lib/delivery-calculator';

const PaystackButton = dynamic(
  () => import("@/components/payments/PaystackButtonClient"),
  { ssr: false }
);

export default function CheckoutPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { items, totalPrice, clearCart, loading: cartLoading } = useCart();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    area: '',
    lga: '',
    landmark: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

   // Calculate delivery fee dynamically based on cart contents and LGA
  const deliveryFee = formData.lga ? calculateDeliveryFee(formData.lga, items) : 5000;
  const grandTotal = totalPrice + deliveryFee;

  const isFormValid =
    formData.street.trim() &&
    formData.area.trim() &&
    formData.lga;


  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    if (!authLoading && !cartLoading && items.length === 0 && user) {
      router.push('/cart');
      return;
    }
  }, [user, items, authLoading, cartLoading, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }

    if (!formData.lga) {
      newErrors.lga = 'Please select your LGA';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const createOrder = async (paystackReference: string) => {
    if (!user || !userProfile) return null;

    const orderData = {
      orderNumber: generateOrderNumber(),
      userId: user.uid,
      customerInfo: {
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        email: userProfile.email,
        phone: userProfile.phone,
      },
      items: items.map(item => ({
        productId: item.productId,
        name: item.name!,
        price: item.price!,
        quantity: item.quantity,
        image: item.image!,
      })),
      subtotal: totalPrice,
      deliveryFee,
      total: grandTotal,
      deliveryAddress: {
        street: formData.street,
        area: formData.area,
        lga: formData.lga,
        landmark: formData.landmark || '',
      },
      paymentStatus: 'pending' as const,
      paymentMethod: 'card' as const,
      paystackReference,
      orderStatus: 'pending' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  };

  const handlePaystackSuccess = async (reference: any) => {
    setLoading(true);

    // Create order in database
    const orderId = await createOrder(reference.reference);

    if (orderId) {
      // Redirect to success page first (don't clear cart yet)
      router.push(`/checkout/success?orderId=${orderId}`);
      
      // Clear cart after redirect (will happen in background)
      setTimeout(async () => {
        await clearCart();
      }, 1000);
    } else {
      alert('Order creation failed. Please contact support with reference: ' + reference.reference);
    }

    setLoading(false);
  };

  const handlePaystackClose = () => {
    console.log('Payment closed');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  // Show loading while auth or cart is loading
  if (authLoading || cartLoading) {
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

  const paystackConfig = {
    reference: generatePaystackReference(),
    email: userProfile?.email || '',
    amount: nairaToKobo(grandTotal),
    publicKey: getPaystackPublicKey(),
    metadata: {
      custom_fields: [
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: `${userProfile?.firstName} ${userProfile?.lastName}`,
        },
        {
          display_name: 'Phone Number',
          variable_name: 'phone',
          value: userProfile?.phone || '',
        },
      ],
    },
  };

  return (
    <MainLayout>
      <div className="section-padding">
        <div className="container-custom">
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-8">
            <span className="text-gradient">Checkout</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-green/10 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary-green" />
                  </div>
                  <h2 className="font-orbitron text-xl font-bold">Delivery Address</h2>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Street Address"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    error={errors.street}
                    placeholder="123 Main Street"
                    required
                  />

                  <Input
                    label="Area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    error={errors.area}
                    placeholder="e.g., Ikeja, Lekki, Surulere"
                    required
                  />

                  <Select
                    label="Local Government Area (LGA)"
                    name="lga"
                    value={formData.lga}
                    onChange={handleChange}
                    error={errors.lga}
                    options={LAGOS_LGAS.map(lga => ({ value: lga, label: lga }))}
                    required
                  />

                  <Textarea
                    label="Landmark (Optional)"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Near the big church, opposite the market, etc."
                  />
                </div>
              </Card>

              {/* Order Items */}
              <Card hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-green/10 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-green" />
                  </div>
                  <h2 className="font-orbitron text-xl font-bold">Order Items</h2>
                </div>

                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-4 pb-4 border-b border-primary-green/10 last:border-0 last:pb-0">
                      <div className="relative w-16 h-16 bg-dark-bg rounded-lg overflow-hidden flex-shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name!}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-green">
                          {formatPrice(item.price! * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card hover={false} className="sticky top-24">
                <h2 className="font-orbitron text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
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

                {/* Payment Button */}
                {isFormValid ? (
                  loading ? (
                    <Button size="lg" className="w-full" disabled>
                      <span className="spinner mr-2" />
                      Processing...
                    </Button>
                  ) : (
                    <PaystackButton
                      {...paystackConfig}
                      onSuccess={handlePaystackSuccess}
                      onClose={handlePaystackClose}
                      className="w-full btn-primary"
                    >
                      <span className="flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 mr-2" />
                        Pay with Paystack
                      </span>
                    </PaystackButton>
                  )
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={validateForm}
                  >
                    Complete Address to Continue
                  </Button>
                )}


                {/* Security Info */}
                <div className="mt-6 p-4 bg-primary-green/5 rounded-lg border border-primary-green/10">
                  <div className="flex items-start gap-2 text-sm text-text-muted">
                    <ShieldCheck className="w-4 h-4 text-primary-green mt-0.5 flex-shrink-0" />
                    <p>
                      Secure payment powered by Paystack. Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}