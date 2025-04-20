import { Info, Mail, Trophy, CreditCard, Coins, Globe, HelpCircle } from 'lucide-react';

export default function PurchaseNotes() {
  return (
    <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-700">
      <div className="flex flex-col items-center justify-center gap-2 mb-6">
        <Info className="w-8 h-8 text-red-500 stroke-[2.5]" />
        <h2 className="text-xl text-white font-iranyekan text-center w-full">توضیحات و نکات مهم</h2>
      </div>

      <div className="space-y-8 w-full">
        {/* بخش ارسال آلبوم */}
        <div className="w-full">
          <h3 className="text-lg text-white mb-3 font-iranyekan flex items-center gap-2 w-full">
            <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-right w-full">ارسال آلبوم قبل از پخش عمومی</span>
          </h3>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 font-iranyekan w-full">
            <li className="w-full">نسخه دیجیتال آلبوم قبل از پخش عمومی از طریق ایمیل برای خریداران ارسال خواهد شد.</li>
          </ul>
        </div>

        <div className="h-px bg-neutral-700 w-full" />

        {/* بخش لیست خریداران برتر */}
        <div className="w-full">
          <h3 className="text-lg text-white mb-3 font-iranyekan flex items-center gap-2 w-full">
            <Trophy className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-right w-full">لیست ۱۰ خریدار برتر</span>
          </h3>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 font-iranyekan w-full">
            <li className="w-full">لیست ۱۰ نفر اول بر اساس مبلغ پرداختی به‌صورت زنده نمایش داده می‌شود.</li>
            <li className="w-full">شما می‌توانید چند بار خرید کنید و مجموع مبلغ پرداختی شما به‌روزرسانی خواهد شد.</li>
            <li className="w-full">فقط توجه داشته باشید: در هر خرید جدید، اطلاعات قبلی (نام، ایمیل و آیدی اینستاگرام) باید دوباره وارد شود تا خرید شما به درستی در لیست ثبت شود.</li>
          </ul>
        </div>

        <div className="h-px bg-neutral-700 w-full" />

        {/* بخش پرداخت تومانی */}
        <div className="w-full">
          <h3 className="text-lg text-white mb-3 font-iranyekan flex items-center gap-2 w-full">
            <CreditCard className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-right w-full">پرداخت تومانی</span>
          </h3>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 font-iranyekan w-full">
            <li className="w-full">برای پرداخت تومانی، لطفاً VPN خود را خاموش کنید.</li>
          </ul>
        </div>

        <div className="h-px bg-neutral-700 w-full" />

        {/* بخش پرداخت با ارز دیجیتال */}
        <div className="w-full">
          <h3 className="text-lg text-white mb-3 font-iranyekan flex items-center gap-2 w-full">
            <Coins className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-right w-full">پرداخت با ارز دیجیتال (Crypto Payment)</span>
          </h3>
          <p className="text-neutral-300 mb-4 font-iranyekan text-right w-full">
            ما این امکان رو فراهم کردیم که بتونید هزینه خرید آلبوم رو به‌صورت ارز دیجیتال پرداخت کنید؛ سریع، امن، بدون نیاز به کارت بانکی یا حساب ایرانی.
          </p>

          <h4 className="text-md text-white mb-3 font-iranyekan text-right w-full">
            مزایای پرداخت با کریپتو:
          </h4>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 font-iranyekan w-full">
            <li className="w-full">پشتیبانی از بیش از 100 نوع ارز دیجیتال (مثل: بیت‌کوین، تتر، اتریوم، ترون و…)</li>
            <li className="w-full">پرداخت از هر کشوری ممکنه؛ نیازی به کارت یا حساب بانکی ایرانی ندارید.</li>
            <li className="w-full">فرایند پرداخت ساده و اتوماتیکه، نیازی به ارسال رسید نیست.</li>
            <li className="w-full">بعد از تایید تراکنش روی بلاک‌چین، خرید شما بلافاصله ثبت می‌شود.</li>
          </ul>

          <h4 className="text-md text-white mt-4 mb-3 font-iranyekan text-right w-full">
            نحوه پرداخت با ارز دیجیتال:
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-neutral-300 font-iranyekan w-full">
            <li className="w-full">در فرم خرید، گزینه پرداخت با ارز دیجیتال رو انتخاب کنید.</li>
            <li className="w-full">مبلغ نهایی به‌صورت اتوماتیک به ارز انتخابی شما تبدیل می‌شه.</li>
            <li className="w-full">آدرس کیف پول و QR Code نمایش داده می‌شه.</li>
            <li className="w-full">از طریق کیف پول خود، مبلغ رو به آدرس نمایش‌داده‌شده منتقل کنید.</li>
            <li className="w-full">منتظر بمونید تا تراکنش شما توسط شبکه تایید بشه (معمولاً کمتر از چند دقیقه).</li>
            <li className="w-full">پس از تایید، خرید شما به‌صورت خودکار ثبت می‌شه و اطلاعات شما در سایت ذخیره می‌شود.</li>
          </ol>

          <h4 className="text-md text-white mt-4 mb-3 font-iranyekan text-right w-full">
            نکات مهم:
          </h4>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 font-iranyekan w-full">
            <li className="w-full">لطفاً دقیقاً همون مبلغ مشخص‌شده رو پرداخت کنید؛ کمتر یا بیشتر پرداخت کردن باعث خطا در سیستم می‌شه.</li>
            <li className="w-full">هنگام پرداخت، کارمزد شبکه (Gas Fee) به عهده فرستنده است.</li>
            <li className="w-full">آدرس پرداخت فقط برای یک خرید معتبره. لطفاً برای هر سفارش جدید، دوباره فرم را پر کرده و آدرس جدید دریافت کنید.</li>
          </ul>
        </div>

        <div className="h-px bg-neutral-700 w-full" />

        {/* بخش خریداران خارج از ایران */}
        <div className="w-full">
          <h3 className="text-lg text-white mb-3 font-iranyekan flex items-center gap-2 w-full">
            <Globe className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-right w-full">خریداران خارج از ایران</span>
          </h3>
          <ul className="list-disc list-inside space-y-2 text-neutral-300 font-iranyekan w-full">
            <li className="w-full">در صورتی که قصد خرید نسخه فیزیکی آلبوم را دارید و در خارج از ایران هستید:</li>
            <li className="w-full">داشتن یک آدرس معتبر در ایران برای دریافت نسخه فیزیکی الزامیست.</li>
          </ul>
        </div>

        <div className="h-px bg-neutral-700 w-full" />

        {/* بخش سوالات و پشتیبانی */}
        <div className="w-full">
          <h3 className="text-lg text-white mb-3 font-iranyekan flex items-center gap-2 w-full">
            <HelpCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-right w-full">سوالات و پشتیبانی</span>
          </h3>
          <div className="flex flex-col items-center gap-4 w-full">
            <a 
              href="mailto:gheddis.album@gmail.com" 
              className="w-full text-center text-white text-md bg-[#8B0000] px-6 py-4 rounded-xl border-2 border-[#8B0000] font-iranyekan"
            >
              gheddis.album@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 