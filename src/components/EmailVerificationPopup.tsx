"use client";
import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, RefreshCw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmailVerificationPopupProps {
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  email: string;
}

const EmailVerificationPopup: React.FC<EmailVerificationPopupProps> = ({ 
  onClose, 
  onVerify, 
  onResendCode,
  email 
}) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    // تبدیل اعداد فارسی به انگلیسی
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let numericValue = value;
    
    // تبدیل اعداد فارسی به انگلیسی
    persianNumbers.forEach((persianNum, i) => {
      numericValue = numericValue.replace(new RegExp(persianNum, 'g'), englishNumbers[i]);
    });
    
    // حذف کاراکترهای غیر عددی
    numericValue = numericValue.replace(/\D/g, '');
    
    if (numericValue) {
      const newCode = [...code];
      // اگر مقدار قبلاً وارد شده بود، آن را جایگزین کنیم
      const hasChanged = newCode[index] !== numericValue;
      newCode[index] = numericValue;
      setCode(newCode);
      setError(null);

      // حرکت به فیلد بعدی
      if (index < 5) {
        requestAnimationFrame(() => {
          inputRefs.current[index + 1]?.focus();
        });
      } else {
        const fullCode = [...newCode].join('');
        if (fullCode.length === 6) {
          handleSubmit(fullCode);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 6) {
      setCode(pastedData.split(''));
      inputRefs.current[5]?.focus();
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      setError('لطفاً کد ۶ رقمی را کامل وارد کنید');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await onVerify(codeToVerify);
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError('خطا در تایید کد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setIsResending(true);
    try {
      await onResendCode();
      setResendTimer(120);
      setError(null);
    } catch (err) {
      setError('خطا در ارسال مجدد کد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl p-6 w-full max-w-sm relative border border-neutral-700 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-neutral-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2 text-white font-iranyekan">تایید ایمیل</h3>
          <p className="text-neutral-300 text-sm font-iranyekan">
            کد تایید به آدرس ایمیل <span className="text-white font-bold">{email}</span> ارسال شد.
            <br />
            لطفاً کد دریافتی را وارد کنید.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="flex justify-center gap-3" dir="ltr">
            {code.map((digit, index) => (
              <motion.div
                key={index}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <input
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-2xl bg-neutral-800/50 border-2 border-neutral-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all font-iranyekan text-white group-hover:border-neutral-600"
                  disabled={isLoading || success}
                  dir="ltr"
                  style={{ textAlign: 'center', direction: 'ltr' }}
                  lang="fa"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
                {index < 5 && (
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-neutral-700" />
                )}
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-sm text-center font-iranyekan"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isLoading || success || code.some(digit => !digit)}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#b62c2c] to-red-600 hover:from-red-600 hover:to-[#b62c2c] text-white font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-iranyekan shadow-lg hover:shadow-red-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال تایید...
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4" />
                  تایید شد
                </>
              ) : (
                'تایید کد'
              )}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || resendTimer > 0}
              className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center justify-center gap-2 font-iranyekan"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال ارسال...
                </>
              ) : resendTimer > 0 ? (
                `ارسال مجدد کد (${formatTime(resendTimer)})`
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  ارسال مجدد کد
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EmailVerificationPopup;