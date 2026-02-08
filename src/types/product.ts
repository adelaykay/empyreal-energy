import { Timestamp } from 'firebase/firestore';

export type ProductCategory = 'panel' | 'battery' | 'inverter' | 'controller' | 'accessory';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  specifications: {
    [key: string]: string;
  };
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  images: string[];
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProductFormData {
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  specifications: {
    [key: string]: string;
  };
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  images: string[];
  featured: boolean;
}

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'panel', label: 'Solar Panels' },
  { value: 'battery', label: 'Batteries' },
  { value: 'inverter', label: 'Inverters' },
  { value: 'controller', label: 'Charge Controllers' },
  { value: 'accessory', label: 'Accessories' },
];
