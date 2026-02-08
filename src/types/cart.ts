import { Timestamp } from 'firebase/firestore';

export interface CartItem {
  productId: string;
  quantity: number;
  // Additional fields for display (populated from product data)
  name?: string;
  price?: number;
  image?: string;
  inStock?: boolean;
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
}
