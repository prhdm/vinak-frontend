import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// تعریف store برای ذخیره اطلاعات کاربر
const userDataStore: Record<string, any> = {};

// تنظیم مسیر فایل لاگ
const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, 'zarinpal-requests.log');

// اطمینان از وجود دایرکتوری لاگ
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

interface ZarinpalRequestBody {
  amount: number;
  orderCode: string;
  description: string;
  callback_url: string;
  name: string;
  instagram_id: string;
  email: string;
}

// تبدیل تومان به ریال
const tomanToRial = (amount: number): number => amount * 10;

// تابع برای نوشتن لاگ
const writeLog = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}\n\n`;
  fs.appendFileSync(logFile, logMessage);
  console.log(message, data || '');
};

export async function POST(request: Request) {
  try {
    console.log('=== Zarinpal API Debug ===');
    console.log('Request received at:', new Date().toISOString());
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    // اعتبارسنجی ورودی‌ها
    if (!body.amount || !body.orderCode || !body.description || !body.name || !body.email || !body.instagram_id) {
      console.log('Missing required fields:', {
        amount: !body.amount,
        orderCode: !body.orderCode,
        description: !body.description,
        name: !body.name,
        email: !body.email,
        instagram_id: !body.instagram_id
      });
      return NextResponse.json(
        { error: 'همه پارامترها الزامی هستند' },
        { status: 400 }
      );
    }

    // بررسی مقدار مبلغ
    if (body.amount <= 0) {
      console.log('Validation failed - Invalid amount');
      return NextResponse.json(
        { error: 'مبلغ باید بزرگتر از صفر باشد' },
        { status: 400 }
      );
    }

    const requestBody = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: tomanToRial(body.amount), // تبدیل به ریال
      description: body.description,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/payments/zarinpal/callback`,
      metadata: {
        order_id: body.orderCode,
      }
    };

    console.log('Sending request to Zarinpal:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Zarinpal response status:', response.status);
    const responseText = await response.text();
    console.log('Zarinpal response text:', responseText);
    
    const data = JSON.parse(responseText);
    console.log('Parsed response data:', JSON.stringify(data, null, 2));

    if (data.data?.code === 100 && data.data?.authority) {
      const authorityId = data.data.authority;
      
      const prepareResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/payment/prepare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: body.name,
          instagram_id: body.instagram_id,
          email: body.email,
          amount: body.amount,
          currency: 'irr',
          authority_id: authorityId,
          order_code: body.orderCode,
          purchase_type: body.purchase_type,
          persian_name: body.persian_name,
          phone: body.phone,
          province: body.province,
          city: body.city,
          address: body.address,
          postal_code: body.postal_code,
          plate: body.plate
        }),
      });

      // بررسی پاسخ از API prepare
      if (prepareResponse.status !== 200) {
        console.log('Prepare payment failed:', await prepareResponse.text());
        return NextResponse.json(
          { error: 'خطا در آماده‌سازی پرداخت' },
          { status: 400 }
        );
      }
      
      const paymentUrl = `https://www.zarinpal.com/pg/StartPay/${authorityId}`;
      
      // ذخیره اطلاعات کاربر
      const userData = {
        name: body.name,
        email: body.email,
        instagram: body.instagram_id,
        amount: body.amount,
        description: body.description,
        currency: 'IRR',
        timestamp: Date.now(),
        paymentUrl: paymentUrl,
        authority: authorityId
      };

      // ذخیره اطلاعات در store
      userDataStore[body.orderCode] = userData;

      console.log('User data stored:', userData);
      console.log('Payment URL generated:', paymentUrl);

      return NextResponse.json(userData);
    } else {
      console.log('Zarinpal error:', data.errors?.message || 'خطای نامشخص');
      return NextResponse.json(
        { error: data.errors?.message || 'خطا در ایجاد تراکنش' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in Zarinpal request:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد تراکنش' },
      { status: 500 }
    );
  }
} 