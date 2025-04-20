import { NextResponse } from 'next/server';
import type { PaymentData } from '@/types/payment';

// ذخیره‌سازی موقت کدهای تایید
const verificationCodes: Record<string, string> = {};

export async function POST(request: Request) {
  try {
    const { email, code, amount, currency, name, instagram } = await request.json() as PaymentData;

    if (!email || !code || !amount || !currency || !name || !instagram) {
      return NextResponse.json(
        { error: 'همه فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

    // بررسی کد تایید
    if (!verificationCodes[email] || verificationCodes[email] !== code) {
      return NextResponse.json(
        { error: 'کد تایید نامعتبر است' },
        { status: 400 }
      );
    }

    // در اینجا می‌توانید پرداخت را با درگاه پرداخت مورد نظر انجام دهید
    // برای تست، یک کد سفارش تصادفی تولید می‌کنیم
    const orderCode = Math.random().toString(36).substring(2, 15);

    // حذف کد تایید پس از استفاده
    delete verificationCodes[email];

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