import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="font-orbitron text-3xl font-bold mb-8">
          <span className="text-gradient">Add New Product</span>
        </h1>
        <ProductForm mode="create" />
      </div>
    </AdminLayout>
  );
}