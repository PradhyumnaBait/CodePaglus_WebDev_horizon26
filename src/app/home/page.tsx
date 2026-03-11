'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-Time Stress Score',
    desc: 'Composite health metric across sales, inventory, and support — updated live every second.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: '🚨',
    title: 'Intelligent Alerts',
    desc: 'AI-detected anomalies, crisis signals, and opportunities delivered before they impact revenue.',
    color: '#EF4444',
    bg: '#FEF2F2',
  },
  {
    icon: '📦',
    title: 'Inventory Intelligence',
    desc: 'Stock-out predictions, reorder recommendations, and margin analysis across all SKUs.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    icon: '💬',
    title: 'War Room Mode',
    desc: 'Crisis command center with root-cause analysis and emergency action execution.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: '📊',
    title: 'Cash Flow Analytics',
    desc: 'Revenue, expenses, and profit visualized with 7-day rolling forecasts.',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    icon: '📄',
    title: 'Business Health Reports',
    desc: 'One-click PDF export of your full business health summary with actionable insights.',
    color: '#6366F1',
    bg: '#EEF2FF',
  },
];

const STATS = [
  { label: 'Active Stores', value: '2,400+' },
  { label: 'Alerts Resolved', value: '98,000+' },
  { label: 'Revenue Protected', value: '₹52Cr+' },
  { label: 'Avg Health Score', value: '89/100' },
];

