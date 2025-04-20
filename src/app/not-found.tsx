import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-white animate-bounce font-iranyekan">404</h1>
        <h2 className="text-2xl font-semibold text-white font-iranyekan">صفحه مورد نظر یافت نشد</h2>
        <p className="text-white/80 max-w-md font-iranyekan">
          متأسفانه صفحه ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
        </p>
        <div className="pt-4">
          <Button asChild variant="default" className="h-12 px-8 text-lg rounded-full">
            <Link href="/" className="font-iranyekan">
              بازگشت به صفحه اصلی
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 