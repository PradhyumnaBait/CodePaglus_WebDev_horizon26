'use client';

import { usePathname } from 'next/navigation';

function AuthContentWrapper({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  // inventory-setup is a wide page; everything else remains confined to 480px
  const wide = pathname?.includes('/inventory-setup');
  return (
    <div
      className="relative z-10 w-full"
      style={{ maxWidth: wide ? 'none' : 480 }}
    >
      {children}
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#F6F8FB', padding: 'clamp(20px,4vw,40px) 16px' }}
    >
      {/* Background gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(37,99,235,0.07) 0%, transparent 52%), radial-gradient(circle at 70% 80%, rgba(99,102,241,0.06) 0%, transparent 52%)',
        }}
      />

      {/* Subtle dot-grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
        }}
      />

      {/* Floating accent blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
          top: '-80px',
          right: '-60px',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
          bottom: '-60px',
          left: '-40px',
          filter: 'blur(36px)',
        }}
      />

      <AuthContentWrapper>
        {/* Logo Header */}
        <div className="flex items-center justify-center gap-3" style={{ marginBottom: 28 }}>
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 60%, #60A5FA 100%)',
              boxShadow: '0 6px 20px rgba(37,99,235,0.35)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <h1
              className="text-[21px] font-bold text-[#0F172A] leading-tight"
              style={{ letterSpacing: '-0.035em', fontFamily: "'Inter', sans-serif" }}
            >
              OpsPulse
            </h1>
            <p className="text-[10.5px] text-[#64748B] font-semibold uppercase tracking-[0.1em]">
              Business Health
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div
          className="bg-white rounded-2xl border border-[#E2E8F0]"
          style={{
            padding: 'clamp(24px, 5vw, 36px)',
            boxShadow:
              '0 2px 4px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06), 0 20px 48px rgba(15,23,42,0.04)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-[#94A3B8]" style={{ marginTop: 20 }}>
          &copy; {new Date().getFullYear()} OpsPulse. All rights reserved.
        </p>
      </AuthContentWrapper>
    </div>
  );
}
