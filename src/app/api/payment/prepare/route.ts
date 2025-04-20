import { NextResponse } from 'next/server';

// ذخیره‌سازی موقت اطلاعات کاربر
const userDataStore: Record<string, any> = {};

interface PreparePaymentRequest {
  orderCode: string;
  name: string;
  email: string;
  instagram: string;
  amount: number;
  description: string;
  currency: string;
}

export async function POST(request: Request) {
  try {
    const body: PreparePaymentRequest = await request.json();
    
    // بررسی پارامترهای الزامی
    if (!body.orderCode || !body.name || !body.email || !body.instagram || !body.amount || !body.description || !body.currency) {
      return NextResponse.json(
        { error: 'همه پارامترها الزامی هستند' },
        { status: 400 }
      );
    }

    // ذخیره اطلاعات کاربر
    userDataStore[body.orderCode] = {
      name: body.name,
      email: body.email,
      instagram: body.instagram,
      amount: body.amount,
      description: body.description,
      currency: body.currency,
      timestamp: Date.now()
    };

    console.log('User data stored:', userDataStore[body.orderCode]);
    
    return NextResponse.json({ 
      success: true,
      message: 'اطلاعات با موفقیت ذخیره شد',
      data: {
        orderCode: body.orderCode,
        amount: body.amount,
        currency: body.currency
      }
    });
    
  } catch (error) {
    console.error('Error preparing payment:', error);
    return NextResponse.json(
      { error: 'خطا در آماده‌سازی پرداخت' },
      { status: 500 }
    );
  }
}

// متد GET برای بازیابی اطلاعات کاربر
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get('orderCode');

    if (!orderCode) {
      return NextResponse.json(
        { error: 'شناسه سفارش الزامی است' },
        { status: 400 }
      );
    }

    const userData = userDataStore[orderCode];
    if (!userData) {
      return NextResponse.json(
        { error: 'اطلاعات کاربر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return NextResponse.json(
      { error: 'خطا در بازیابی اطلاعات کاربر' },
      { status: 500 }
    );
  }
} 