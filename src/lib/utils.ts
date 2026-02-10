import clsx, { ClassValue } from 'clsx';

/**
 * Merge class names
 */
export const cn = (...inputs: ClassValue[]) => {
  return clsx(inputs);
};

/**
 * Format price in Nigerian Naira
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Generate slug from string
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Format date
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Format date with time
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Nigerian phone number
 */
export const isValidPhone = (phone: string): boolean => {
  // Accepts: 08012345678, +2348012345678, 2348012345678
  const phoneRegex = /^(\+?234|0)[789]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format Nigerian phone number
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('234')) {
    return '+' + cleaned;
  }
  if (cleaned.startsWith('0')) {
    return '+234' + cleaned.slice(1);
  }
  return '+234' + cleaned;
};

/**
 * Calculate delivery fee based on LGA and cart items
 * Uses dynamic algorithm considering weight, dimensions, and distance
 */
export const calculateDeliveryFee = (lga: string, cartItems?: any[]): number => {
  // Import dynamically to avoid circular dependencies
  if (cartItems && cartItems.length > 0) {
    const { calculateDeliveryFee: dynamicCalc } = require('./delivery-calculator');
    return dynamicCalc(lga, cartItems);
  }
  
  // Fallback: Simple distance-based zones
  const zones = {
    zone1: ['Ojo', 'Amuwo-Odofin', 'Ajeromi-Ifelodun', 'Alimosho'], // 5-21km
    zone2: ['Surulere', 'Apapa', 'Mushin', 'Oshodi-Isolo', 'Lagos Mainland', 'Agege'], // 25-32km
    zone3: ['Shomolu', 'Lagos Island', 'Badagry', 'Ifako-Ijaiye', 'Ikeja', 'Kosofe'], // 36-40km
    zone4: ['Ikorodu', 'Eti-Osa'], // 55-60km
    zone5: ['Ibeju-Lekki', 'Epe'], // 90-100km
  };

  if (zones.zone1.includes(lga)) return 5000;
  if (zones.zone2.includes(lga)) return 10000;
  if (zones.zone3.includes(lga)) return 15000;
  if (zones.zone4.includes(lga)) return 25000;
  if (zones.zone5.includes(lga)) return 40000;

  return 10000; // Default
};

/**
 * Lagos LGAs
 */
export const LAGOS_LGAS = [
  'Agege',
  'Ajeromi-Ifelodun',
  'Alimosho',
  'Amuwo-Odofin',
  'Apapa',
  'Badagry',
  'Epe',
  'Eti-Osa',
  'Ibeju-Lekki',
  'Ifako-Ijaiye',
  'Ikeja',
  'Ikorodu',
  'Kosofe',
  'Lagos Island',
  'Lagos Mainland',
  'Mushin',
  'Ojo',
  'Oshodi-Isolo',
  'Shomolu',
  'Surulere',
];

/**
 * Convert Naira to Kobo (for Paystack)
 */
export const nairaToKobo = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Convert Kobo to Naira
 */
export const koboToNaira = (amount: number): number => {
  return amount / 100;
};

/**
 * Generate Paystack reference
 */
export const generatePaystackReference = (): string => {
  return `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate order number
 */
export const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `EMP-${year}-${random}`;
};
