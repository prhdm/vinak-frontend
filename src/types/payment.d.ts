/* eslint-disable no-var */
declare global {
  var verificationCodes: {
    [email: string]: string;
  };
}

export interface PaymentData {
  name: string;
  email: string;
  instagram: string;
  amount: number;
  currency: 'USD' | 'IRR';
  paymentMethod: string;
  code: string;
}

export {}; 