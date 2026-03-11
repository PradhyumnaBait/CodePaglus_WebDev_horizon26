'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const D = {
  text: '#0F172A', textSec: '#334155', textMut: '#64748B', textFaint: '#94A3B8',
  border: '#E2E8F0', blue: '#2563EB', surface: '#FFFFFF', surfaceAlt: '#F8FAFC',
  gradPrimary: 'linear-gradient(120deg,#2563EB 0%,#3B82F6 100%)',
  shadowBlue: '0 4px 20px rgba(37,99,235,0.25)',
};

const CheckSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ActivitySVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const ArrowSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// Icon paths for business types
const GridSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const PackageSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const ZapSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const ActivitySVG2 = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const STEPS = ['Sign Up', 'Verify', 'Business', 'Inventory'];

function StepProgress({ activeIdx }: { activeIdx: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
      {STEPS.map((s, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done || active ? D.gradPrimary : D.border,
                color: done || active ? '#fff' : D.textFaint, fontSize: 12, fontWeight: 700,
                boxShadow: active ? D.shadowBlue : 'none', transition: 'all 0.3s',
              }}>
                {done ? <CheckSVG /> : i + 1}
              </div>
              <span style={{ fontSize: 10.5, color: active ? D.blue : D.textFaint, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 36, height: 2, background: i < activeIdx ? D.blue : D.border, margin: '0 4px', marginBottom: 16, transition: 'background 0.4s' }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

const BIZ_TYPES = [
  { id: 'ecommerce', icon: <GridSVG />,      label: 'E-commerce',  desc: 'Online store, marketplace'  },
  { id: 'retail',    icon: <PackageSVG />,    label: 'Retail',      desc: 'Physical store, POS'        },
  { id: 'restaurant',icon: <ZapSVG />,        label: 'Restaurant',  desc: 'Food service, delivery'     },
  { id: 'saas',      icon: <ActivitySVG2 />,  label: 'SaaS / Tech', desc: 'Software, subscriptions'    },
];

export default function BizTypePage() {
  const router = useRouter();
  const [bizType, setBizType] = useState('');

  return (
    <div className="aScale">
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: D.gradPrimary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px', boxShadow: D.shadowBlue,
        }}>
          <ActivitySVG />
        </div>
      </div>

      <StepProgress activeIdx={2} />

      <h2 style={{ fontSize: 20, fontWeight: 700, color: D.text, textAlign: 'center', marginBottom: 4, fontFamily: "'Inter'", letterSpacing: '-0.03em' }}>
        Set up your business
      </h2>
      <p style={{ fontSize: 13, color: D.textMut, textAlign: 'center', marginBottom: 24 }}>
        Select your business type to personalise your dashboard
      </p>

      {/* Business type tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 22 }}>
        {BIZ_TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => setBizType(t.id)}
            style={{
              background: bizType === t.id ? '#EFF6FF' : D.surfaceAlt,
              border: `1.5px solid ${bizType === t.id ? D.blue : D.border}`,
              borderRadius: 12, padding: '15px 14px', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.18s', boxShadow: bizType === t.id ? `0 0 0 3px ${D.blue}12` : 'none',
            }}
          >
            <div style={{ marginBottom: 7, color: bizType === t.id ? D.blue : D.textMut }}>
              {t.icon}
            </div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: D.text }}>{t.label}</p>
            <p style={{ fontSize: 12, color: D.textMut, marginTop: 2 }}>{t.desc}</p>
          </button>
        ))}
      </div>

      <button
        onClick={() => router.push('/auth/inventory-setup')}
        disabled={!bizType}
        className="btnPrimary"
        style={{ width: '100%', justifyContent: 'center', padding: '11px 20px', fontSize: 14.5 }}
      >
        Continue to Inventory Setup <ArrowSVG />
      </button>
    </div>
  );
}
