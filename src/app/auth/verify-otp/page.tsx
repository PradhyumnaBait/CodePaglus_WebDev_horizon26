'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const D = {
  text: '#0F172A', textMut: '#64748B', textFaint: '#94A3B8',
  border: '#E2E8F0', blue: '#2563EB', surface: '#FFFFFF',
  gradPrimary: 'linear-gradient(120deg,#2563EB 0%,#3B82F6 100%)',
  shadowBlue: '0 4px 20px rgba(37,99,235,0.25)',
  success: '#22C55E',
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

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(29);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleOtp = useCallback((i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    setOtp(prev => { const n = [...prev]; n[i] = v; return n; });
    if (v && i < 5) setTimeout(() => document.getElementById(`otp_${i + 1}`)?.focus(), 0);
    if (!v && i > 0) setTimeout(() => document.getElementById(`otp_${i - 1}`)?.focus(), 0);
  }, []);

  const handleVerify = () => {
    router.push('/auth/biztype');
  };

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

      <StepProgress activeIdx={1} />

      <h2 style={{ fontSize: 20, fontWeight: 700, color: D.text, textAlign: 'center', marginBottom: 4, fontFamily: "'Inter'", letterSpacing: '-0.03em' }}>
        Verify your number
      </h2>
      <p style={{ fontSize: 13, color: D.textMut, textAlign: 'center', marginBottom: 26 }}>
        Enter the 6-digit code sent to your mobile
      </p>

      {/* OTP inputs */}
      <div style={{ display: 'flex', gap: 9, justifyContent: 'center', marginBottom: 24 }}>
        {otp.map((v, i) => (
          <input
            key={i}
            id={`otp_${i}`}
            value={v}
            onChange={e => handleOtp(i, e.target.value)}
            maxLength={1}
            inputMode="numeric"
            autoComplete="one-time-code"
            style={{
              width: 46, height: 54, textAlign: 'center', fontFamily: "'Inter', monospace",
              fontSize: 22, fontWeight: 700, border: `1.5px solid ${v ? D.blue : D.border}`,
              borderRadius: 10, background: v ? D.blue + '06' : D.surface, color: D.text,
              outline: 'none', transition: 'border-color 0.18s, box-shadow 0.18s',
              boxShadow: v ? `0 0 0 3px ${D.blue}15` : 'none',
            }}
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="btnPrimary"
        style={{ width: '100%', justifyContent: 'center', padding: '11px 20px', fontSize: 14.5 }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Verify &amp; Continue
      </button>

      <p style={{ fontSize: 12.5, color: D.textFaint, textAlign: 'center', marginTop: 14 }}>
        {timer > 0
          ? <>Resend in <span style={{ color: D.blue, fontWeight: 600 }}>{timer}s</span></>
          : <span onClick={() => setTimer(29)} style={{ color: D.blue, cursor: 'pointer', fontWeight: 600 }}>Resend code</span>}
      </p>
    </div>
  );
}
