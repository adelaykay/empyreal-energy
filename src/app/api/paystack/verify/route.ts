// src/app/api/paystack/verify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin'; 

// CRITICAL: Prevents Next.js build crashes
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 1. Ask Paystack directly: "Did this reference actually pay?"
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await paystackResponse.json();

    // 2. Reject if the payment wasn't truly successful
    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json({ error: 'Transaction verification failed' }, { status: 400 });
    }

    // Safety check: Ensure Admin SDK is initialized
    if (!adminDb) {
      throw new Error('Firebase Admin DB is not initialized');
    }

    // 3. Update order in Firestore (The Document ID is the reference!)
    const orderRef = adminDb.collection('orders').doc(reference);
    const orderSnap = await orderRef.get();
    
    if (!orderSnap.exists) {
        console.error(`API Verify: Order with reference ${reference} not found.`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update the document to show it's paid
    await orderRef.update({
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      paidAt: new Date(),
      updatedAt: new Date(),
      paymentMethod: 'paystack',
      authorization: data.data.authorization, // Save card details safely (like last 4 digits) for refunds
    });

    console.log(`✅ API verified and updated Order ${reference}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified and order updated' 
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}