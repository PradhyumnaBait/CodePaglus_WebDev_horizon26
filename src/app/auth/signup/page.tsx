'use client';

// ============================================================
// OpsPulse — Signup Page
// CHANGE 2: Added role selection step after the signup form.
// Signup flow: fill form → role selection → /auth/verify-otp
// Role selection ONLY appears during registration, not on login.
// CHANGE 1: Improved spacing, hover states, responsive layout.
// ============================================================
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { setUserRole, UserRole } from '@/lib/auth';

const D = {
  text: '#0F172A', textSec: '#334155', textMut: '#64748B', textFaint: '#94A3B8',
  border: '#E2E8F0', blue: '#2563EB', surface: '#FFFFFF', surfaceAlt: '#F8FAFC',
  gradPrimary: 'linear-gradient(120deg,#2563EB 0%,#3B82F6 100%)',
  shadowBlue: '0 4px 20px rgba(37,99,235,0.25)',
};

const CheckSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const ActivitySVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// CHANGE 2: Icons for the role selection cards
const BriefcaseSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const SettingsSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
  </svg>
);

const STEPS = ['Sign Up', 'Verify', 'Business', 'Inventory'];

function StepProgress({ activeIdx }: { activeIdx: number }) {
  return (
    // CHANGE 1: Added marginBottom with consistent spacing
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
              <div style={{ width: 36, height: 2, background: i < activeIdx ? D.blue : D.border, margin: '0 4px', marginBottom: 16, transition: 'background 0.4s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// CHANGE 2: Role selection cards — shown after the signup form
// Only displayed during registration, never during login.
// ============================================================
const ROLES: { id: UserRole; icon: React.ReactNode; label: string; desc: string }[] = [
  {
    id: 'business_owner',
    icon: <BriefcaseSVG />,
    label: 'Business Owner',
    desc: 'Full access to all analytics, reports, and financial data.',
  },
  {
    id: 'operations_manager',
    icon: <SettingsSVG />,
    label: 'Operations Manager',
    desc: 'Focus on inventory, alerts, and day-to-day operations.',
  },
];

function RoleSelectionStep({ onContinue }: { onContinue: (role: UserRole) => void }) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    // CHANGE 2: Role selection sub-step rendered inside the same auth card
    <div className="aScale">
      <StepProgress activeIdx={0} />

      <h2 style={{
        fontSize: 20, fontWeight: 700, color: D.text, fontFamily: "'Inter'",
        textAlign: 'center', marginBottom: 4, letterSpacing: '-0.03em',
      }}>
        Choose your role
      </h2>
      <p style={{ fontSize: 13, color: D.textMut, textAlign: 'center', marginBottom: 24 }}>
        This personalises your dashboard experience
      </p>

      {/* Role cards — CHANGE 2: role selection only during signup */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {ROLES.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRole(r.id)}
            style={{
              background: selectedRole === r.id ? '#EFF6FF' : D.surfaceAlt,
              border: `1.5px solid ${selectedRole === r.id ? D.blue : D.border}`,
              borderRadius: 14,
              padding: '18px 14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.18s ease',
              boxShadow: selectedRole === r.id ? `0 0 0 3px rgba(37,99,235,0.1)` : 'none',
              // CHANGE 1: hover feedback via inline style overridden by CSS class below
            }}
            className="roleCard"
          >
            <div style={{
              marginBottom: 10,
              color: selectedRole === r.id ? D.blue : D.textMut,
              transition: 'color 0.18s',
            }}>
              {r.icon}
            </div>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: D.text, marginBottom: 4 }}>{r.label}</p>
            <p style={{ fontSize: 11.5, color: D.textMut, lineHeight: 1.4 }}>{r.desc}</p>

            {/* Selected indicator */}
            {selectedRole === r.id && (
              <div style={{
                marginTop: 10, display: 'flex', alignItems: 'center', gap: 5,
                color: D.blue, fontSize: 11.5, fontWeight: 600,
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: D.gradPrimary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckSVG />
                </div>
                Selected
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => selectedRole && onContinue(selectedRole)}
        disabled={!selectedRole}
        className="btnPrimary"
        style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: 14.5 }}
      >
        Continue to Verify <ArrowSVG />
      </button>

      <p style={{ fontSize: 12, color: D.textFaint, textAlign: 'center', marginTop: 14 }}>
        You can change your role later in Settings.
      </p>
    </div>
  );
}

// ============================================================
// Main Signup Page Component
// CHANGE 2: Two internal steps — 'form' (data entry) and 'role' (role select)
// ============================================================
export default function SignupPage() {
  const router = useRouter();

  // CHANGE 2: Internal step state — 'form' first, then 'role' before OTP
  const [step, setStep] = useState<'form' | 'role'>('form');

  // Individual stable state per field (no input re-mount cursor bug)
  const [sfName, setSfName] = useState('');
  const [sfEmail, setSfEmail] = useState('');
  const [sfPhone, setSfPhone] = useState('');
  const [sfDob, setSfDob] = useState('');
  const [sfBiz, setSfBiz] = useState('');
  const [sfPass, setSfPass] = useState('');

  // CHANGE 2: Step 1 submit — instead of going to OTP immediately,
  // show the role selection sub-step first
  const handleFormSubmit = useCallback(() => {
    if (sfBiz.trim()) {
      sessionStorage.setItem('ops_bizName', sfBiz.trim());
    }
    // Transition to role selection step
    setStep('role');
  }, [sfBiz]);

  // CHANGE 2: Role confirmed — store it, then navigate to OTP verification
  const handleRoleConfirmed = useCallback((role: UserRole) => {
    setUserRole(role); // Persist role via auth utility (CHANGE 2 & 3)
    router.push('/auth/verify-otp');
  }, [router]);

  // CHANGE 2: Show role selection if user has submitted the form
  if (step === 'role') {
    return <RoleSelectionStep onContinue={handleRoleConfirmed} />;
  }

  // Default: show the signup form (step === 'form')
  return (
    <div className="aScale">
      {/* Logo */}
      {/* CHANGE 1: Consistent spacing around logo */}
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

      {/* CHANGE 1: Form grid with consistent gap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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

      {/* CHANGE 1: Consistent marginTop on button */}
      <button
        onClick={handleFormSubmit}
        className="btnPrimary"
        style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '12px 20px', fontSize: 14.5 }}
      >
        Create Account <ArrowSVG />
      </button>

      <p style={{ fontSize: 12.5, color: D.textFaint, textAlign: 'center', marginTop: 16 }}>
        Already have an account?{' '}
        <span onClick={() => router.push('/auth/login')} style={{ color: D.blue, cursor: 'pointer', fontWeight: 600 }}>Sign in</span>
      </p>
    </div>
  );
}
