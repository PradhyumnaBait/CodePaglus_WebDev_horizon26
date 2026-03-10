'use client';

import { useRouter } from 'next/navigation';

// Inline Icon component (Lucide-style SVG)
const Icon = ({ name, size = 16, color = 'currentColor', style = {} }: { name: string; size?: number; color?: string; style?: React.CSSProperties }) => {
  const paths: Record<string, React.ReactNode> = {
    activity:  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
    zap:       <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    alert:     <><polygon points="10.29 3.86 1.82 18 22.18 18 13.71 3.86 10.29 3.86"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    barChart:  <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    package:   <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    fileText:  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    sparkle:   <><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></>,
    arrowRight:<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}>
      {paths[name]}
    </svg>
  );
};

const D = {
  bg: '#F6F8FB', surface: '#FFFFFF', surfaceAlt: '#F8FAFC',
  text: '#0F172A', textSec: '#334155', textMut: '#64748B', textFaint: '#94A3B8',
  border: '#E2E8F0', blue: '#2563EB', blueL: '#3B82F6', indigo: '#6366F1',
  cyan: '#06B6D4', success: '#22C55E', warning: '#F59E0B', critical: '#EF4444',
  gradPrimary: 'linear-gradient(120deg,#2563EB 0%,#3B82F6 100%)',
  shadowCard: '0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)',
  shadowMd: '0 4px 24px rgba(15,23,42,0.08), 0 1px 4px rgba(15,23,42,0.04)',
  shadowBlue: '0 4px 20px rgba(37,99,235,0.25)',
};

const FEATURES = [
  { icon: 'activity', title: 'Real-Time Monitoring',  desc: 'WebSocket-powered live data keeps every metric current without page refreshes.',      color: D.blue     },
  { icon: 'sparkle',  title: 'AI-Powered Insights',   desc: 'Claude AI analyses your business data and answers operational questions naturally.',  color: D.indigo   },
  { icon: 'alert',    title: 'Crisis Detection',       desc: 'Automatic War Room mode activates when critical thresholds are breached.',            color: D.critical },
  { icon: 'barChart', title: 'Unified Analytics',      desc: 'Sales, inventory, support, and cash flow in one coherent dashboard.',                color: D.cyan     },
  { icon: 'package',  title: 'Inventory Manager',      desc: 'Add and manage products with automatic margin and profitability calculations.',       color: D.success  },
  { icon: 'fileText', title: 'PDF Reporting',          desc: 'Generate and download professional business health reports with one click.',          color: D.warning  },
];

const STATS: [string, string][] = [
  ['500+',   'SMBs Onboarded'],
  ['₹2.4Cr', 'Revenue Tracked'],
  ['99.9%',  'Uptime SLA'],
  ['4.9',    'User Rating'],
];

