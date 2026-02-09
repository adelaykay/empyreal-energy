'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { ProductForm } from '@/components/admin/ProductForm';
import { Product } from '@/types/product';
import { getDocument } from '@/lib/firebase/firestore';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getDocument<Product>('products', productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20">
          <div className="spinner w-8 h-8" />
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <h2 className="font-orbitron text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-text-muted">This product doesn't exist.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="font-orbitron text-3xl font-bold mb-8">
          <span className="text-gradient">Edit Product</span>
        </h1>
        <ProductForm mode="edit" product={product} />
      </div>
    </AdminLayout>
  );
}