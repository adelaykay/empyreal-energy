import { Timestamp } from 'firebase/firestore';
import { ProductCategory } from './product';

export interface CartItem {
  productId: string;
  quantity: number;
  // Additional fields for display (populated from product data)
  name?: string;
  price?: number;
  image?: string;
  inStock?: boolean;
  category?: ProductCategory;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Timestamp;
}

export interface CartItemWithProduct extends CartItem {
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  stockQuantity: number;
  category: ProductCategory;
}
