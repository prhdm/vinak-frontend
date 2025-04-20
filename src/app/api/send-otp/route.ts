import { NextResponse } from 'next/server';
import { SendOTPRequest } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const body: SendOTPRequest = await request.json();
    console.log('Sending OTP request:', { email: body.email });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { error: errorData.error || 'Failed to send OTP' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend success response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in send-otp route:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
} 