export default function HomePage() {
  const router = useRouter();
  const goToSignup = () => router.push('/auth/signup');

  return (
    <div style={{ minHeight: '100vh', background: D.bg, fontFamily: "'Inter', Helvetica, sans-serif" }}>
      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226,232,240,0.7)',
        padding: '14px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: D.gradPrimary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: D.shadowBlue,
          }}>
            <Icon name="activity" size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: D.text, letterSpacing: '-0.03em' }}>OpsPulse</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={goToSignup} className="btnSecondary" style={{ padding: '8px 18px', fontSize: 13.5 }}>Log in</button>
          <button onClick={goToSignup} className="btnPrimary"   style={{ padding: '8px 18px', fontSize: 13.5 }}>Get started free</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        padding: '88px 60px 64px', textAlign: 'center',
        background: 'radial-gradient(circle at 50% -10%,#EAF4FF 0%,#F6F8FB 60%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -120, left: '5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle,#DBEAFE40,transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', top: -80, right: '8%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,#E0E7FF40,transparent 70%)', pointerEvents: 'none' }}/>

        {/* Badge pill */}
        <div className="aFadeUp" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: D.blue + '12', border: `1px solid ${D.blue}25`, borderRadius: 20,
          padding: '6px 16px', marginBottom: 24, fontSize: 12.5, fontWeight: 600, color: D.blue, letterSpacing: '0.04em',
        }}>
          <Icon name="zap" size={13} color={D.blue} />
          UNIFIED BUSINESS INTELLIGENCE PLATFORM
        </div>

        {/* Headline */}
        <h1 className="aFadeUp" style={{
          fontSize: 'clamp(36px,5.5vw,62px)', fontWeight: 800, color: D.text,
          fontFamily: "'Inter','Helvetica Neue',Helvetica,sans-serif",
          letterSpacing: '-0.05em', lineHeight: 1.06, maxWidth: 760, margin: '0 auto 8px',
          animationDelay: '80ms',
        }}>
          Data-Driven Decisions<br/>
          <span style={{ background: 'linear-gradient(120deg,#2563EB,#6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Powered by AI
          </span>
        </h1>

        {/* Italic quote */}
        <p className="aFadeUp" style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic',
          fontSize: 19, color: D.textMut, margin: '14px auto 10px', maxWidth: 540, lineHeight: 1.6,
          animationDelay: '140ms',
        }}>
          &ldquo;Know the exact health of your business, right now.&rdquo;
        </p>
        <p className="aFadeUp" style={{
          fontSize: 16, color: D.textMut, maxWidth: 520, margin: '0 auto 38px', lineHeight: 1.75, animationDelay: '180ms',
        }}>
          OpsPulse aggregates sales, inventory, support and cash flow into a live health score with AI-powered insights and automated crisis detection.
        </p>

        {/* CTA buttons */}
        <div className="aFadeUp" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animationDelay: '240ms' }}>
          <button onClick={goToSignup} className="btnPrimary" style={{ padding: '12px 28px', fontSize: 15, boxShadow: D.shadowBlue }}>
            Try for Free
            <Icon name="arrowRight" size={14} color="#fff" />
          </button>
          <button onClick={goToSignup} className="btnSecondary" style={{ padding: '12px 24px', fontSize: 15 }}>
            Schedule Demo
          </button>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{
        background: D.surface, borderTop: `1px solid ${D.border}`, borderBottom: `1px solid ${D.border}`,
        padding: '24px 60px', display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap',
      }}>
        {STATS.map(([v, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: D.text, fontFamily: "'Inter'", letterSpacing: '-0.04em' }}>{v}</p>
            <p style={{ fontSize: 13, color: D.textMut, marginTop: 2 }}>{l}</p>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '72px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: D.text, fontFamily: "'Inter'", letterSpacing: '-0.04em', marginBottom: 10 }}>
            Built for serious business owners
          </h2>
          <p style={{ fontSize: 16, color: D.textMut, maxWidth: 460, margin: '0 auto' }}>
            Enterprise-grade analytics without the enterprise complexity or price tag.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, maxWidth: 980, margin: '0 auto' }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="hCard aFadeUp" style={{
              animationDelay: `${i * 70}ms`,
              background: D.surface, borderRadius: 12, border: `1px solid ${D.border}`,
              boxShadow: D.shadowCard, padding: 24,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 11, background: f.color + '12',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                border: `1px solid ${f.color}20`,
              }}>
                <Icon name={f.icon} size={18} color={f.color} />
              </div>
              <h3 style={{ fontSize: 15.5, fontWeight: 600, color: D.text, marginBottom: 7, letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: D.textMut, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ padding: '48px 60px 80px' }}>
        <div style={{
          background: D.surface, border: `1px solid ${D.border}`, borderRadius: 18,
          padding: '52px 48px', maxWidth: 680, margin: '0 auto', textAlign: 'center',
          boxShadow: '0 4px 24px rgba(15,23,42,0.08)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,#DBEAFE35,transparent 70%)', pointerEvents: 'none' }}/>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: D.text, fontFamily: "'Inter'", letterSpacing: '-0.04em', marginBottom: 12 }}>
            Ready to take control?
          </h2>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 17, color: D.textMut, marginBottom: 8 }}>
            &ldquo;Your business deserves better visibility than spreadsheets.&rdquo;
          </p>
          <p style={{ fontSize: 15, color: D.textMut, marginBottom: 30, lineHeight: 1.6 }}>
            Join SMBs using OpsPulse to prevent operational crises before they happen.
          </p>
          <button onClick={goToSignup} className="btnPrimary" style={{ padding: '13px 36px', fontSize: 15, boxShadow: D.shadowBlue }}>
            Get Started — It&apos;s Free
            <Icon name="arrowRight" size={14} color="#fff" />
          </button>
        </div>
      </section>
    </div>
  );
}
