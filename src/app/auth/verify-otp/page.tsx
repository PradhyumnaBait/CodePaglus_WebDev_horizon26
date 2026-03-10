'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only allow digits
      const digit = value.replace(/\D/g, '').slice(-1);
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);
      setError('');

      // Auto-focus next
      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace') {
        if (!otp[index] && index > 0) {
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length > 0) {
      const newOtp = Array(OTP_LENGTH).fill('');
      pasted.split('').forEach((ch, i) => {
        newOtp[i] = ch;
      });
      setOtp(newOtp);
      const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
    }
  }, []);

  const handleResend = () => {
    setResendTimer(RESEND_COOLDOWN);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    inputRefs.current[0]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete OTP');
      return;
    }
    setLoading(true);
    // Simulate verification
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setVerified(true);
    // Redirect after animation
    setTimeout(() => router.push('/dashboard'), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <AnimatePresence mode="wait">
        {verified ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-[#22C55E]/10 mb-4"
            >
              <ShieldCheck size={32} className="text-[#22C55E]" />
            </motion.div>
            <h3 className="text-[20px] font-bold text-[#0F172A] mb-1">
              Verification Successful
            </h3>
            <p className="text-[14px] text-[#64748B]">
              Redirecting to your dashboard...
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0 }}>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#2563EB]/10 mx-auto mb-4">
                <ShieldCheck size={24} className="text-[#2563EB]" />
              </div>
              <h2
                className="text-[24px] font-bold text-[#0F172A] mb-1"
                style={{ fontFamily: "'Inter', 'Helvetica', sans-serif" }}
              >
                OTP Verification
              </h2>
              <p className="text-[14px] text-[#64748B]">
                Enter the 6-digit code sent to your mobile number
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <motion.input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-12 h-14 text-center text-[22px] font-bold rounded-xl border-2 outline-none transition-all duration-150 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[#0F172A] ${
                    error ? 'border-[#EF4444]' : otp[i] ? 'border-[#2563EB]' : 'border-[#E2E8F0]'
                  }`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <p className="text-[13px] text-[#EF4444] text-center mb-4">{error}</p>
            )}

            {/* Verify Button */}
            <motion.button
              onClick={handleVerify}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[14px] font-semibold transition-all duration-200 disabled:opacity-60"
              style={{
                background: 'linear-gradient(120deg, #2563EB 0%, #3B82F6 100%)',
                boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
              }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify OTP
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>

            {/* Resend */}
            <div className="text-center mt-5">
              {resendTimer > 0 ? (
                <p className="text-[13px] text-[#94A3B8]">
                  Resend OTP in{' '}
                  <span className="font-semibold text-[#0F172A]">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="flex items-center gap-1.5 mx-auto text-[13px] text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors"
                >
                  <RotateCcw size={14} />
                  Resend OTP
                </button>
              )}
            </div>

            {/* Back to login */}
            <p className="text-center text-[13px] text-[#64748B] mt-6">
              <Link
                href="/auth/login"
                className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors"
              >
                Back to sign in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
