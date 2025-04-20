"use client";
import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

const FailedPage = () => {
  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-700 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="w-20 h-20 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-6 font-iranyekan">
          پرداخت ناموفق بود
        </h1>
        
        <p className="text-neutral-400 mb-6 font-iranyekan">
          متاسفانه پرداخت شما با خطا مواجه شد. لطفاً دوباره تلاش کنید.
        </p>

        <Link
          href="/"
          className="block w-full py-4 px-6 rounded-xl bg-[#8B0000] hover:bg-[#8B0000] text-white font-bold transition duration-200 font-iranyekan text-lg"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
};

export default FailedPage; 