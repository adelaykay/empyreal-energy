import { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'admin';

export interface DeliveryAddress {
  id: string;
  label: string;
  street: string;
  area: string;
  lga: string;
  landmark?: string;
  isDefault: boolean;
}

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: DeliveryAddress[];
  role: UserRole;
  createdAt: Timestamp;
}

export interface UserFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AddressFormData {
  label: string;
  street: string;
  area: string;
  lga: string;
  landmark?: string;
  isDefault: boolean;
}
