"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ZarinpalVerify() {
  const searchParams = useSearchParams();
  const Authority = searchParams.get('Authority');
  const Status = searchParams.get('Status');
  const orderCode = searchParams.get('orderCode');

  useEffect(() => {
    const verifyPayment = async () => {
      if (Authority && Status) {
        try {
          const apiKey = process.env.NEXT_PUBLIC_API_KEY;
          if (!apiKey) {
            throw new Error('API key not found');
          }

          // بازیابی اطلاعات کاربر
          const userDataResponse = await fetch(`/api/v1/payment/prepare?authority_id=${Authority}`);
          if (!userDataResponse.ok) {
            throw new Error('خطا در بازیابی اطلاعات کاربر');
          }
          const userData = await userDataResponse.json();

          const response = await fetch('/api/zarinpal/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': apiKey,
            },
            body: JSON.stringify({
              authority: Authority,
              status: Status,
              ...userData
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            window.location.href = '/success';
          } else {
            window.location.href = '/cancel';
          }
        } catch (error) {
          console.error('Error:', error);
          window.location.href = '/cancel';
        }
      } else {
        window.location.href = '/cancel';
      }
    };

    verifyPayment();
  }, [Authority, Status]);

  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-700 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Loader2 className="w-20 h-20 text-[#8B0000] animate-spin" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-6 font-iranyekan">
          در حال بررسی پرداخت
        </h1>
        
        <p className="text-neutral-400 mb-6 font-iranyekan">
          لطفاً صبر کنید. در حال بررسی وضعیت پرداخت شما هستیم.
        </p>
      </div>
    </div>
  );
} 