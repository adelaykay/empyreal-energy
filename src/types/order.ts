import { Timestamp } from 'firebase/firestore';

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderAddress {
  street: string;
  area: string;
  lga: string;
  landmark?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: OrderAddress;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paystackReference: string;
  orderStatus: OrderStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateOrderData {
  userId: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: OrderAddress;
  paymentMethod: PaymentMethod;
}
