import crypto from "crypto";

export function generateOTP(digits: number = 6): string {
  // Cryptographically secure 6-digit OTP
  const max = Math.pow(10, digits);
  const min = Math.pow(10, digits - 1);
  const randomBytes = crypto.randomBytes(4);
  const num = randomBytes.readUInt32BE(0) % (max - min) + min;
  return String(num);
}

export function otpExpiryDate(minutes: number = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
