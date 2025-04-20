import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  amount: z.number().min(1),
  orderCode: z.string().min(1),
  description: z.string().min(1),
  currency: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  instagram: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = requestSchema.parse(body);

    console.log('=== PayPal Request Debug ===');
    console.log('Validated request data:', validatedData);

    // ایجاد درخواست پرداخت به پی‌پال
    const paypalResponse = await fetch(`${process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYPAL_SECRET_KEY}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: validatedData.currency.toUpperCase(),
              value: validatedData.amount.toString(),
            },
            description: validatedData.description,
            custom_id: validatedData.orderCode,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify/paypal?orderCode=${validatedData.orderCode}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        },
      }),
    });

    if (!paypalResponse.ok) {
      const errorData = await paypalResponse.json();
      console.error('PayPal API Error:', errorData);
      throw new Error('خطا در ایجاد درخواست پرداخت پی‌پال');
    }

    const paypalData = await paypalResponse.json();
    console.log('PayPal API Response:', paypalData);

    // پیدا کردن لینک تایید پرداخت
    const approveLink = paypalData.links.find((link: any) => link.rel === 'approve');
    if (!approveLink) {
      throw new Error('لینک پرداخت یافت نشد');
    }

    return NextResponse.json({
      paymentUrl: approveLink.href,
      orderId: paypalData.id,
    });
  } catch (error) {
    console.error('Error in PayPal request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطا در پردازش درخواست' },
      { status: 400 }
    );
  }
} 