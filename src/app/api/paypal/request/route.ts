import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  amount: z.number().min(1),
  orderCode: z.string().min(1),
  description: z.string().min(1),
  currency: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  instagram: z.string().min(1),
  purchase_type: z.string().min(1),
  persian_name: z.string().min(1),
  phone: z.string().min(1),
  province: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  postal_code: z.string().min(1),
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
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/payment/paypal/callback?orderCode=${validatedData.orderCode}`,
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

    try {
      const prepareResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/payment/prepare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validatedData.name,
          instagram_id: validatedData.instagram,
          email: validatedData.email,
          amount: validatedData.amount,
          currency: validatedData.currency,
          purchase_type: validatedData.purchase_type,
          persian_name: body.persian_name,
          phone_number: body.phone,
          province: body.province,
          city: body.city,
          address: body.address,
          postal_code: body.postal_code,
          plate_number: body.plate
        }),
      });

      if (!prepareResponse.ok) {
        throw new Error('خطا در آماده‌سازی پرداخت');
      }

      const prepareData = await prepareResponse.json();
      console.log('Prepare data:', prepareData);
    } catch (error) {
      console.error('Error in prepare request:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'خطا در پردازش درخواست' },
        { status: 400 }
      );
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