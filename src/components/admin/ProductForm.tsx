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
import { uploadProductImage, uploadProductThumbnail, generateStorageId } from '@/lib/firebase/storage';
import imageCompression from 'browser-image-compression';

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
        thumbnail: product?.thumbnail || '',
    weight: product?.weight || undefined,
    dimensions: product?.dimensions || undefined,
        featured: product?.featured || false,
    });

    const [newSpecKey, setNewSpecKey] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [uploadingImages, setUploadingImages] = useState(false);
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

    const handleImageUpload = async (files: FileList) => {
        if (files.length === 0) return;

        setUploadingImages(true);
        const tempId = product?.id || generateStorageId();

        try {
            const uploadPromises = Array.from(files).map(async (file, index) => {
                // Compress image
                const compressed = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                });

                return uploadProductImage(compressed, tempId, formData.images.length + index);
            });

            const urls = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...urls]
            }));

            alert('Images uploaded successfully!');
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleThumbnailUpload = async (file: File) => {
        setUploadingImages(true);
        const tempId = product?.id || generateStorageId();

        try {
            // Compress and resize thumbnail
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.3,
                maxWidthOrHeight: 300,
                useWebWorker: true
            });

            const url = await uploadProductThumbnail(compressed, tempId);

            setFormData(prev => ({ ...prev, thumbnail: url }));
            alert('Thumbnail uploaded successfully!');
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            alert('Failed to upload thumbnail');
        } finally {
            setUploadingImages(false);
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

            

      {/* Shipping Information */}
      <Card hover={false}>
        <h2 className="font-orbitron text-xl font-bold mb-6">Shipping Information</h2>
        <p className="text-sm text-text-muted mb-4">
          Required for accurate delivery cost calculation
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight || ''}
            onChange={handleChange}
            min="0"
            step="0.1"
            placeholder="e.g., 20"
          />

          <div className="col-span-2">
            <label className="label mb-2">Dimensions (inches)</label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Length"
                name="dimensions.length"
                type="number"
                value={formData.dimensions?.length || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, length: value, width: prev.dimensions?.width || 0, height: prev.dimensions?.height || 0 }
                  }));
                }}
                min="0"
              />
              <Input
                placeholder="Width"
                name="dimensions.width"
                type="number"
                value={formData.dimensions?.width || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, width: value, length: prev.dimensions?.length || 0, height: prev.dimensions?.height || 0 }
                  }));
                }}
                min="0"
              />
              <Input
                placeholder="Height"
                name="dimensions.height"
                type="number"
                value={formData.dimensions?.height || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, height: value, length: prev.dimensions?.length || 0, width: prev.dimensions?.width || 0 }
                  }));
                }}
                min="0"
              />
            </div>
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

                {/* Thumbnail Upload */}
                <div className="mb-6">
                    <label className="label">Thumbnail (300x300)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
                        disabled={uploadingImages}
                        className="input-field"
                    />
                    {formData.thumbnail && (
                        <img src={formData.thumbnail} alt="Thumbnail" className="mt-2 w-32 h-32 object-cover rounded" />
                    )}
                </div>

                {/* Product Images Upload */}
                <div className="mb-6">
                    <label className="label">Product Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                        disabled={uploadingImages}
                        className="input-field"
                    />
                    {uploadingImages && (
                        <div className="mt-2 text-sm text-primary-green">
                            <div className="spinner w-4 h-4 inline-block mr-2" />
                            Uploading images...
                        </div>
                    )}
                </div>

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

                {/* URL Input (Legacy fallback) */}
                <div className="text-sm text-text-muted mb-2">Or add image URL:</div>
                <div className="flex gap-2">
                    <Input
                        placeholder="https://..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="button" variant="secondary" onClick={addImage}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>
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