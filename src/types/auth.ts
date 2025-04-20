export interface SendOTPRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  instagram_id: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  api_key?: string;
  error?: string;
} 