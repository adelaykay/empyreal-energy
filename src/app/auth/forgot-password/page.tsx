import { Metadata } from 'next';
import { ForgotPasswordClient } from './ForgotPasswordClient';

export const metadata: Metadata = {
  title: 'Forgot Password | Empyreal Energy',
  description: 'Reset your Empyreal Energy account password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}