export default function HomePage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F6F8FB',
        fontFamily: "'Inter', sans-serif",
        overflowX: 'hidden',
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(246,248,251,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(226,232,240,0.7)',
          padding: '0 clamp(20px,5vw,80px)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em' }}>
                OpsPulse
              </div>
              <div style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Business Health
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => router.push('/auth/login')}
              className="btnSecondary"
              style={{ padding: '8px 18px', fontSize: 13.5 }}
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/auth/signup')}
              className="btnPrimary"
              style={{ padding: '8px 20px', fontSize: 13.5 }}
            >
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(60px,10vw,120px) clamp(20px,5vw,80px) clamp(40px,7vw,80px)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.08) 0%, transparent 60%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
            top: '-100px',
            right: '-100px',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
            bottom: '-80px',
            left: '-80px',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          {/* Badge */}
          <div
            className="aSlideD"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(37,99,235,0.08)',
              border: '1px solid rgba(37,99,235,0.16)',
              borderRadius: 100,
              padding: '5px 14px',
              marginBottom: 24,
              fontSize: 12.5,
              fontWeight: 600,
              color: '#2563EB',
              letterSpacing: '0.01em',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#22C55E',
                animation: 'kPulse 2s ease-in-out infinite',
                display: 'inline-block',
              }}
            />
            Live Real-Time Business Intelligence
          </div>

          {/* Headline */}
          <h1
            className="aFadeUp"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: 20,
              animationDelay: '0.05s',
            }}
          >
            Know Your Business
            <br />
            <span
              style={{
                background: 'linear-gradient(120deg, #2563EB, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Health in Real-Time
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="aFadeUp"
            style={{
              fontSize: 'clamp(15px, 2.5vw, 18px)',
              color: '#475569',
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 580,
              margin: '0 auto 36px',
              animationDelay: '0.1s',
            }}
          >
            OpsPulse monitors your sales, inventory, and support in real-time — surfacing anomalies, predicting crises, and giving you the clarity to act fast.
          </p>

          {/* CTA group */}
          <div
            className="aFadeUp"
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
              animationDelay: '0.15s',
            }}
          >
            <button
              onClick={() => router.push('/auth/signup')}
              className="btnPrimary"
              style={{ padding: '13px 28px', fontSize: 15, borderRadius: 12 }}
            >
              Start for Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="btnSecondary"
              style={{ padding: '13px 28px', fontSize: 15, borderRadius: 12 }}
            >
              View Live Demo
            </button>
          </div>

          {/* Trust text */}
          <p
            className="aFadeIn"
            style={{
              marginTop: 20,
              fontSize: 12.5,
              color: '#94A3B8',
              animationDelay: '0.25s',
            }}
          >
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          padding: '28px clamp(20px,5vw,80px)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 24,
            textAlign: 'center',
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="aFadeUp">
              <div
                style={{
                  fontSize: 'clamp(26px,3.5vw,36px)',
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 6, fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dashboard Preview "mockup" ── */}
      <section
        style={{
          padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,80px)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{
              borderRadius: 24,
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              boxShadow: '0 12px 32px rgba(15,23,42,0.06), 0 24px 64px rgba(15,23,42,0.04)',
              background: '#FFFFFF',
              padding: 'clamp(32px,4vw,48px)',
            }}
          >
            {/* Mini dashboard header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)',
                  borderRadius: 9,
                  padding: '6px 12px 6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                OpsPulse Dashboard
              </div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                {['#22C55E', '#F59E0B', '#EF4444'].map((c, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: c,
                      background: `${c}12`,
                      borderRadius: 20,
                      padding: '3px 10px',
                      border: `1px solid ${c}25`,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, display: 'inline-block' }} />
                    {['Healthy', 'Moderate', 'Critical'][i]}
                  </span>
                ))}
              </div>
            </div>

            {/* Mini KPI row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 12,
                marginBottom: 16,
              }}
            >
              {[
                { label: 'Health Score', value: '93/100', color: '#22C55E', sub: '↑ +3 vs yesterday' },
                { label: 'Revenue Today', value: '₹28,400', color: '#2563EB', sub: '↑ 14.2% vs avg' },
                { label: 'Active Alerts', value: '2', color: '#EF4444', sub: '1 requires action' },
                { label: 'Avg Order', value: '₹5,040', color: '#8B5CF6', sub: '↑ 8.5% vs avg' },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 16,
                    padding: '24px 28px',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                    {kpi.label}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: 11.5, color: kpi.color, marginTop: 4, fontWeight: 600 }}>
                    {kpi.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart placeholder bar */}
            <div
              style={{
                background: 'linear-gradient(180deg,#EFF6FF,#F8FAFC)',
                border: '1px solid #DBEAFE',
                borderRadius: 16,
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'flex-end',
                gap: 12,
                height: 180,
              }}
            >
              {[40, 65, 45, 80, 55, 70, 62, 75, 58, 83, 70, 90, 68, 78, 82, 88, 72, 95].map(
                (h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      borderRadius: '6px 6px 0 0',
                      background: `linear-gradient(180deg, #3B82F6, #1D4ED8)`,
                      height: `${h}%`,
                      opacity: 0.85 + (i / 40),
                    }}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section
        style={{
          padding: 'clamp(40px,6vw,72px) clamp(20px,5vw,80px)',
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 'clamp(24px,3.5vw,38px)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.04em',
                marginBottom: 12,
              }}
            >
              Everything you need to run smarter
            </h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 520, margin: '0 auto' }}>
              Purpose-built for independent businesses and growing retail chains.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="aFadeUp"
                style={{
                  background: hovered === i ? f.bg : '#FFFFFF',
                  border: `1px solid ${hovered === i ? f.color + '30' : '#E2E8F0'}`,
                  borderRadius: 16,
                  padding: '24px',
                  cursor: 'default',
                  transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                  transform: hovered === i ? 'translateY(-4px)' : 'none',
                  boxShadow: hovered === i ? `0 8px 24px ${f.color}15` : '0 1px 3px rgba(15,23,42,0.05)',
                  animationDelay: `${i * 0.05}s`,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: f.bg,
                    border: `1px solid ${f.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    marginBottom: 14,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: 15.5,
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: 8,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        style={{
          padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,80px)',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F4FF 100%)',
          borderTop: '1px solid #DBEAFE',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(24px,4vw,40px)',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.04em',
              marginBottom: 14,
            }}
          >
            Your business deserves a pulse check.
          </h2>
          <p style={{ fontSize: 16, color: '#475569', marginBottom: 32, lineHeight: 1.6 }}>
            Join thousands of business owners who react to problems in seconds, not hours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/auth/signup')}
              className="btnPrimary"
              style={{ padding: '14px 32px', fontSize: 15.5, borderRadius: 12 }}
            >
              Launch Your Dashboard
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '24px clamp(20px,5vw,80px)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
              OpsPulse
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: '#94A3B8' }}>
            &copy; {new Date().getFullYear()} OpsPulse. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <span
                key={link}
                style={{
                  fontSize: 12.5,
                  color: '#64748B',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#2563EB')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
