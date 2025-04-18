import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send OTP');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { error: 'خطا در ارسال کد تایید' },
      { status: 500 }
    );
  }
} 