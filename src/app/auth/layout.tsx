import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | OpsPulse',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F8FB] relative overflow-hidden">
      {/* Background gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(37,99,235,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(99,102,241,0.05) 0%, transparent 50%)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 w-full max-w-[480px] mx-4">
        {/* Logo Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              background: 'linear-gradient(120deg, #2563EB 0%, #3B82F6 100%)',
              boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <h1
              className="text-[20px] font-bold text-[#0F172A] leading-tight tracking-tight"
              style={{ fontFamily: "'Inter', 'Helvetica', sans-serif" }}
            >
              OpsPulse
            </h1>
            <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-wider">
              Business Health
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div
          className="bg-white rounded-2xl p-8 border border-[#E2E8F0]"
          style={{
            boxShadow:
              '0 10px 25px rgba(0,0,0,0.05), 0 4px 10px rgba(0,0,0,0.03)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-[#94A3B8] mt-6">
          &copy; {new Date().getFullYear()} OpsPulse. All rights reserved.
        </p>
      </div>
    </div>
  );
}
