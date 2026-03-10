'use client';

// ============================================================
// OpsPulse — Login Page
// CHANGE 2: Login goes DIRECTLY to dashboard — no role selection here.
// The system reads the stored role after login to personalise the view.
// CHANGE 1: Improved spacing, interactive states, and focus styles.
// ============================================================
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password.trim()) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Minimum 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // CHANGE 2: Simulate auth — in production, call your API which returns user role.
    // The role is already stored in sessionStorage from the signup step.
    // Login does NOT ask for role again — it simply authenticates and routes.
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    // CHANGE 2: Route directly to dashboard — no role selection screen during login.
    // The dashboard reads getUserRole() from sessionStorage to adapt the UI.
    router.push('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* CHANGE 1: Consistent margin-bottom spacing */}
      <div className="mb-7">
        <h2
          className="text-[24px] font-bold text-[#0F172A] mb-1.5"
          style={{ fontFamily: "'Inter', 'Helvetica', sans-serif" }}
        >
          Welcome back
        </h2>
        <p className="text-[14px] text-[#64748B]">
          Sign in to your OpsPulse dashboard
        </p>
      </div>

      {/* CHANGE 1: space-y-5 ensures consistent spacing between form fields */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              placeholder="you@company.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-[14px] text-[#0F172A] placeholder:text-[#CBD5E1] outline-none transition-all duration-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${errors.email ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
                }`}
              autoComplete="email"
            />
          </div>
          {/* CHANGE 1: Proper spacing for error messages */}
          {errors.email && (
            <p className="text-[12px] text-[#EF4444] mt-1.5 flex items-center gap-1">
              <span>⚠</span> {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[13px] font-medium text-[#0F172A] mb-2">
            Password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-[14px] text-[#0F172A] placeholder:text-[#CBD5E1] outline-none transition-all duration-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${errors.password ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
                }`}
              autoComplete="current-password"
            />
            {/* CHANGE 1: Eye toggle button with proper hover state */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155] transition-colors duration-150 focus:outline-none focus:text-[#334155]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[12px] text-[#EF4444] mt-1.5 flex items-center gap-1">
              <span>⚠</span> {errors.password}
            </p>
          )}
        </div>

        {/* Forgot password link — CHANGE 1: proper spacing */}
        <div className="flex justify-end -mt-1">
          <button type="button" className="text-[13px] text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors duration-150 focus:outline-none focus:underline">
            Forgot password?
          </button>
        </div>

        {/* Submit — CHANGE 1: enhanced hover/active states */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[14px] font-semibold transition-all duration-200 disabled:opacity-60"
          style={{
            background: 'linear-gradient(120deg, #2563EB 0%, #3B82F6 100%)',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            marginTop: '4px',
          }}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      {/* Divider — CHANGE 1: consistent vertical margin */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#E2E8F0]" />
        <span className="text-[12px] text-[#94A3B8]">or</span>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>

      {/* OTP Login option — CHANGE 1: hover + transition improvements */}
      <Link href="/auth/verify-otp">
        <button className="w-full py-2.5 rounded-xl border border-[#E2E8F0] text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]">
          Sign in with Mobile OTP
        </button>
      </Link>

      {/* Sign up link — CHANGE 1: consistent top margin */}
      <p className="text-center text-[13px] text-[#64748B] mt-6">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/signup"
          className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors duration-150 hover:underline"
        >
          Create account
        </Link>
      </p>
    </motion.div>
  );
}
