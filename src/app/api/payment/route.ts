import { NextResponse } from 'next/server';

interface PaymentRequest {
  amount: number;
  currency: string;
  gateway: string;
}

export async function POST(request: Request) {
  try {
    const { amount, currency, gateway } = await request.json() as PaymentRequest;
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.BACKEND_URL}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        amount,
        currency: currency.toLowerCase(),
        gateway: gateway.toLowerCase(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in payment:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد پرداخت' },
      { status: 500 }
    );
  }
} 