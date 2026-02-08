import { Timestamp } from 'firebase/firestore';

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  message: string;
  timestamp: Timestamp;
}

export interface ServiceInquiryFormData {
  firstName: string;
  lastName: string;
  businessName: string;
  phone: string;
  email?: string;
  address: string;
  preferredDate?: string;
  additionalInfo?: string;
  selectedPlan: string;
  selectedPrice: string;
}
