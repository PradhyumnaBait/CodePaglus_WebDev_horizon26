'use client';

import { useState, useCallback } from 'react';
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

const ArrowSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const ActivitySVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default function SignupPage() {
  const router = useRouter();

  // Individual stable state per field (no input re-mount cursor bug)
  const [sfName,  setSfName]  = useState('');
  const [sfEmail, setSfEmail] = useState('');
  const [sfPhone, setSfPhone] = useState('');
  const [sfDob,   setSfDob]   = useState('');
  const [sfBiz,   setSfBiz]   = useState('');
  const [sfPass,  setSfPass]  = useState('');

  const handleSubmit = useCallback(() => {
    if (sfBiz.trim()) {
      // Store business name in sessionStorage for later screens
      sessionStorage.setItem('ops_bizName', sfBiz.trim());
    }
    router.push('/auth/verify-otp');
  }, [sfBiz, router]);

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

      <StepProgress activeIdx={0} />

      <h2 style={{ fontSize: 20, fontWeight: 700, color: D.text, fontFamily: "'Inter'", textAlign: 'center', marginBottom: 4, letterSpacing: '-0.03em' }}>
        Create your account
      </h2>
      <p style={{ fontSize: 13, color: D.textMut, textAlign: 'center', marginBottom: 22 }}>
        Start monitoring your business health
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Full Name — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Full Name</label>
          <input value={sfName} onChange={e => setSfName(e.target.value)} placeholder="Jane Smith" className="inputField" autoComplete="name" />
        </div>
        {/* Email */}
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Email</label>
          <input type="email" value={sfEmail} onChange={e => setSfEmail(e.target.value)} placeholder="jane@company.com" className="inputField" autoComplete="email" />
        </div>
        {/* Mobile */}
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Mobile</label>
          <input type="tel" value={sfPhone} onChange={e => setSfPhone(e.target.value)} placeholder="+91 98765 43210" className="inputField" autoComplete="tel" />
        </div>
        {/* Date of Birth */}
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Date of Birth</label>
          <input type="date" value={sfDob} onChange={e => setSfDob(e.target.value)} className="inputField" />
        </div>
        {/* Business Name */}
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Business Name</label>
          <input value={sfBiz} onChange={e => setSfBiz(e.target.value)} placeholder="Acme Store" className="inputField" />
        </div>
        {/* Password — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Password</label>
          <input type="password" value={sfPass} onChange={e => setSfPass(e.target.value)} placeholder="8+ characters" className="inputField" autoComplete="new-password" />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="btnPrimary"
        style={{ width: '100%', justifyContent: 'center', marginTop: 18, padding: '11px 20px', fontSize: 14.5 }}
      >
        Create Account <ArrowSVG />
      </button>

      <p style={{ fontSize: 12.5, color: D.textFaint, textAlign: 'center', marginTop: 14 }}>
        Already have an account?{' '}
        <span onClick={() => router.push('/auth/login')} style={{ color: D.blue, cursor: 'pointer', fontWeight: 600 }}>Sign in</span>
      </p>
    </div>
  );
}
