import { NextResponse } from 'next/server';
import { z } from 'zod';

const verifySchema = z.object({
  orderId: z.string().min(1),
  orderCode: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = verifySchema.parse(body);

    console.log('=== PayPal Verify Debug ===');
    console.log('Validated verify data:', validatedData);

    // تایید پرداخت در پی‌پال
    const captureResponse = await fetch(
      `${process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_URL}/v2/checkout/orders/${validatedData.orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYPAL_SECRET_KEY}`,
        },
      }
    );

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      console.error('PayPal Capture Error:', errorData);
      throw new Error('خطا در تایید پرداخت پی‌پال');
    }

    const captureData = await captureResponse.json();
    console.log('PayPal Capture Response:', captureData);

    // بررسی وضعیت پرداخت
    if (captureData.status !== 'COMPLETED') {
      throw new Error('پرداخت تکمیل نشده است');
    }

    // در اینجا می‌توانید اطلاعات پرداخت را در دیتابیس ذخیره کنید
    // و وضعیت سفارش را به "پرداخت شده" تغییر دهید

    return NextResponse.json({
      success: true,
      message: 'پرداخت با موفقیت انجام شد',
      paymentData: {
        orderId: captureData.id,
        status: captureData.status,
        amount: captureData.purchase_units[0].amount.value,
        currency: captureData.purchase_units[0].amount.currency_code,
      },
    });
  } catch (error) {
    console.error('Error in PayPal verify:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'خطا در تایید پرداخت' },
      { status: 400 }
    );
  }
} 