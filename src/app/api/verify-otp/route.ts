import { NextResponse } from 'next/server';

interface VerifyOTPRequest {
  email: string;
  otp: string;
  instagram_id: string;
  name: string;
}

export async function POST(request: Request) {
  try {
    const { email, otp, instagram_id, name } = await request.json() as VerifyOTPRequest;

    const response = await fetch(`${process.env.BACKEND_URL}/api/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp,
        instagram_id,
        name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to verify OTP');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { error: 'خطا در تایید کد' },
      { status: 500 }
    );
  }
} 