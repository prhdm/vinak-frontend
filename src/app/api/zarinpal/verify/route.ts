import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const apiKey = request.headers.get('X-API-Key');
    const expectedApiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'کلید API نامعتبر است' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { authority, status } = body;

    if (!authority || !status) {
      return NextResponse.json(
        { error: 'اطلاعات پرداخت نامعتبر است' },
        { status: 400 }
      );
    }

    // ارسال درخواست تایید به سرور اصلی
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/zarinpal/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        authority,
        status,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'خطا در تایید پرداخت' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'خطا در تایید پرداخت' },
      { status: 500 }
    );
  }
} 