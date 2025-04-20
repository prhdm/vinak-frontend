import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
      <p className="text-lg text-muted-foreground">در حال بررسی مشکل...</p>
      <p className="text-sm text-muted-foreground">
        لطفاً صبر کنید، این فرآیند ممکن است چند لحظه طول بکشد...
      </p>
    </div>
  );
} 