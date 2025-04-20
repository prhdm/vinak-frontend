import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "در حال بررسی مشکل..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
      <p className="text-lg text-muted-foreground">{message}</p>
      <p className="text-sm text-muted-foreground">
        لطفاً صبر کنید، این فرآیند ممکن است چند لحظه طول بکشد...
      </p>
    </div>
  );
};

export default LoadingState; 