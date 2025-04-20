import { useState } from 'react';

interface CreatePaymentParams {
  amount: number;
  currency: 'USD' | 'IRR';
  gateway: 'zarinpal' | 'nowpayments';
}

interface PaymentResponse {
  payment_url?: string;
  payment_id: string;
  gateway: string;
  pay_address?: string;
  payment_status?: string;
  price_amount?: number;
  price_currency?: string;
  pay_amount?: number;
  pay_currency?: string;
  order_id?: string;
  order_description?: string;
  created_at?: string;
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (params: CreatePaymentParams): Promise<PaymentResponse> => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = localStorage.getItem('apiKey');
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    loading,
    error,
  };
}; 