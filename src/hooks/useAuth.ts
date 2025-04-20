import { useState } from 'react';
import { SendOTPRequest, VerifyOTPRequest, AuthResponse } from '@/types/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOTP = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Sending OTP request to frontend API');
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Frontend API response status:', response.status);
      const data = await response.json();

      if (!response.ok) {
        console.error('Frontend API error:', data);
        throw new Error(data.error || 'Failed to send OTP');
      }

      console.log('OTP sent successfully');
      return data;
    } catch (err) {
      console.error('Error in sendOTP:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (data: VerifyOTPRequest) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Verifying OTP request to frontend API');
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Frontend API response status:', response.status);
      const result: AuthResponse = await response.json();

      if (!response.ok) {
        console.error('Frontend API error:', result);
        throw new Error(result.error || 'Failed to verify OTP');
      }

      console.log('OTP verified successfully');
      return result;
    } catch (err) {
      console.error('Error in verifyOTP:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOTP,
    verifyOTP,
    loading,
    error,
  };
}; 