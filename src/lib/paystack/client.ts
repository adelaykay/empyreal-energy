export interface PaystackConfig {
  reference: string;
  email: string;
  amount: number; // in kobo (multiply by 100)
  publicKey: string;
  metadata?: {
    orderId?: string;
    userId?: string;
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  currency?: 'NGN';
  channels?: string[];
}

export interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
}

/**
 * Generate Paystack reference
 */
export const generatePaystackReference = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `emp_${timestamp}_${random}`;
};

/**
 * Convert Naira to Kobo (Paystack uses kobo)
 */
export const nairaToKobo = (naira: number): number => {
  return Math.round(naira * 100);
};

/**
 * Convert Kobo to Naira
 */
export const koboToNaira = (kobo: number): number => {
  return kobo / 100;
};

/**
 * Get Paystack public key
 */
export const getPaystackPublicKey = (): string => {
  const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!key) {
    throw new Error('Paystack public key not configured');
  }
  return key;
};
