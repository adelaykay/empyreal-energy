import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin'; // Use Admin SDK
import admin from 'firebase-admin'; // Import for FieldValue

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      );
    }

    // Verify transaction with Paystack API
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await paystackResponse.json();

    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Transaction verification failed' },
        { status: 400 }
      );
    }

    // Update order in Firestore using Admin SDK (Bypasses rules)
    // Note: We use the reference as the Order ID based on your checkout flow
    const orderRef = adminDb.collection('orders').doc(reference);
    
    // Check if order exists first
    const orderSnap = await orderRef.get();
    
    if (!orderSnap.exists) {
        console.error(`Order with reference ${reference} not found.`);
        return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
        );
    }

    await orderRef.update({
      status: 'processing', // or 'paid' depending on your flow
      paymentStatus: 'paid',
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentMethod: 'paystack',
      authorization: data.data.authorization,
    });

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