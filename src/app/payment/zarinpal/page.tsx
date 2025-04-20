"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ZarinpalPayment() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const orderCode = searchParams.get('orderCode');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const instagram = searchParams.get('instagram');
  const purchase_type = searchParams.get('purchase_type');
  const persianName = searchParams.get('persian_name');
  const phone = searchParams.get('phone');
  const province = searchParams.get('province');
  const city = searchParams.get('city');
  const address = searchParams.get('address');
  const postalCode = searchParams.get('postal_code');
  const plate = searchParams.get('plate');

  useEffect(() => {
    const redirectToZarinpal = async () => {
      console.log('=== Zarinpal Payment Debug ===');
      console.log('URL parameters:', {
        amount,
        orderCode,
        name,
        email,
        instagram,
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
          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/payments/zarinpal/callback`,
          name,
          email,
          instagram_id: instagram,
          persian_name: persianName,
          phone: phone,
          province: province,
          city: city,
          address: address,
          postal_code: postalCode,
          purchase_type: purchase_type,
          plate: plate,
          currency: 'irr',
        };

        console.log('Sending request to Zarinpal with:', requestBody);

        // Call Zarinpal request API directly
        const response = await fetch('/api/zarinpal/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'خطا در آماده‌سازی پرداخت');
        }

        const data = await response.json();
        if (!data.paymentUrl) {
          throw new Error('خطا در دریافت لینک پرداخت');
        }

        console.log('Redirecting to:', data.paymentUrl);
        window.location.href = data.paymentUrl;
      } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'خطا در اتصال به درگاه پرداخت. لطفاً دوباره تلاش کنید.');
        window.location.href = '/';
      }
    };

    redirectToZarinpal();
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
          لطفاً صبر کنید. در حال انتقال به درگاه پرداخت زرین‌پال هستید.
        </p>
      </div>
    </div>
  );
} 