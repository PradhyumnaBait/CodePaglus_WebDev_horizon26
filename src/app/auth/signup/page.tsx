'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  Briefcase,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

const BUSINESS_TYPES = [
  'Retail',
  'E-commerce',
  'Restaurant',
  'Healthcare',
  'Manufacturing',
  'Technology',
  'Other',
];

interface FormState {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  businessType: string;
}

const INITIAL: FormState = {
  fullName: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  businessName: '',
  businessType: '',
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.mobile.trim()) errs.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) errs.mobile = 'Enter a valid 10-digit number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Minimum 8 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.businessName.trim()) errs.businessName = 'Business name is required';
    if (!form.businessType) errs.businessType = 'Select a business type';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push('/auth/verify-otp');
  };

  const inputClass = (key: keyof FormState) =>
    `w-full pl-10 pr-4 py-2.5 rounded-xl border text-[14px] text-[#0F172A] placeholder:text-[#CBD5E1] outline-none transition-all duration-150 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${
      errors[key] ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-6">
        <h2
          className="text-[24px] font-bold text-[#0F172A] mb-1"
          style={{ fontFamily: "'Inter', 'Helvetica', sans-serif" }}
        >
          Create your account
        </h2>
        <p className="text-[14px] text-[#64748B]">
          Start monitoring your business health in minutes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="signup-fullname"
              type="text"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              placeholder="John Doe"
              className={inputClass('fullName')}
              autoComplete="name"
            />
          </div>
          {errors.fullName && <p className="text-[12px] text-[#EF4444] mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="signup-email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@company.com"
              className={inputClass('email')}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-[12px] text-[#EF4444] mt-1">{errors.email}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
            Mobile Number
          </label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="signup-mobile"
              type="tel"
              value={form.mobile}
              onChange={(e) => update('mobile', e.target.value)}
              placeholder="9876543210"
              className={inputClass('mobile')}
              autoComplete="tel"
            />
          </div>
          {errors.mobile && <p className="text-[12px] text-[#EF4444] mt-1">{errors.mobile}</p>}
        </div>

        {/* Password row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Min 8 chars"
                className={inputClass('password')}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.password && <p className="text-[12px] text-[#EF4444] mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
              Confirm
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="Re-enter"
                className={inputClass('confirmPassword')}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && <p className="text-[12px] text-[#EF4444] mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
            Business Name
          </label>
          <div className="relative">
            <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="signup-business-name"
              type="text"
              value={form.businessName}
              onChange={(e) => update('businessName', e.target.value)}
              placeholder="Acme Inc."
              className={inputClass('businessName')}
            />
          </div>
          {errors.businessName && <p className="text-[12px] text-[#EF4444] mt-1">{errors.businessName}</p>}
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
            Business Type
          </label>
          <div className="relative">
            <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <select
              id="signup-business-type"
              value={form.businessType}
              onChange={(e) => update('businessType', e.target.value)}
              className={`${inputClass('businessType')} appearance-none cursor-pointer`}
            >
              <option value="">Select type</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {errors.businessType && <p className="text-[12px] text-[#EF4444] mt-1">{errors.businessType}</p>}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[14px] font-semibold transition-all duration-200 disabled:opacity-60 mt-2"
          style={{
            background: 'linear-gradient(120deg, #2563EB 0%, #3B82F6 100%)',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
          }}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-[13px] text-[#64748B] mt-6">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
