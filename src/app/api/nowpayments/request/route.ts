import { NextResponse } from 'next/server';

interface NowPaymentsRequestBody {
  amount: number;
  orderCode: string;
  description: string;
  currency: string;
  email: string;
  name: string;
  instagram: string;
  purchase_type: string;
  persian_name?: string;
  phone?: string;
  province?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  plate?: string;
}

export async function POST(request: Request) {
  try {
    console.log('=== NowPayments API Debug ===');
    console.log('Request received at:', new Date().toISOString());

    const body: NowPaymentsRequestBody = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    if (!body.amount || !body.orderCode || !body.description || !body.currency || !body.email || !body.name || !body.instagram) {
      console.log('Missing required fields:', {
        amount: !body.amount,
        orderCode: !body.orderCode,
        description: !body.description,
        currency: !body.currency,
        email: !body.email,
        name: !body.name,
        instagram: !body.instagram
      });
      return NextResponse.json(
        { error: 'همه پارامترها الزامی هستند' },
        { status: 400 }
      );
    }

    // ذخیره اطلاعات کاربر
    try {
      const storeResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/payment/prepare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_code: body.orderCode,
          instagram_id: body.instagram,
          name: body.name,
          email: body.email,
          amount: body.amount,
          description: body.description,
          currency: 'usd',
          purchase_type: body.purchase_type,
          persian_name: body.persian_name,
          phone: body.phone,
          province: body.province,
          city: body.city,
          address: body.address,
          postal_code: body.postal_code,
          plate: body.plate
        }),
      });

      if (!storeResponse.ok) {
        const errorData = await storeResponse.json();
        throw new Error(errorData.error || 'خطا در آماده‌سازی پرداخت');
      }
    } catch (error) {
      console.error('Error preparing payment:', error);
      return NextResponse.json(
        { error: 'خطا در آماده‌سازی پرداخت' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_SITE_URL;

    const requestBody = {
      price_amount: Number(body.amount),
      price_currency: body.currency.toLowerCase(),
      order_id: body.orderCode,
      order_description: body.description,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/payments/nowpayments/callback`,
      success_url: `${baseUrl}/success?orderCode=${body.orderCode}`,
      cancel_url: `${baseUrl}/cancel`,
      customer_email: body.email,
      is_fixed_rate: false,
      is_fee_paid_by_user: false
    };

    console.log('Request to NowPayments:', JSON.stringify(requestBody, null, 2));

    // ارسال درخواست به NowPayments.io
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NOWPAYMENTS_API_KEY || '',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('NowPayments response status:', response.status);
    const responseText = await response.text();
    console.log('NowPayments response text:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Parsed response data:', JSON.stringify(responseData, null, 2));
    } catch (error) {
      console.error('Error parsing response:', error);
      return NextResponse.json(
        { error: 'خطا در پردازش پاسخ' },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('NowPayments API error:', responseData);
      return NextResponse.json(
        { error: responseData.message || 'خطا در ایجاد تراکنش' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in NowPayments request:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد تراکنش' },
      { status: 500 }
    );
  }
} 