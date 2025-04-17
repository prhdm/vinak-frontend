"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from 'lucide-react';
import EmailVerificationPopup from "./EmailVerificationPopup";
import iranCities from '../data/iran-cities.json';

interface Province {
  id: number;
  name: string;
  cities: string[];
}

interface IranCities {
  provinces: Province[];
}

interface FormData {
  versionType: 'digital' | 'physical';
  name: string;
  persianName?: string;
  email: string;
  instagram: string;
  amount: number;
  paymentMethod: 'zarinpal' | 'crypto' | 'paypal';
  currency: 'USD' | 'IRR';
  phone?: string;
  address?: string;
  postalCode?: string;
  houseNumber?: string;
  province?: string;
  city?: string;
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
  const [showVerification, setShowVerification] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      versionType: 'digital',
      name: '',
      email: '',
      instagram: '',
      amount: 420000,
      paymentMethod: 'zarinpal',
      currency: 'IRR',
    },
  });

  const versionType = watch('versionType');
  const [amountDisplay, setAmountDisplay] = useState<string>('');
  const [finalAmountDisplay, setFinalAmountDisplay] = useState<string>('');
  const currency = watch('currency');

  useEffect(() => {
    if (currency === 'IRR') {
      setValue('paymentMethod', 'zarinpal');
      if (versionType === 'physical') {
        setValue('amount', 1000000);
        setAmountDisplay((1000000).toLocaleString('fa-IR'));
        setFinalAmountDisplay((1000000 * 1.14).toLocaleString('fa-IR'));
      } else {
        setValue('amount', 420000);
        setAmountDisplay((420000).toLocaleString('fa-IR'));
        setFinalAmountDisplay((420000 * 1.14).toLocaleString('fa-IR'));
      }
    } else if (currency === 'USD') {
      if (versionType === 'physical') {
        setValue('paymentMethod', 'crypto');
        setValue('amount', 20);
        setAmountDisplay((20).toLocaleString('fa-IR'));
        setFinalAmountDisplay((20 * 1.07).toLocaleString('fa-IR'));
      } else {
        setValue('paymentMethod', 'crypto');
        setValue('amount', 12);
        setAmountDisplay((12).toLocaleString('fa-IR'));
        setFinalAmountDisplay((12 * 1.07).toLocaleString('fa-IR'));
      }
    }
  }, [currency, versionType, setValue]);

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
      const verifyResponse = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!verifyResponse.ok) {
        throw new Error('خطا در تایید ایمیل');
      }

      setShowVerification(true);
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
      let finalAmount = formData.amount;

      if (formData.currency === 'IRR') {
        finalAmount = Math.round(formData.amount * 1.14); 
      } else if (formData.currency === 'USD') {
        finalAmount = Math.round(formData.amount * 1.07); 
      }

      const paymentResponse = await fetch('/api/payment', {
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
        router.push(`/success?code=${result.orderCode}`);
      } else {
        router.push('/failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در پردازش پرداخت. لطفاً دوباره تلاش کنید.');
      router.push('/failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        dir="rtl"
        className="w-full bg-neutral-900 text-white p-8 px-6 rounded-3xl border border-neutral-700 transition-all duration-300 font-iranyekan"
      >
        <h2 className="mb-8 text-2xl md:text-2xl text-center">فرم خرید آلبوم</h2>
        
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue('versionType', 'digital')}
              className={`w-full py-4 px-6 rounded-xl transition ${
                versionType === 'digital'
                  ? 'bg-[#b62c2c] text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              نسخه دیجیتال
            </button>
            <button
              type="button"
              onClick={() => setValue('versionType', 'physical')}
              className={`w-full py-4 px-6 rounded-xl transition ${
                versionType === 'physical'
                  ? 'bg-[#b62c2c] text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              نسخه فیزیکی
            </button>
          </div>
        </div>

        {!showForm ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2">اسم به انگلیسی (برای نمایش در سایت)</label>
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
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">آیدی اینستاگرام</label>
              <input
                {...register('instagram', {
                  required: 'آیدی اینستاگرام الزامی است',
                  pattern: {
                    value: /^[a-zA-Z0-9._]+$/,
                    message: 'آیدی نباید با @ شروع شود و فقط شامل حروف، عدد، نقطه یا _ باشد',
                  },
                  validate: (value) =>
                    value.startsWith('@') ? 'لطفاً آیدی را بدون @ وارد کنید' : true,
                })}
                placeholder="Your Instagram ID"
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
              />
              {errors.instagram && <p className="mt-1 text-sm text-red-400">{errors.instagram.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">ایمیل</label>
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
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            {versionType === 'physical' && (
              <>
                <div>
                  <label className="block text-sm mb-2">اسم به فارسی</label>
                  <input
                    {...register('persianName', {
                      required: 'وارد کردن نام به فارسی الزامی است',
                      minLength: { value: 2, message: 'نام باید حداقل ۲ کاراکتر باشد' },
                      pattern: {
                        value: /^[\u0600-\u06FF\s]+$/,
                        message: 'فقط حروف فارسی وارد کنید',
                      },
                    })}
                    placeholder="نام شما به فارسی"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                  />
                  {errors.persianName && <p className="mt-1 text-sm text-red-400">{errors.persianName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">شماره تلفن</label>
                  <input
                    {...register('phone', {
                      required: 'شماره تلفن الزامی است',
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: 'شماره تلفن باید ۱۱ رقم باشد',
                      },
                    })}
                    placeholder="09123456789"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">استان</label>
                  <select
                    {...register('province', {
                      required: 'انتخاب استان الزامی است',
                    })}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 font-iranyekan"
                    onChange={(e) => {
                      setValue('province', e.target.value);
                      setValue('city', ''); // Reset city when province changes
                    }}
                  >
                    <option value="">انتخاب استان</option>
                    {(iranCities as IranCities).provinces.map((province: Province) => (
                      <option key={province.id} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {errors.province && <p className="mt-1 text-sm text-red-400">{errors.province.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">شهر</label>
                  <select
                    {...register('city', {
                      required: 'انتخاب شهر الزامی است',
                    })}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 font-iranyekan"
                    disabled={!watch('province')}
                  >
                    <option value="">انتخاب شهر</option>
                    {watch('province') &&
                      (iranCities as IranCities).provinces
                        .find((p: Province) => p.name === watch('province'))
                        ?.cities.map((city: string) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                  </select>
                  {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">آدرس</label>
                  <textarea
                    {...register('address', {
                      required: 'آدرس الزامی است',
                    })}
                    placeholder="آدرس کامل"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">کد پستی</label>
                    <input
                      {...register('postalCode', {
                        required: 'کد پستی الزامی است',
                        pattern: {
                          value: /^[1-9][0-9]{9}$/,
                          message: 'کد پستی باید ۱۰ رقم باشد و با صفر شروع نشود',
                        },
                        validate: {
                          checkFirstDigit: (value) => {
                            const firstDigit = parseInt(value[0]);
                            return (firstDigit >= 1 && firstDigit <= 9) || 'رقم اول کد پستی باید بین ۱ تا ۹ باشد';
                          },
                          checkProvince: (value) => {
                            if (!watch('province')) return true;
                            const provinceCode = parseInt(value.substring(1, 3));
                            const validProvinceCodes = {
                              'آذربایجان شرقی': [51, 52, 53],
                              'آذربایجان غربی': [54, 55, 56],
                              'اردبیل': [57, 58],
                              'اصفهان': [81, 82, 83, 84],
                              'البرز': [31, 32],
                              'ایلام': [69],
                              'بوشهر': [75, 76],
                              'تهران': [13, 14, 15, 16, 17, 18, 19],
                              'چهارمحال و بختیاری': [88],
                              'خراسان جنوبی': [97],
                              'خراسان رضوی': [91, 92, 93, 94],
                              'خراسان شمالی': [96],
                              'خوزستان': [61, 62, 63, 64],
                              'زنجان': [45, 46],
                              'سمنان': [35, 36],
                              'سیستان و بلوچستان': [98, 99],
                              'فارس': [71, 72, 73, 74],
                              'قزوین': [34],
                              'قم': [37],
                              'کردستان': [66, 67],
                              'کرمان': [76, 77],
                              'کرمانشاه': [67, 68],
                              'کهگیلویه و بویراحمد': [79],
                              'گلستان': [49],
                              'گیلان': [41, 42, 43],
                              'لرستان': [68],
                              'مازندران': [47, 48],
                              'مرکزی': [38, 39],
                              'هرمزگان': [79],
                              'همدان': [65],
                              'یزد': [89, 90]
                            };
                            
                            const province = watch('province');
                            const validCodes = validProvinceCodes[province as keyof typeof validProvinceCodes];
                            
                            if (validCodes && !validCodes.includes(provinceCode)) {
                              return 'کد پستی با استان انتخاب شده مطابقت ندارد';
                            }
                            return true;
                          }
                        }
                      })}
                      placeholder="1234567890"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                    />
                    {errors.postalCode && <p className="mt-1 text-sm text-red-400">{errors.postalCode.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm mb-2">پلاک</label>
                    <input
                      {...register('houseNumber', {
                        required: 'پلاک الزامی است',
                      })}
                      placeholder="پلاک"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                    />
                    {errors.houseNumber && <p className="mt-1 text-sm text-red-400">{errors.houseNumber.message}</p>}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm mb-2">واحد پول</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setValue('currency', 'IRR')}
                  className={`w-full py-3 px-6 rounded-xl border transition ${
                    currency === 'IRR'
                      ? 'bg-[#b62c2c] border-[#b62c2c] text-white'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  تومان
                </button>
                <button
                  type="button"
                  onClick={() => setValue('currency', 'USD')}
                  className={`w-full py-3 px-6 rounded-xl border transition ${
                    currency === 'USD'
                      ? 'bg-[#b62c2c] border-[#b62c2c] text-white'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  دلار
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">
                مبلغ ({currency === 'IRR' ? 'تومان' : 'دلار'})
              </label>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: 'مقدار الزامی است',
                  validate: (value) => {
                    if (currency === 'USD') {
                      if (versionType === 'physical') {
                        return value >= 20 || 'حداقل مبلغ برای نسخه فیزیکی ۱۲ دلار است';
                      } else {
                        return value >= 12 || 'حداقل مبلغ ۱۲ دلار است';
                      }
                    } else if (currency === 'IRR') {
                      if (versionType === 'physical') {
                        return value >= 1000000 || 'حداقل مبلغ برای نسخه فیزیکی ۱,۰۰۰,۰۰۰ تومان است';
                      } else {
                        return value >= 420000 || 'حداقل مبلغ ۴۲۰,۰۰۰ تومان است';
                      }
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={amountDisplay}
                      onChange={(e) => {
                        let inputValue = e.target.value;
                        
                        const rawValue = inputValue.replace(/[,،٬]/g, '');
                        const latinValue = persianToLatinDigits(rawValue);
                        
                        if (latinValue === '' || /^\d+$/.test(latinValue)) {
                          if (latinValue === '') {
                            setAmountDisplay('');
                            setFinalAmountDisplay('');
                            field.onChange('');
                          } else {
                            const numericValue = Number(latinValue);
                            field.onChange(numericValue);
                            
                            try {
                              const persianValue = Number(latinValue).toLocaleString('fa-IR');
                              setAmountDisplay(persianValue);
                              updateFinalAmount(numericValue);
                            } catch (error) {
                              const withCommas = latinValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                              const persianWithCommas = latinToPersianDigits(withCommas);
                              setAmountDisplay(persianWithCommas);
                              updateFinalAmount(numericValue);
                            }
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const rawValue = e.target.value.replace(/[,،٬]/g, '');
                        const latinValue = persianToLatinDigits(rawValue);
                        
                        if (latinValue === '') {
                          setAmountDisplay('');
                          setFinalAmountDisplay('');
                          field.onChange('');
                        } else {
                          const numericValue = Number(latinValue);
                          field.onChange(numericValue);
                          
                          try {
                            const persianValue = Number(latinValue).toLocaleString('fa-IR');
                            setAmountDisplay(persianValue);
                            updateFinalAmount(numericValue);
                          } catch (error) {
                            const withCommas = latinValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            const persianWithCommas = latinToPersianDigits(withCommas);
                            setAmountDisplay(persianWithCommas);
                            updateFinalAmount(numericValue);
                          }
                        }
                      }}
                      placeholder={versionType === 'physical' ? 'حداقل ۱,۰۰۰,۰۰۰ تومان' : 'حداقل ۴۲۰,۰۰۰ تومان'}
                      className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                    />
                    <div className="mt-2 text-sm text-neutral-400">
                      مبلغ نهایی با احتساب مالیات: {finalAmountDisplay} {currency === 'IRR' ? 'تومان' : 'دلار'}
                    </div>
                  </>
                )}
              />
              {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>}
            </div>

            {currency === 'USD' && (
              <div>
                <label className="block text-sm mb-2">روش پرداخت</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setValue('paymentMethod', 'crypto')}
                      className={`w-full h-[80px] bg-white p-3 rounded-xl transition flex items-center justify-center ${
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
                    <span className="mt-2 text-sm text-white">Crypto</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setValue('paymentMethod', 'paypal')}
                      className={`w-full h-[80px] bg-white p-3 rounded-xl transition flex items-center justify-center ${
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
                    <span className="mt-2 text-sm text-white">PayPal</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl bg-[#b62c2c] hover:bg-red-600 text-white font-bold transition duration-200 font-iranyekan text-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال پردازش...
                </>
              ) : (
                ' پرداخت'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2">اسم به انگلیسی</label>
              <input
                {...register('name', {
                  required: 'وارد کردن نام الزامی است',
                  minLength: { value: 2, message: 'نام باید حداقل ۲ کاراکتر باشد' },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'فقط حروف انگلیسی وارد کنید',
                  },
                })}
                placeholder="Your Name or Nickname"
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">آیدی اینستاگرام</label>
              <input
                {...register('instagram', {
                  required: 'آیدی اینستاگرام الزامی است',
                  pattern: {
                    value: /^[a-zA-Z0-9._]+$/,
                    message: 'آیدی نباید با @ شروع شود و فقط شامل حروف، عدد، نقطه یا _ باشد',
                  },
                  validate: (value) =>
                    value.startsWith('@') ? 'لطفاً آیدی را بدون @ وارد کنید' : true,
                })}
                placeholder="Your Instagram ID"
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
              />
              {errors.instagram && <p className="mt-1 text-sm text-red-400">{errors.instagram.message}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">ایمیل</label>
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
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            {versionType === 'physical' && (
              <>
                <div>
                  <label className="block text-sm mb-2">اسم به فارسی</label>
                  <input
                    {...register('persianName', {
                      required: 'وارد کردن نام به فارسی الزامی است',
                      minLength: { value: 2, message: 'نام باید حداقل ۲ کاراکتر باشد' },
                      pattern: {
                        value: /^[\u0600-\u06FF\s]+$/,
                        message: 'فقط حروف فارسی وارد کنید',
                      },
                    })}
                    placeholder="نام شما به فارسی"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                  />
                  {errors.persianName && <p className="mt-1 text-sm text-red-400">{errors.persianName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">شماره تلفن</label>
                  <input
                    {...register('phone', {
                      required: 'شماره تلفن الزامی است',
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: 'شماره تلفن باید ۱۱ رقم باشد',
                      },
                    })}
                    placeholder="09123456789"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">استان</label>
                  <select
                    {...register('province', {
                      required: 'انتخاب استان الزامی است',
                    })}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 font-iranyekan"
                    onChange={(e) => {
                      setValue('province', e.target.value);
                      setValue('city', ''); // Reset city when province changes
                    }}
                  >
                    <option value="">انتخاب استان</option>
                    {(iranCities as IranCities).provinces.map((province: Province) => (
                      <option key={province.id} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {errors.province && <p className="mt-1 text-sm text-red-400">{errors.province.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">شهر</label>
                  <select
                    {...register('city', {
                      required: 'انتخاب شهر الزامی است',
                    })}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 font-iranyekan"
                    disabled={!watch('province')}
                  >
                    <option value="">انتخاب شهر</option>
                    {watch('province') &&
                      (iranCities as IranCities).provinces
                        .find((p: Province) => p.name === watch('province'))
                        ?.cities.map((city: string) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                  </select>
                  {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-sm mb-2">آدرس</label>
                  <textarea
                    {...register('address', {
                      required: 'آدرس الزامی است',
                    })}
                    placeholder="آدرس کامل"
                    className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">کد پستی</label>
                    <input
                      {...register('postalCode', {
                        required: 'کد پستی الزامی است',
                        pattern: {
                          value: /^[1-9][0-9]{9}$/,
                          message: 'کد پستی باید ۱۰ رقم باشد و با صفر شروع نشود',
                        },
                        validate: {
                          checkFirstDigit: (value) => {
                            const firstDigit = parseInt(value[0]);
                            return (firstDigit >= 1 && firstDigit <= 9) || 'رقم اول کد پستی باید بین ۱ تا ۹ باشد';
                          },
                          checkProvince: (value) => {
                            if (!watch('province')) return true;
                            const provinceCode = parseInt(value.substring(1, 3));
                            const validProvinceCodes = {
                              'آذربایجان شرقی': [51, 52, 53],
                              'آذربایجان غربی': [54, 55, 56],
                              'اردبیل': [57, 58],
                              'اصفهان': [81, 82, 83, 84],
                              'البرز': [31, 32],
                              'ایلام': [69],
                              'بوشهر': [75, 76],
                              'تهران': [13, 14, 15, 16, 17, 18, 19],
                              'چهارمحال و بختیاری': [88],
                              'خراسان جنوبی': [97],
                              'خراسان رضوی': [91, 92, 93, 94],
                              'خراسان شمالی': [96],
                              'خوزستان': [61, 62, 63, 64],
                              'زنجان': [45, 46],
                              'سمنان': [35, 36],
                              'سیستان و بلوچستان': [98, 99],
                              'فارس': [71, 72, 73, 74],
                              'قزوین': [34],
                              'قم': [37],
                              'کردستان': [66, 67],
                              'کرمان': [76, 77],
                              'کرمانشاه': [67, 68],
                              'کهگیلویه و بویراحمد': [79],
                              'گلستان': [49],
                              'گیلان': [41, 42, 43],
                              'لرستان': [68],
                              'مازندران': [47, 48],
                              'مرکزی': [38, 39],
                              'هرمزگان': [79],
                              'همدان': [65],
                              'یزد': [89, 90]
                            };
                            
                            const province = watch('province');
                            const validCodes = validProvinceCodes[province as keyof typeof validProvinceCodes];
                            
                            if (validCodes && !validCodes.includes(provinceCode)) {
                              return 'کد پستی با استان انتخاب شده مطابقت ندارد';
                            }
                            return true;
                          }
                        }
                      })}
                      placeholder="1234567890"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                    />
                    {errors.postalCode && <p className="mt-1 text-sm text-red-400">{errors.postalCode.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm mb-2">پلاک</label>
                    <input
                      {...register('houseNumber', {
                        required: 'پلاک الزامی است',
                      })}
                      placeholder="پلاک"
                      className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                    />
                    {errors.houseNumber && <p className="mt-1 text-sm text-red-400">{errors.houseNumber.message}</p>}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm mb-2">واحد پول</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setValue('currency', 'IRR')}
                  className={`w-full py-3 px-6 rounded-xl border transition ${
                    currency === 'IRR'
                      ? 'bg-[#b62c2c] border-[#b62c2c] text-white'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  تومان
                </button>
                <button
                  type="button"
                  onClick={() => setValue('currency', 'USD')}
                  className={`w-full py-3 px-6 rounded-xl border transition ${
                    currency === 'USD'
                      ? 'bg-[#b62c2c] border-[#b62c2c] text-white'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  دلار
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">
                مبلغ ({currency === 'IRR' ? 'تومان' : 'دلار'})
              </label>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: 'مقدار الزامی است',
                  validate: (value) => {
                    if (currency === 'USD') {
                      return value >= 12 || 'حداقل مبلغ ۱۲ دلار است';
                    } else if (currency === 'IRR') {
                      if (versionType === 'physical') {
                        return value >= 1000000 || 'حداقل مبلغ برای نسخه فیزیکی ۱,۰۰۰,۰۰۰ تومان است';
                      } else {
                        return value >= 420000 || 'حداقل مبلغ ۴۲۰,۰۰۰ تومان است';
                      }
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={amountDisplay}
                      onChange={(e) => {
                        let inputValue = e.target.value;
                        
                        const rawValue = inputValue.replace(/[,،٬]/g, '');
                        const latinValue = persianToLatinDigits(rawValue);
                        
                        if (latinValue === '' || /^\d+$/.test(latinValue)) {
                          if (latinValue === '') {
                            setAmountDisplay('');
                            setFinalAmountDisplay('');
                            field.onChange('');
                          } else {
                            const numericValue = Number(latinValue);
                            field.onChange(numericValue);
                            
                            try {
                              const persianValue = Number(latinValue).toLocaleString('fa-IR');
                              setAmountDisplay(persianValue);
                              updateFinalAmount(numericValue);
                            } catch (error) {
                              const withCommas = latinValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                              const persianWithCommas = latinToPersianDigits(withCommas);
                              setAmountDisplay(persianWithCommas);
                              updateFinalAmount(numericValue);
                            }
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const rawValue = e.target.value.replace(/[,،٬]/g, '');
                        const latinValue = persianToLatinDigits(rawValue);
                        
                        if (latinValue === '') {
                          setAmountDisplay('');
                          setFinalAmountDisplay('');
                          field.onChange('');
                        } else {
                          const numericValue = Number(latinValue);
                          field.onChange(numericValue);
                          
                          try {
                            const persianValue = Number(latinValue).toLocaleString('fa-IR');
                            setAmountDisplay(persianValue);
                            updateFinalAmount(numericValue);
                          } catch (error) {
                            const withCommas = latinValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            const persianWithCommas = latinToPersianDigits(withCommas);
                            setAmountDisplay(persianWithCommas);
                            updateFinalAmount(numericValue);
                          }
                        }
                      }}
                      placeholder={versionType === 'physical' ? 'حداقل ۱,۰۰۰,۰۰۰ تومان' : 'حداقل ۴۲۰,۰۰۰ تومان'}
                      className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:ring-2 focus:ring-green-500 placeholder-neutral-400 font-iranyekan"
                    />
                    <div className="mt-2 text-sm text-neutral-400">
                      مبلغ نهایی با احتساب مالیات: {finalAmountDisplay} {currency === 'IRR' ? 'تومان' : 'دلار'}
                    </div>
                  </>
                )}
              />
              {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>}
            </div>

            {currency === 'USD' && (
              <div>
                <label className="block text-sm mb-2">روش پرداخت</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setValue('paymentMethod', 'crypto')}
                      className={`w-full h-[80px] bg-white p-3 rounded-xl transition flex items-center justify-center ${
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
                    <span className="mt-2 text-sm text-white">Crypto</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setValue('paymentMethod', 'paypal')}
                      className={`w-full h-[80px] bg-white p-3 rounded-xl transition flex items-center justify-center ${
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
                    <span className="mt-2 text-sm text-white">PayPal</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl bg-[#b62c2c] hover:bg-red-600 text-white font-bold transition duration-200 font-iranyekan text-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال پردازش...
                </>
              ) : (
                ' پرداخت'
              )}
            </button>
          </div>
        )}
      </form>

      {showVerification && (
        <EmailVerificationPopup
          onClose={() => setShowVerification(false)}
          onVerify={handleVerify}
          onResendCode={async () => {
            try {
              await fetch('/api/verify-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: watch('email') }),
              });
            } catch (error) {
              console.error('Error resending code:', error);
            }
          }}
          email={watch('email')}
        />
      )}
    </>
  );
};

export default PurchaseForm;