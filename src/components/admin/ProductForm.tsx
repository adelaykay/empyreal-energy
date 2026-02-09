'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Product, ProductFormData, PRODUCT_CATEGORIES } from '@/types/product';
import { addDoc, collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { generateSlug } from '@/lib/utils';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, mode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    slug: product?.slug || '',
    category: product?.category || 'accessory',
    description: product?.description || '',
    specifications: product?.specifications || {},
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || undefined,
    inStock: product?.inStock ?? true,
    stockQuantity: product?.stockQuantity || 0,
    images: product?.images || [],
    featured: product?.featured || false,
  });

  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stockQuantity < 0) newErrors.stockQuantity = 'Stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from name
    if (name === 'name' && mode === 'create') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey]: newSpecValue,
        },
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const { [key]: removed, ...rest } = formData.specifications;
    setFormData(prev => ({ ...prev, specifications: rest }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl],
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (mode === 'create') {
        await addDoc(collection(db, 'products'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        alert('Product created successfully!');
        router.push('/admin/products');
      } else if (mode === 'edit' && product?.id) {
        const productRef = doc(db, 'products', product.id);
        await updateDoc(productRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        alert('Product updated successfully!');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card hover={false}>
        <h2 className="font-orbitron text-xl font-bold mb-6">Basic Information</h2>
        
        <div className="space-y-4">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g., 450W Monocrystalline Solar Panel"
            required
          />

          <Input
            label="URL Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            error={errors.slug}
            placeholder="450w-monocrystalline-solar-panel"
            required
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            options={PRODUCT_CATEGORIES}
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Describe the product..."
            required
          />
        </div>
      </Card>

      {/* Pricing & Stock */}
      <Card hover={false}>
        <h2 className="font-orbitron text-xl font-bold mb-6">Pricing & Stock</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Price (₦)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            min="0"
            step="100"
            required
          />

          <Input
            label="Compare At Price (₦) - Optional"
            name="compareAtPrice"
            type="number"
            value={formData.compareAtPrice || ''}
            onChange={handleChange}
            min="0"
            step="100"
          />

          <Input
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange}
            error={errors.stockQuantity}
            min="0"
            required
          />

          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">In Stock</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Featured Product</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Specifications */}
      <Card hover={false}>
        <h2 className="font-orbitron text-xl font-bold mb-6">Specifications</h2>
        
        {/* Existing Specs */}
        {Object.keys(formData.specifications).length > 0 && (
          <div className="space-y-2 mb-4">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 p-3 bg-primary-green/5 rounded-lg">
                <span className="font-semibold flex-1">{key}:</span>
                <span className="text-text-muted flex-1">{value}</span>
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Spec */}
        <div className="flex gap-2">
          <Input
            placeholder="Key (e.g., Wattage)"
            value={newSpecKey}
            onChange={(e) => setNewSpecKey(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value (e.g., 450W)"
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addSpecification}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Images */}
      <Card hover={false}>
        <h2 className="font-orbitron text-xl font-bold mb-6">Images</h2>
        
        {/* Existing Images */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {formData.images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Image */}
        <div className="flex gap-2">
          <Input
            placeholder="Image URL (e.g., https://...)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addImage}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        <p className="text-xs text-text-muted mt-2">
          Note: For production, implement Firebase Storage upload. For now, use direct image URLs.
        </p>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={loading}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          {mode === 'create' ? 'Create Product' : 'Update Product'}
        </Button>
      </div>
    </form>
  );
};