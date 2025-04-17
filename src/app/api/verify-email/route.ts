import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // در اینجا می‌توانید کد تایید را به ایمیل ارسال کنید
    // برای تست، یک کد تصادفی تولید می‌کنیم
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // ذخیره کد در دیتابیس یا حافظه موقت
    // در این مثال از حافظه موقت استفاده می‌کنیم
    global.verificationCodes = global.verificationCodes || {};
    global.verificationCodes[email] = verificationCode;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in verify-email:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست' },
      { status: 500 }
    );
  }
} 