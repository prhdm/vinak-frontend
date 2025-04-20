"use client";
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function CryptoPaymentContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const orderCode = searchParams.get('orderCode');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const instagram = searchParams.get('instagram');
  const purchase_type = searchParams.get('purchase_type');
  const persian_name = searchParams.get('persian_name');
  const phone = searchParams.get('phone');
  const province = searchParams.get('province');
  const city = searchParams.get('city');
  const address = searchParams.get('address');
  const postal_code = searchParams.get('postal_code');
  const plate = searchParams.get('plate');

  useEffect(() => {
    const redirectToNowPayments = async () => {
      console.log('=== NowPayments Payment Debug ===');
      console.log('URL parameters:', {
        amount,
        orderCode,
        name,
        email,
        instagram
      });

      if (!amount || !orderCode || !name || !email || !instagram) {
        console.log('Missing required parameters:', {
          amount: !amount,
          orderCode: !orderCode,
          name: !name,
          email: !email,
          instagram: !instagram
        });
        alert('اطلاعات پرداخت ناقص است. لطفاً دوباره تلاش کنید.');
        window.location.href = '/';
        return;
      }

      try {
        const requestBody = {
          amount: Number(amount),
          orderCode,
          description: 'خرید آلبوم',
          currency: 'usd',
          name,
          email,
          instagram
        };

        console.log('Sending request to NowPayments with:', requestBody);


        // فراخوانی API NowPayments
        const response = await fetch('/api/nowpayments/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          cache: 'no-store'
        });

        console.log('NowPayments response status:', response.status);
        let data;
        try {
          const responseText = await response.text();
          console.log('NowPayments response text:', responseText);
          data = JSON.parse(responseText);
        } catch (error) {
          console.error('Error parsing response:', error);
          throw new Error('خطا در پردازش پاسخ');
        }

        if (!response.ok) {
          throw new Error(data.error || 'خطا در آماده‌سازی پرداخت');
        }

        var prepareRequestBody = {
          name: name,
          instagram_id: instagram,
          email: email,
          currency: 'usd',
          amount: Number(amount),
          order_id: orderCode
        }
        const prepareResponse = await fetch('/api/v1/payment/prepare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(prepareRequestBody),
          cache: 'no-store'
        });

        if (!prepareResponse.ok) {
          const prepareData = await prepareResponse.json();
          throw new Error(prepareData.error || 'خطا در آماده‌سازی پرداخت');
        }


        if (!data.invoice_url) {
          console.error('No invoice URL in response:', data);
          throw new Error('خطا در دریافت لینک پرداخت');
        }

        console.log('Redirecting to:', data.invoice_url);
        window.location.href = data.invoice_url;
      } catch (error: any) {
        console.error('Error in payment process:', error);
        alert(error.message || 'خطا در اتصال به درگاه پرداخت. لطفاً دوباره تلاش کنید.');
        window.location.href = '/';
      }
    };

    redirectToNowPayments();
  }, [amount, orderCode, name, email, instagram]);

  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-700 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Loader2 className="w-20 h-20 text-[#8B0000] animate-spin" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-6 font-iranyekan">
          در حال انتقال به درگاه پرداخت
        </h1>
        
        <p className="text-neutral-400 mb-6 font-iranyekan">
          لطفاً صبر کنید. در حال انتقال به درگاه پرداخت ارز دیجیتال هستید.
        </p>
      </div>
    </div>
  );
}

export default function CryptoPaymentPage() {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <CryptoPaymentContent />
    </Suspense>
  );
} 