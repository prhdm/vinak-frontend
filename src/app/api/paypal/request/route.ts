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
  purchase_type: z.enum(['physical', 'digital']),
  persian_name: z.string().optional(),
  phone: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  plate: z.string().optional(),
}).refine((data) => {
  if (data.purchase_type === 'physical') {
    return !!(data.persian_name && data.phone && data.province && data.city && data.address && data.postal_code);
  }
  return true;
}, {
  message: "لطفا اطلاعات را کامل وارد کنید"
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = requestSchema.parse(body);

    console.log('=== PayPal Request Debug ===');
    console.log('Validated request data:', validatedData);

    // Get PayPal access token
    const tokenResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.NEXT_PUBLIC_PAYPAL_SECRET_KEY}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    console.log('Token response status:', tokenResponse.status);
    console.log('Using client ID:', process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
    const tokenText = await tokenResponse.text();
    console.log('Token raw response:', tokenText);

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
      console.log('Token parsed response:', tokenData);
    } catch (error) {
      console.error('Failed to parse token response:', error);
      console.error('Raw token response was:', tokenText);
      throw new Error('خطا در دریافت توکن پی‌پال');
    }

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('PayPal token error:', tokenData);
      throw new Error('خطا در دریافت توکن پی‌پال');
    }

    // ایجاد درخواست پرداخت به پی‌پال
    const paypalResponse = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`,
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

    console.log('PayPal response status:', paypalResponse.status);
    const responseText = await paypalResponse.text();
    console.log('PayPal raw response:', responseText);

    let paypalData;
    try {
      paypalData = JSON.parse(responseText);
      console.log('PayPal parsed response:', paypalData);
    } catch (error) {
      console.error('Failed to parse PayPal response:', error);
      console.error('Raw response was:', responseText);
      throw new Error('خطا در پاسخ دریافتی از پی‌پال');
    }

    if (!paypalResponse.ok) {
      console.error('PayPal API Error:', paypalData);
      throw new Error(paypalData.message || 'خطا در ایجاد درخواست پرداخت پی‌پال');
    }

    // پیدا کردن لینک تایید پرداخت
    const approveLink = paypalData.links?.find((link: any) => link.rel === 'approve');
    if (!approveLink) {
      console.error('No approve link found in PayPal response:', paypalData);
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