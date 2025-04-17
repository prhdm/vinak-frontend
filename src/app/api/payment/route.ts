import { NextResponse } from 'next/server';

interface PaymentData {
  name: string;
  email: string;
  instagram: string;
  amount: number;
  currency: 'USD' | 'IRR';
  paymentMethod: string;
  code: string;
}

export async function POST(request: Request) {
  try {
    const data: PaymentData = await request.json();
    const { email, code } = data;

    // بررسی کد تایید
    if (!global.verificationCodes?.[email] || global.verificationCodes[email] !== code) {
      return NextResponse.json(
        { error: 'کد تایید نامعتبر است' },
        { status: 400 }
      );
    }

    // در اینجا می‌توانید پرداخت را با درگاه پرداخت مورد نظر انجام دهید
    // برای تست، یک کد سفارش تصادفی تولید می‌کنیم
    const orderCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // حذف کد تایید پس از استفاده
    delete global.verificationCodes[email];

    return NextResponse.json({ 
      success: true,
      orderCode,
      message: 'پرداخت با موفقیت انجام شد'
    });
  } catch (error) {
    console.error('Error in payment:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش پرداخت' },
      { status: 500 }
    );
  }
} 