import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface CreatePaymentRequest {
  amount: number;
  currency: 'USD' | 'IRR';
  gateway: 'zarinpal' | 'crypto';
  name: string;
  email: string;
  instagram: string;
}

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

    const body: CreatePaymentRequest = await request.json();

    // Validate request body
    if (!body.amount || !body.currency || !body.gateway || !body.name || !body.email || !body.instagram) {
      return NextResponse.json(
        { error: 'همه فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'مقدار باید بزرگتر از صفر باشد' },
        { status: 400 }
      );
    }

    // Validate currency and gateway combinations
    if (body.gateway === 'zarinpal' && body.currency !== 'IRR') {
      return NextResponse.json(
        { error: 'درگاه زرین‌پال فقط از تومان پشتیبانی می‌کند' },
        { status: 400 }
      );
    }

    if (body.gateway === 'crypto' && body.currency !== 'USD') {
      return NextResponse.json(
        { error: 'درگاه Crypto فقط از دلار پشتیبانی می‌کند' },
        { status: 400 }
      );
    }

    // Generate a random order code for testing
    const orderCode = Math.random().toString(36).substring(2, 15);

    // Return success response with order code
    return NextResponse.json({
      success: true,
      orderCode,
      amount: body.amount,
      currency: body.currency,
      gateway: body.gateway
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد پرداخت' },
      { status: 500 }
    );
  }
} 