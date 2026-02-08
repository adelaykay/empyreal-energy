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
 * Calculate delivery fee based on LGA (Lagos only for now)
 */
export const calculateDeliveryFee = (lga: string): number => {
  const deliveryFee = parseInt(process.env.NEXT_PUBLIC_DELIVERY_FEE || '5000');
  
  // You can add LGA-specific pricing here
  const lgaPricing: Record<string, number> = {
    'Mainland': deliveryFee,
    'Island': deliveryFee + 2000,
    'Lekki': deliveryFee + 3000,
    'Ikorodu': deliveryFee + 2000,
    'Badagry': deliveryFee + 3000,
  };

  return lgaPricing[lga] || deliveryFee;
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
