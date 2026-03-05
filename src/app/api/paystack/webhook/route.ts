// src/app/api/paystack/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');
    
    if (hash !== signature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    const event = JSON.parse(body);
    console.log('Paystack webhook event:', event.event);
    
    // Handle successful charge
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const amount = event.data.amount / 100; // Convert from kobo to naira
      
      console.log(`Payment successful: ${reference}, Amount: ₦${amount}`);
      
      // Find order by reference
      const ordersRef = adminDb.collection('orders');
      const snapshot = await ordersRef.where('paystackReference', '==', reference).get();
      
      if (snapshot.empty) {
        console.error(`No order found for reference: ${reference}`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      
      // Update order status
      const orderDoc = snapshot.docs[0];
      await orderDoc.ref.update({
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
        updatedAt: new Date(),
      });
      
      console.log(`Order ${orderDoc.id} updated to paid/confirmed`);
      
      // TODO: Send confirmation email to customer
      
      return NextResponse.json({ 
        success: true,
        message: 'Order updated successfully' 
      });
    }
    
    // Handle failed payment
    if (event.event === 'charge.failed') {
      const reference = event.data.reference;
      
      const ordersRef = adminDb.collection('orders');
      const snapshot = await ordersRef.where('paystackReference', '==', reference).get();
      
      if (!snapshot.empty) {
        const orderDoc = snapshot.docs[0];
        await orderDoc.ref.update({
          paymentStatus: 'failed',
          updatedAt: new Date(),
        });
        
        console.log(`Order ${orderDoc.id} marked as failed`);
      }
      
      return NextResponse.json({ success: true });
    }
    
    // Acknowledge other events
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}