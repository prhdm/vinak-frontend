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

    console.log('Making payment request to backend:', {
      url: `${process.env.BACKEND_URL}/api/payments`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: {
        amount,
        currency: currency.toLowerCase(),
        gateway: gateway.toLowerCase(),
      }
    });

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
      const errorData = await response.json();
      console.error('Backend payment error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.error || `Failed to create payment: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطا در ایجاد پرداخت' },
      { status: 500 }
    );
  }
} 