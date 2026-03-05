// src/app/api/paystack/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import crypto from 'crypto';

// CRITICAL: Prevents Next.js build crashes
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Get raw body for cryptographic signature validation
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('Server configuration error: Missing PAYSTACK_SECRET_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 2. Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');
    
    if (hash !== signature) {
      console.error('Unauthorized: Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // 3. Parse verified payload
    const event = JSON.parse(body);
    console.log(`Paystack webhook received: ${event.event}`);
    
    // Safety check: Ensure Admin SDK is initialized
    if (!adminDb) {
      throw new Error('Firebase Admin DB is not initialized');
    }

    // 4. Handle successful charge
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      
      // Look up the exact document ID matching the reference
      const orderRef = adminDb.collection('orders').doc(reference);
      const orderSnap = await orderRef.get();
      
      if (!orderSnap.exists) {
        console.error(`Webhook Warning: Order doc ${reference} not found in Firestore.`);
        // We still return 200 so Paystack stops retrying, but we log the error
        return NextResponse.json({ success: true, warning: 'Order not found' });
      }
      
      // Update order status
      await orderRef.update({
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        updatedAt: new Date(),
        paidAt: new Date(),
      });
      
      console.log(`✅ Webhook updated Order ${reference} to paid/confirmed`);
      
      // TODO: Send confirmation email to customer here
    }
    
    // 5. Handle failed payment
    if (event.event === 'charge.failed') {
      const reference = event.data.reference;
      
      const orderRef = adminDb.collection('orders').doc(reference);
      const orderSnap = await orderRef.get();
      
      if (orderSnap.exists) {
        await orderRef.update({
          paymentStatus: 'failed',
          updatedAt: new Date(),
        });
        console.log(`❌ Webhook marked Order ${reference} as failed`);
      }
    }
    
    // 6. ALWAYS acknowledge receipt with a 200 OK
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}