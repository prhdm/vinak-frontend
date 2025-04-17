"use client";
import React, { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('code');

  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-700 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-6 font-iranyekan">
          پرداخت با موفقیت انجام شد
        </h1>
        
        <p className="text-neutral-400 mb-6 font-iranyekan">
          از حمایت شما متشکریم. لینک دانلود آلبوم به ایمیل شما ارسال خواهد شد.
        </p>

        {orderCode && (
          <div className="mb-8">
            <p className="text-neutral-400 mb-3 font-iranyekan">کد سفارش شما:</p>
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <p className="text-3xl font-bold text-white font-iranyekan tracking-widest">{orderCode}</p>
            </div>
            <p className="text-neutral-500 text-sm mt-3 font-iranyekan">
              لطفاً این کد را برای مراجعات بعدی ذخیره کنید
            </p>
          </div>
        )}

        <Link
          href="/"
          className="block w-full py-4 px-6 rounded-xl bg-[#b62c2c] hover:bg-red-600 text-white font-bold transition duration-200 font-iranyekan text-lg"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-200px)] flex items-center justify-center p-4">
        <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-700 w-full max-w-md text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage; 