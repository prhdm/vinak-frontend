"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from 'lucide-react';
import { provinces, cities, Province, City } from '@/data/iran-locations';

interface FormData {
  name: string;
  email: string;
  instagram: string;
  amount: number;
  paymentMethod: 'zarinpal' | 'crypto' | 'paypal';
  currency: 'USD' | 'IRR';
  version: 'digital' | 'physical';
  persianName?: string;
  phone?: string;
  province?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  plate?: string;
}

const persianToLatinDigits = (str: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)));
};

const latinToPersianDigits = (str: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d, 10)]);
};

const PurchaseForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<'digital' | 'physical'>('digital');
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const validatePostalCode = (postalCode: string) => {
    return true;
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      instagram: '',
      amount: 420000,
      paymentMethod: 'zarinpal',
      currency: 'IRR',
      version: 'digital',
    },
  });

  const [amountDisplay, setAmountDisplay] = useState<string>('');
  const [finalAmountDisplay, setFinalAmountDisplay] = useState<string>('');
  const amount = watch('amount');
  const currency = watch('currency');

  useEffect(() => {
    if (currency === 'IRR') {
      setValue('paymentMethod', 'zarinpal');
      if (selectedVersion === 'digital') {
        setValue('amount', 420000);
        setAmountDisplay((420000).toLocaleString('fa-IR'));
        setFinalAmountDisplay((420000 * 1.14).toLocaleString('fa-IR'));
      } else {
        setValue('amount', 1000000);
        setAmountDisplay((1000000).toLocaleString('fa-IR'));
        setFinalAmountDisplay((1000000 * 1.14).toLocaleString('fa-IR'));
      }
    } else if (currency === 'USD') {
        setValue('paymentMethod', 'crypto');
      if (selectedVersion === 'digital') {
        setValue('amount', 12);
        setAmountDisplay((12).toLocaleString('fa-IR'));
        setFinalAmountDisplay((12 * 1.07).toLocaleString('fa-IR'));
      } else {
        setValue('amount', 20);
        setAmountDisplay((20).toLocaleString('fa-IR'));
        setFinalAmountDisplay((20 * 1.07).toLocaleString('fa-IR'));
      }
    }
  }, [currency, selectedVersion, setValue]);

  const updateFinalAmount = (amount: number) => {
    if (currency === 'IRR') {
      setFinalAmountDisplay((amount * 1.14).toLocaleString('fa-IR'));
    } else if (currency === 'USD') {
      setFinalAmountDisplay((amount * 1.07).toLocaleString('fa-IR'));
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const formData = watch();
      const finalAmount = formData.currency === 'IRR' 
        ? Math.round(formData.amount * 1.14)
        : Math.round(formData.amount * 1.07);

      // Generate a random orderCode
      const orderCode = Math.random().toString(36).substring(2, 15);

      if (formData.currency === 'IRR') {
        // Redirect to Zarinpal payment page
        window.location.href = `/payment/zarinpal?amount=${finalAmount}&orderCode=${orderCode}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&instagram=${encodeURIComponent(formData.instagram)}&purchase_type=${selectedVersion}&persian_name=${encodeURIComponent(formData.persianName || '')}&phone=${encodeURIComponent(formData.phone || '')}&province=${encodeURIComponent(formData.province || '')}&city=${encodeURIComponent(formData.city || '')}&address=${encodeURIComponent(formData.address || '')}&postal_code=${encodeURIComponent(formData.postalCode || '')}&plate=${encodeURIComponent(formData.plate || '')}`;
      } else if (formData.paymentMethod === 'crypto') {
        // Redirect to NOWPayments page
        window.location.href = `/payment/crypto?amount=${finalAmount}&orderCode=${orderCode}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&instagram=${encodeURIComponent(formData.instagram)}&purchase_type=${selectedVersion}&persian_name=${encodeURIComponent(formData.persianName || '')}&phone=${encodeURIComponent(formData.phone || '')}&province=${encodeURIComponent(formData.province || '')}&city=${encodeURIComponent(formData.city || '')}&address=${encodeURIComponent(formData.address || '')}&postal_code=${encodeURIComponent(formData.postalCode || '')}&plate=${encodeURIComponent(formData.plate || '')}`;
      } else if (formData.paymentMethod === 'paypal') {
        // Redirect to PayPal payment page
        window.location.href = `/payment/paypal?amount=${finalAmount}&orderCode=${orderCode}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&instagram=${encodeURIComponent(formData.instagram)}&purchase_type=${selectedVersion}&persian_name=${encodeURIComponent(formData.persianName || '')}&phone=${encodeURIComponent(formData.phone || '')}&province=${encodeURIComponent(formData.province || '')}&city=${encodeURIComponent(formData.city || '')}&address=${encodeURIComponent(formData.address || '')}&postal_code=${encodeURIComponent(formData.postalCode || '')}&plate=${encodeURIComponent(formData.plate || '')}`;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در پردازش درخواست. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (code: string) => {
    setIsLoading(true);

    try {
      const formData = watch();
      const finalAmount = formData.currency === 'IRR' 
        ? Math.round(formData.amount * 1.14)
        : Math.round(formData.amount * 1.07);

      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: finalAmount,
          code,
        }),
      });

      const result = await paymentResponse.json();

      if (paymentResponse.ok) {
        if (formData.paymentMethod === 'zarinpal') {
          window.location.href = `/payment/zarinpal?amount=${finalAmount}&orderCode=${result.orderCode}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&instagram=${encodeURIComponent(formData.instagram)}&purchase_type=${selectedVersion}&persian_name=${encodeURIComponent(formData.persianName || '')}&phone=${encodeURIComponent(formData.phone || '')}&province=${encodeURIComponent(formData.province || '')}&city=${encodeURIComponent(formData.city || '')}&address=${encodeURIComponent(formData.address || '')}&postal_code=${encodeURIComponent(formData.postalCode || '')}&plate=${encodeURIComponent(formData.plate || '')}`;
        } else if (formData.paymentMethod === 'crypto') {
          window.location.href = `/payment/crypto?amount=${finalAmount}&orderCode=${result.orderCode}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&instagram=${encodeURIComponent(formData.instagram)}&purchase_type=${selectedVersion}&persian_name=${encodeURIComponent(formData.persianName || '')}&phone=${encodeURIComponent(formData.phone || '')}&province=${encodeURIComponent(formData.province || '')}&city=${encodeURIComponent(formData.city || '')}&address=${encodeURIComponent(formData.address || '')}&postal_code=${encodeURIComponent(formData.postalCode || '')}&plate=${encodeURIComponent(formData.plate || '')}`;
        } else if (formData.paymentMethod === 'paypal') {
          window.location.href = `/payment/paypal?amount=${finalAmount}&orderCode=${result.orderCode}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&instagram=${encodeURIComponent(formData.instagram)}&purchase_type=${selectedVersion}&persian_name=${encodeURIComponent(formData.persianName || '')}&phone=${encodeURIComponent(formData.phone || '')}&province=${encodeURIComponent(formData.province || '')}&city=${encodeURIComponent(formData.city || '')}&address=${encodeURIComponent(formData.address || '')}&postal_code=${encodeURIComponent(formData.postalCode || '')}&plate=${encodeURIComponent(formData.plate || '')}`;
        }
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setValue('city', '');
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        dir="rtl"
        className="w-full max-w-[95vw] mx-auto bg-neutral-900 text-neutral-100 p-6 sm:p-10 px-4 sm:px-6 rounded-3xl border border-neutral-800 transition-all duration-300 font-iranyekan shadow-lg"
      >
        <h2 className="mb-10 text-2xl md:text-2xl text-center">فرم خرید آلبوم</h2>
        
        <div className="space-y-8">
          <div>
            <div className="flex gap-4">
            <button
              type="button"
                onClick={() => setSelectedVersion('digital')}
                className={`w-full py-4 px-6 text-base rounded-xl border transition ${
                  selectedVersion === 'digital'
                    ? 'bg-[#8B0000] border-[#8B0000] text-white'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-100 hover:bg-neutral-700'
              }`}
            >
              نسخه دیجیتال
            </button>
            <button
              type="button"
                onClick={() => setSelectedVersion('physical')}
                className={`w-full py-4 px-6 text-base rounded-xl border transition ${
                  selectedVersion === 'physical'
                    ? 'bg-[#8B0000] border-[#8B0000] text-white'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-100 hover:bg-neutral-700'
              }`}
            >
              نسخه فیزیکی
            </button>
          </div>
        </div>

            <div>
            <label className="block text-base mb-3">اسم به انگلیسی (برای نمایش در سایت)</label>
              <input
                {...register('name', {
                  required: 'وارد کردن نام به انگلیسی الزامی است',
                  minLength: { value: 2, message: 'نام باید حداقل ۲ کاراکتر باشد' },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'فقط حروف انگلیسی وارد کنید',
                  },
                })}
                placeholder="Your Name or Nickname"
              className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan"
              />
            {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>}
            </div>

          {selectedVersion === 'physical' && (
              <>
                <div>
                <label className="block text-base mb-3">اسم به فارسی (برای پست)</label>
                  <input
                    {...register('persianName', {
                      required: 'وارد کردن نام به فارسی الزامی است',
                      minLength: { value: 2, message: 'نام باید حداقل ۲ کاراکتر باشد' },
                    })}
                  placeholder="نام و نام خانوادگی"
                  className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan"
                  />
                {errors.persianName && <p className="mt-2 text-sm text-red-400">{errors.persianName.message}</p>}
                </div>

                <div>
                <label className="block text-base mb-3">شماره تلفن</label>
                  <input
                    {...register('phone', {
                      required: 'شماره تلفن الزامی است',
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: 'شماره تلفن باید ۱۱ رقم باشد',
                      },
                    })}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan"
                  />
                {errors.phone && <p className="mt-2 text-sm text-red-400">{errors.phone.message}</p>}
                </div>

                <div>
                <label className="block text-base mb-3">استان</label>
                  <select
                  id="province"
                  {...register('province', { required: 'لطفا استان را انتخاب کنید' })}
                  onChange={handleProvinceChange}
                  className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan"
                  >
                    <option value="">انتخاب استان</option>
                  {provinces.map((province: Province) => (
                      <option key={province.id} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                {errors.province && (
                  <p className="mt-2 text-sm text-red-400">{errors.province.message}</p>
                )}
                </div>

                <div>
                <label className="block text-base mb-3">شهر</label>
                  <select
                  id="city"
                  {...register('city', { required: 'لطفا شهر را انتخاب کنید' })}
                  disabled={!selectedProvince}
                  className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">انتخاب شهر</option>
                  {selectedProvince && cities[selectedProvince]?.map((city: City) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                          </option>
                        ))}
                  </select>
                {errors.city && (
                  <p className="mt-2 text-sm text-red-400">{errors.city.message}</p>
                )}
                </div>

                <div>
                <label className="block text-base mb-3">آدرس</label>
                  <textarea
                    {...register('address', {
                      required: 'آدرس الزامی است',
                    })}
                    placeholder="آدرس کامل"
                  className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan"
                  />
                {errors.address && <p className="mt-2 text-sm text-red-400">{errors.address.message}</p>}
                </div>

                  <div>
                <label className="block text-base mb-3">کد پستی</label>
                    <input
                      {...register('postalCode', {
                        required: 'کد پستی الزامی است',
                        pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'کد پستی باید ۱۰ رقم باشد',
                    },
                    validate: (value) => {
                      if (!value) return true;
                      if (!validatePostalCode(value)) {
                              return 'کد پستی با استان انتخاب شده مطابقت ندارد';
                            }
                            return true;
                        }
                      })}
                  placeholder="۱۲۳۴۵۶۷۸۹۰"
                  className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan"
                    />
                {errors.postalCode && <p className="mt-2 text-sm text-red-400">{errors.postalCode.message}</p>}
                  </div>

                  <div>
                <label className="block text-base mb-3">پلاک</label>
                    <input
                  {...register('plate')}
                      placeholder="پلاک"
                  className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan"
                    />
                {errors.plate && <p className="mt-2 text-sm text-red-400">{errors.plate.message}</p>}
                </div>
              </>
            )}

            <div>
            <label className="block text-base mb-3">ایمیل</label>
              <input
                {...register('email', {
                  required: 'ایمیل الزامی است',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'ایمیل معتبر نیست',
                  },
                })}
                type="email"
                placeholder="example@email.com"
              className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan"
            />
            {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <div>
            <label className="block text-base mb-3">آیدی اینستاگرام</label>
                  <input
              {...register('instagram', {
                required: 'آیدی اینستاگرام الزامی است',
                      pattern: {
                  value: /^[A-Za-z0-9._]+$/,
                  message: 'لطفاً آیدی را بدون @ وارد کنید',
                      },
                validate: (value) => 
                  value.startsWith('@') ? 'لطفاً آیدی را بدون @ وارد کنید' : true,
                    })}
              placeholder="Your Instagram ID"
              className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan"
                  />
            {errors.instagram && <p className="mt-2 text-sm text-red-400">{errors.instagram.message}</p>}
                </div>

                <div>
            <label className="block text-base mb-3">واحد پول</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setValue('currency', 'IRR')}
                className={`w-full py-4 px-6 text-base rounded-xl border transition ${
                    currency === 'IRR'
                    ? 'bg-[#8B0000] border-[#8B0000] text-white'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-100 hover:bg-neutral-700'
                  }`}
                >
                  تومان
                </button>
                <button
                  type="button"
                  onClick={() => setValue('currency', 'USD')}
                className={`w-full py-4 px-6 text-base rounded-xl border transition ${
                    currency === 'USD'
                    ? 'bg-[#8B0000] border-[#8B0000] text-white'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-100 hover:bg-neutral-700'
                  }`}
                >
                  دلار
                </button>
              </div>
            </div>

            <div>
            <label className="block text-base mb-3">
                مبلغ ({currency === 'IRR' ? 'تومان' : 'دلار'})
              </label>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: 'مقدار الزامی است',
                  validate: (value) => {
                    if (currency === 'USD') {
                    if (selectedVersion === 'digital') {
                      return value >= 12 || 'حداقل مبلغ ۱۲ دلار است';
                    } else {
                      return value >= 20 || 'حداقل مبلغ ۲۰ دلار است';
                    }
                    } else if (currency === 'IRR') {
                    if (selectedVersion === 'digital') {
                      return value >= 420000 || 'حداقل مبلغ ۴۲۰,۰۰۰ تومان است';
                      } else {
                      return value >= 1000000 || 'حداقل مبلغ ۱,۰۰۰,۰۰۰ تومان است';
                    }
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <>
                    <input
                    {...field}
                      type="text"
                      value={amountDisplay}
                      onChange={(e) => {
                      const rawValue = e.target.value.replace(/[,،٬]/g, '');
                        const latinValue = persianToLatinDigits(rawValue);
                      const numericValue = Number(latinValue);
                      
                      if (!isNaN(numericValue)) {
                            field.onChange(numericValue);
                            try {
                          const persianValue = numericValue.toLocaleString('fa-IR');
                              setAmountDisplay(persianValue);
                              updateFinalAmount(numericValue);
                        } catch {
                              const withCommas = latinValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                              const persianWithCommas = latinToPersianDigits(withCommas);
                              setAmountDisplay(persianWithCommas);
                              updateFinalAmount(numericValue);
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const rawValue = e.target.value.replace(/[,،٬]/g, '');
                        const latinValue = persianToLatinDigits(rawValue);
                        
                        if (latinValue === '') {
                        if (currency === 'IRR') {
                          setAmountDisplay((1000000).toLocaleString('fa-IR'));
                          setFinalAmountDisplay((1000000 * 1.14).toLocaleString('fa-IR'));
                          field.onChange(1000000);
                        } else if (currency === 'USD') {
                          setAmountDisplay((10).toLocaleString('fa-IR'));
                          setFinalAmountDisplay((10 * 1.07).toLocaleString('fa-IR'));
                          field.onChange(10);
                        }
                      } else {
                        const numericValue = Number(latinValue);
                        if (currency === 'IRR' && numericValue < 1000000) {
                          setAmountDisplay((1000000).toLocaleString('fa-IR'));
                          setFinalAmountDisplay((1000000 * 1.14).toLocaleString('fa-IR'));
                          field.onChange(1000000);
                        } else if (currency === 'USD' && numericValue < 10) {
                          setAmountDisplay((10).toLocaleString('fa-IR'));
                          setFinalAmountDisplay((10 * 1.07).toLocaleString('fa-IR'));
                          field.onChange(10);
                        } else {
                          field.onChange(numericValue);
                          try {
                            const persianValue = numericValue.toLocaleString('fa-IR');
                            setAmountDisplay(persianValue);
                            updateFinalAmount(numericValue);
                          } catch {
                            const withCommas = latinValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            const persianWithCommas = latinToPersianDigits(withCommas);
                            setAmountDisplay(persianWithCommas);
                            updateFinalAmount(numericValue);
                          }
                          }
                        }
                      }}
                    placeholder={currency === 'IRR' ? "حداقل ۱,۰۰۰,۰۰۰ تومان" : "حداقل ۱۰ دلار"}
                    className="w-full px-4 py-4 text-base min-[16px] rounded-lg bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none placeholder-neutral-500 font-iranyekan"
                    />
                  {currency === 'IRR' && (
                    <div className="mt-3 text-base text-neutral-400">
                      نمایش در سایت: {Math.round(amount / 83000)} دلار
                    </div>
                  )}
                  <div className="mt-3 text-base text-neutral-400">
                    مبلغ نهایی با احتساب مالیات: {finalAmountDisplay} {currency === 'IRR' ? 'تومان' : 'دلار'}
                  </div>
                  {errors.amount && <p className="mt-2 text-sm text-red-400">{errors.amount.message}</p>}
                  </>
                )}
              />
            </div>

            {currency === 'USD' && (
              <div>
              <label className="block text-base mb-3">روش پرداخت</label>
              <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setValue('paymentMethod', 'crypto')}
                    className={`w-full h-[100px] bg-white p-3 rounded-xl transition flex items-center justify-center ${
                        watch('paymentMethod') === 'crypto'
                          ? 'ring-2 ring-red-300'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src="/images/payments/crypto.jpg"
                        alt="Crypto"
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </button>
                  <span className="mt-2 text-base text-neutral-100">Crypto</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setValue('paymentMethod', 'paypal')}
                    className={`w-full h-[100px] bg-white p-3 rounded-xl transition flex items-center justify-center ${
                        watch('paymentMethod') === 'paypal'
                          ? 'ring-2 ring-red-300'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src="/images/payments/paypal.png"
                        alt="PayPal"
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </button>
                  <span className="mt-2 text-base text-neutral-100">PayPal</span>
                </div>
                </div>
              </div>
            )}

            <button
              type="submit"
            className="w-full py-4 px-6 text-base bg-[#8B0000] text-white rounded-xl hover:bg-[#8B0000] transition-colors duration-300 font-iranyekan"
            >
              {isLoading ? (
              <div className="flex items-center justify-center font-iranyekan">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  در حال پردازش...
              </div>
              ) : (
              'ادامه'
              )}
            </button>
          </div>
      </form>
    </>
  );
};

export default PurchaseForm;