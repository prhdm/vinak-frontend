"use client";
import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');

  const formatAmount = () => {
    if (!amount) return '';
    if (currency === 'USD') return `$${amount}`;
    return `${amount} تومان`;
  };

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
          از حمایت شما متشکریم. به زودی با شما تماس خواهیم گرفت.
        </p>

        {orderCode && (
          <div className="bg-neutral-800 p-4 rounded-xl mb-6">
            <p className="text-neutral-300 font-iranyekan">کد سفارش شما:</p>
            <p className="text-white font-bold text-xl font-iranyekan">{orderCode}</p>
          </div>
        )}

        {amount && (
          <div className="bg-neutral-800 p-4 rounded-xl mb-6">
            <p className="text-neutral-300 font-iranyekan">مبلغ پرداختی:</p>
            <p className="text-white font-bold text-xl font-iranyekan">{formatAmount()}</p>
          </div>
        )}
        
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

export default SuccessPage; 