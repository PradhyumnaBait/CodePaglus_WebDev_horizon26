'use client';

// ============================================================
// OpsPulse — Settings Page (Task 4)
// Left sidebar navigation + right content panel
// 8 sections: profile, stress config, alerts, integrations,
// preferences, roles, war room automation, system settings
// ============================================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, SlidersHorizontal, Bell, Database, LayoutDashboard,
  Users, Shield, Settings, CheckCircle2, AlertCircle, Plus, Trash2,
  Globe, Clock, Zap, RefreshCw, Mail, MessageSquare, Phone,
} from 'lucide-react';

// ── Section definitions ──────────────────────────────────────
const SECTIONS = [
  { id: 'profile',       label: 'Business Profile',            icon: Building2          },
  { id: 'stress',        label: 'Stress Score Configuration',  icon: SlidersHorizontal  },
  { id: 'alerts',        label: 'Alert & Notification Settings', icon: Bell             },
  { id: 'integrations',  label: 'Data Source Integrations',    icon: Database           },
  { id: 'preferences',   label: 'Dashboard Preferences',       icon: LayoutDashboard    },
  { id: 'roles',         label: 'User Roles & Permissions',    icon: Users              },
  { id: 'warroom',       label: 'War Room Automation',         icon: Zap                },
  { id: 'system',        label: 'System Settings',             icon: Settings           },
];

// ── Reusable tiny components ─────────────────────────────────
function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em' }}>{title}</h2>
      {description && (
        <p style={{ fontSize: 13, color: '#64748B', marginTop: 4, lineHeight: 1.6 }}>{description}</p>
      )}
    </div>
  );
}

function FormLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
      {label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      className="inputField"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ marginBottom: 0 }}
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { label: string; value: string }[];
}) {
  return (
    <select
      className="inputField"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ marginBottom: 0 }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
      <span style={{ fontSize: 13.5, color: '#334155' }}>{label}</span>
      <button
        onClick={onChange}
        style={{
          width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
          background: on ? 'linear-gradient(90deg, #1D4ED8, #3B82F6)' : '#E2E8F0',
          position: 'relative', transition: 'background 0.2s ease',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute', top: 3, left: on ? 25 : 3, width: 20, height: 20,
            borderRadius: '50%', background: '#FFFFFF',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            transition: 'left 0.2s ease',
          }}
        />
      </button>
    </div>
  );
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      className="btnPrimary"
      onClick={onClick}
      style={{ marginTop: 24, padding: '10px 24px', fontSize: 13.5 }}
    >
      {saved ? <><CheckCircle2 size={14} /> Saved!</> : 'Save Changes'}
    </button>
  );
}

// ── Section Components ────────────────────────────────────────
function ProfileSection() {
  const [form, setForm] = useState({
    businessName: 'My Store', industry: 'retail', bizSize: 'small',
    currency: 'INR', timezone: 'Asia/Kolkata', opStart: '09:00', opEnd: '21:00',
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <SectionHeading title="Business Profile" description="Core information about your business used across all features." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <FormLabel label="Business Name" required />
          <Input value={form.businessName} onChange={(v) => setForm({ ...form, businessName: v })} placeholder="My Store" />
        </div>
        <div>
          <FormLabel label="Industry" />
          <Select value={form.industry} onChange={(v) => setForm({ ...form, industry: v })} options={[
            { label: 'Retail', value: 'retail' }, { label: 'Ecommerce', value: 'ecommerce' }, { label: 'SaaS', value: 'saas' },
          ]} />
        </div>
        <div>
          <FormLabel label="Business Size" />
          <Select value={form.bizSize} onChange={(v) => setForm({ ...form, bizSize: v })} options={[
            { label: 'Small (< 10 staff)', value: 'small' }, { label: 'Medium (10–100 staff)', value: 'medium' },
          ]} />
        </div>
        <div>
          <FormLabel label="Currency" />
          <Select value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} options={[
            { label: '₹ Indian Rupee (INR)', value: 'INR' }, { label: '$ US Dollar (USD)', value: 'USD' }, { label: '€ Euro (EUR)', value: 'EUR' },
          ]} />
        </div>
        <div>
          <FormLabel label="Timezone" />
          <Select value={form.timezone} onChange={(v) => setForm({ ...form, timezone: v })} options={[
            { label: 'Asia/Kolkata (IST)', value: 'Asia/Kolkata' }, { label: 'America/New_York (EST)', value: 'America/New_York' }, { label: 'Europe/London (GMT)', value: 'Europe/London' },
          ]} />
        </div>
        <div>
          <FormLabel label="Operating Hours — Open" />
          <Input type="time" value={form.opStart} onChange={(v) => setForm({ ...form, opStart: v })} />
        </div>
        <div>
          <FormLabel label="Operating Hours — Close" />
          <Input type="time" value={form.opEnd} onChange={(v) => setForm({ ...form, opEnd: v })} />
        </div>
      </div>
      <SaveButton onClick={save} saved={saved} />
    </div>
  );
}

function StressSection() {
  const [weights, setWeights] = useState({ sales: 40, inventory: 35, cashflow: 25 });
  const [aiAnomaly, setAiAnomaly] = useState(true);
  const [recalcInterval, setRecalcInterval] = useState('30');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const total = weights.sales + weights.inventory + weights.cashflow;

  const setW = (key: keyof typeof weights, val: number) => {
    const updated = { ...weights, [key]: val };
    setWeights(updated);
    const newTotal = updated.sales + updated.inventory + updated.cashflow;
    setError(newTotal !== 100 ? `Weights sum to ${newTotal}% — must equal 100%` : '');
  };

  const save = () => {
    if (total !== 100) { setError('Weights must sum to 100% before saving.'); return; }
    setSaved(true);
    setError('');
    setTimeout(() => setSaved(false), 2500);
  };

  const sliders: { key: keyof typeof weights; label: string; color: string }[] = [
    { key: 'sales',     label: 'Sales Weight',      color: '#2563EB' },
    { key: 'inventory', label: 'Inventory Weight',  color: '#F59E0B' },
    { key: 'cashflow',  label: 'Cash Flow Weight',  color: '#10B981' },
  ];

  return (
    <div>
      <SectionHeading title="Stress Score Configuration" description="Configure how each business dimension contributes to your stress score. Weights must sum to 100%." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
        {sliders.map((s) => (
          <div key={s.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <FormLabel label={s.label} />
              <span style={{ fontSize: 13, fontWeight: 700, color: s.color, background: `${s.color}12`, borderRadius: 8, padding: '2px 10px' }}>
                {weights[s.key]}%
              </span>
            </div>
            <input
              type="range" min={0} max={100} value={weights[s.key]}
              onChange={(e) => setW(s.key, Number(e.target.value))}
              style={{
                width: '100%', height: 6, borderRadius: 6, cursor: 'pointer',
                accentColor: s.color, background: `linear-gradient(to right, ${s.color} ${weights[s.key]}%, #E2E8F0 ${weights[s.key]}%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Running total indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, marginBottom: 20, background: total === 100 ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${total === 100 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
        {total === 100 ? <CheckCircle2 size={14} color="#10B981" /> : <AlertCircle size={14} color="#EF4444" />}
        <span style={{ fontSize: 13, fontWeight: 600, color: total === 100 ? '#10B981' : '#EF4444' }}>
          Total: {total}% {total === 100 ? '✓ Valid' : `— needs ${100 - total > 0 ? '+' : ''}${100 - total}% adjustment`}
        </span>
      </div>

      <Toggle on={aiAnomaly} onChange={() => setAiAnomaly(!aiAnomaly)} label="Enable AI Anomaly Detection" />
      <div style={{ padding: '16px 0' }}>
        <FormLabel label="Auto-Recalculation Interval (seconds)" />
        <Select value={recalcInterval} onChange={setRecalcInterval} options={[
          { label: '5 seconds', value: '5' }, { label: '10 seconds', value: '10' },
          { label: '30 seconds', value: '30' }, { label: '60 seconds', value: '60' },
        ]} />
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 8 }}>
          {error}
        </div>
      )}
      <SaveButton onClick={save} saved={saved} />
    </div>
  );
}

function AlertsSection() {
  const [thresholds, setThresholds] = useState({ salesDrop: '10', inventoryLevel: '15', cashMin: '5000' });
  const [channels, setChannels]     = useState({ email: true, slack: false, sms: false, dashboard: true });
  const [saved, setSaved]           = useState(false);

  return (
    <div>
      <SectionHeading title="Alert & Notification Settings" description="Set thresholds that trigger alerts. Notifications are sent via your enabled channels." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 24px', marginBottom: 24 }}>
        <div>
          <FormLabel label="Sales Drop Trigger (%)" />
          <Input type="number" value={thresholds.salesDrop} onChange={(v) => setThresholds({ ...thresholds, salesDrop: v })} placeholder="10" />
          <span className="badge badge-crisis" style={{ marginTop: 6, display: 'inline-block' }}>Crisis</span>
        </div>
        <div>
          <FormLabel label="Inventory Shortage Level (units)" />
          <Input type="number" value={thresholds.inventoryLevel} onChange={(v) => setThresholds({ ...thresholds, inventoryLevel: v })} placeholder="15" />
          <span className="badge badge-warning" style={{ marginTop: 6, display: 'inline-block' }}>Anomaly</span>
        </div>
        <div>
          <FormLabel label="Cash Balance Minimum (₹)" />
          <Input type="number" value={thresholds.cashMin} onChange={(v) => setThresholds({ ...thresholds, cashMin: v })} placeholder="5000" />
          <span className="badge badge-info" style={{ marginTop: 6, display: 'inline-block' }}>Opportunity</span>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Notification Channels</h3>
        <p style={{ fontSize: 12.5, color: '#64748B', marginBottom: 16 }}>Choose where to receive alerts for each event.</p>
        {[
          { key: 'email',     label: 'Email Notifications',       icon: Mail           },
          { key: 'slack',     label: 'Slack Integration',         icon: MessageSquare  },
          { key: 'sms',       label: 'SMS Alerts',               icon: Phone          },
          { key: 'dashboard', label: 'In-Dashboard Notifications', icon: Bell          },
        ].map((c) => {
          const CIcon = c.icon;
          return (
            <Toggle
              key={c.key}
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 } as any}>
                  <CIcon size={14} style={{ color: '#64748B' }} /> {c.label}
                </span> as any
              }
              on={channels[c.key as keyof typeof channels]}
              onChange={() => setChannels((p) => ({ ...p, [c.key]: !p[c.key as keyof typeof channels] }))}
            />
          );
        })}
      </div>
      <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} saved={saved} />
    </div>
  );
}

const INTEGRATIONS = [
  { id: 'shopify',    label: 'Shopify',         color: '#96BF48', status: 'connected'    },
  { id: 'zoho',       label: 'Zoho Inventory',  color: '#E44215', status: 'disconnected' },
  { id: 'quickbooks', label: 'QuickBooks',      color: '#2CA01C', status: 'disconnected' },
  { id: 'stripe',     label: 'Stripe',          color: '#635BFF', status: 'connected'    },
];

function IntegrationsSection() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [mockData, setMockData] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionHeading title="Data Source Integrations" description="Connect your data sources. API keys are encrypted and stored securely." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        {INTEGRATIONS.map((intg) => (
          <div
            key={intg.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: 16, borderRadius: 12,
              border: `1px solid ${intg.status === 'connected' ? 'rgba(16,185,129,0.2)' : '#E2E8F0'}`,
              background: intg.status === 'connected' ? 'rgba(16,185,129,0.04)' : '#FFFFFF',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${intg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: intg.color }}>{intg.label[0]}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0F172A' }}>{intg.label}</span>
                <span
                  className={`badge badge-${intg.status === 'connected' ? 'success' : 'neutral'}`}
                >
                  {intg.status === 'connected' ? '● Connected' : '○ Not connected'}
                </span>
              </div>
              <input
                type="password"
                className="inputField"
                placeholder={`Paste ${intg.label} API key…`}
                value={apiKeys[intg.id] || ''}
                onChange={(e) => setApiKeys((p) => ({ ...p, [intg.id]: e.target.value }))}
                style={{ fontSize: 12.5, padding: '7px 10px' }}
              />
            </div>
            <button className="btnSecondary" style={{ fontSize: 12, padding: '7px 14px', flexShrink: 0 }}>
              {intg.status === 'connected' ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, padding: '16px 0', borderTop: '1px solid #E2E8F0', marginBottom: 8, alignItems: 'center' }}>
        <Toggle on={mockData} onChange={() => setMockData(!mockData)} label="Use Mock Data Simulator (for prototyping)" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', marginTop: 8 }}>
        <Database size={16} style={{ color: '#64748B', flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>CSV Upload</p>
          <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Upload a CSV to import historical data for testing.</p>
        </div>
        <button className="btnSecondary" style={{ marginLeft: 'auto', fontSize: 12, padding: '7px 14px', flexShrink: 0 }}>
          Upload CSV
        </button>
      </div>
      <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} saved={saved} />
    </div>
  );
}

function PreferencesSection() {
  const [darkMode, setDarkMode]       = useState(false);
  const [refresh, setRefresh]         = useState('10');
  const [layout, setLayout]           = useState('balanced');
  const [advanced, setAdvanced]       = useState(false);
  const [saved, setSaved]             = useState(false);

  return (
    <div>
      <SectionHeading title="Dashboard Preferences" description="Personalise how OpsPulse looks and behaves." />
      <Toggle on={darkMode} onChange={() => setDarkMode(!darkMode)} label="Dark Mode (coming soon)" />
      <Toggle on={advanced} onChange={() => setAdvanced(!advanced)} label="Show Advanced Metrics" />

      <div style={{ padding: '16px 0', borderBottom: '1px solid #F1F5F9' }}>
        <FormLabel label="Chart Refresh Rate" />
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          {['5', '10', '30'].map((r) => (
            <button
              key={r}
              onClick={() => setRefresh(r)}
              style={{
                padding: '8px 18px', borderRadius: 8, border: `1.5px solid ${refresh === r ? '#2563EB' : '#E2E8F0'}`,
                background: refresh === r ? '#EFF6FF' : '#FFFFFF',
                color: refresh === r ? '#1D4ED8' : '#334155',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {r}s
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 0' }}>
        <FormLabel label="Default Dashboard Layout" />
        <Select value={layout} onChange={setLayout} options={[
          { label: 'Balanced (recommended)', value: 'balanced' },
          { label: 'Sales Focused', value: 'sales' },
          { label: 'Operations Focused', value: 'ops' },
        ]} />
      </div>
      <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} saved={saved} />
    </div>
  );
}

const INITIAL_USERS = [
  { id: '1', name: 'Pradhyumna S.', email: 'pradhyumna@store.com', role: 'Business Owner' },
  { id: '2', name: 'Riya K.',       email: 'riya@store.com',       role: 'Operations Manager' },
  { id: '3', name: 'Arjun T.',      email: 'arjun@store.com',      role: 'Analyst' },
];

function RolesSection() {
  const [users, setUsers]     = useState(INITIAL_USERS);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Analyst');
  const [saved, setSaved]     = useState(false);

  const addUser = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    setUsers((p) => [...p, { id: Date.now().toString(), name: newName, email: newEmail, role: newRole }]);
    setNewName(''); setNewEmail('');
  };
  const removeUser = (id: string) => setUsers((p) => p.filter((u) => u.id !== id));
  const changeRole = (id: string, role: string) => setUsers((p) => p.map((u) => u.id === id ? { ...u, role } : u));

  return (
    <div>
      <SectionHeading title="User Roles & Permissions" description="Manage who has access to OpsPulse and what they can do." />

      {/* Users table */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0', marginBottom: 24 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th style={{ width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600, color: '#0F172A' }}>{u.name}</td>
                <td style={{ color: '#64748B' }}>{u.email}</td>
                <td>
                  <select
                    className="inputField"
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    style={{ padding: '5px 10px', fontSize: 12, width: 'auto' }}
                  >
                    {['Business Owner', 'Operations Manager', 'Analyst'].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={() => removeUser(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add user row */}
      <div style={{ padding: 16, borderRadius: 12, border: '1.5px dashed #CBD5E1', background: '#F8FAFC', marginBottom: 8 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>Add New User</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10, alignItems: 'end' }}>
          <div>
            <FormLabel label="Name" />
            <Input value={newName} onChange={setNewName} placeholder="Full name" />
          </div>
          <div>
            <FormLabel label="Email" />
            <Input type="email" value={newEmail} onChange={setNewEmail} placeholder="email@store.com" />
          </div>
          <div>
            <FormLabel label="Role" />
            <Select value={newRole} onChange={setNewRole} options={[
              { label: 'Business Owner', value: 'Business Owner' },
              { label: 'Operations Manager', value: 'Operations Manager' },
              { label: 'Analyst', value: 'Analyst' },
            ]} />
          </div>
          <button onClick={addUser} className="btnPrimary" style={{ padding: '10px 14px' }}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
      <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} saved={saved} />
    </div>
  );
}

function WarRoomSection() {
  const [enabled, setEnabled]     = useState(true);
  const [threshold, setThreshold] = useState('75');
  const [minAlerts, setMinAlerts] = useState('3');
  const [saved, setSaved]         = useState(false);

  return (
    <div>
      <SectionHeading title="War Room Automation Settings" description="Configure when OpsPulse automatically activates War Room mode." />
      <Toggle on={enabled} onChange={() => setEnabled(!enabled)} label="Enable War Room Auto-Activation" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', marginTop: 20 }}>
        <div>
          <FormLabel label="Stress Score Trigger Threshold" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Input type="number" value={threshold} onChange={setThreshold} placeholder="75" />
            <span style={{ fontSize: 13, color: '#64748B', whiteSpace: 'nowrap' }}>/ 100</span>
          </div>
          <p style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 4 }}>War Room activates when stress score exceeds this value.</p>
        </div>
        <div>
          <FormLabel label="Minimum Crisis Alert Count" />
          <Input type="number" value={minAlerts} onChange={setMinAlerts} placeholder="3" />
          <p style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 4 }}>Must have at least this many active crisis alerts.</p>
        </div>
      </div>
      <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#DC2626', marginBottom: 4 }}>⚡ Current trigger conditions:</p>
        <p style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.7 }}>
          War Room activates when <strong>Stress Score ≥ {threshold}</strong> AND <strong>Active Crisis Alerts ≥ {minAlerts}</strong>.
          {enabled ? ' Auto-activation is ON.' : ' Auto-activation is OFF — manual only.'}
        </p>
      </div>
      <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} saved={saved} />
    </div>
  );
}

function SystemSection() {
  const [retention,  setRetention]  = useState('90');
  const [logStorage, setLogStorage] = useState('30');
  const [rateLimit,  setRateLimit]  = useState('1000');
  const [saved, setSaved]           = useState(false);

  return (
    <div>
      <SectionHeading title="System Settings" description="Infrastructure-level configuration for data management and API usage." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <FormLabel label="Data Retention Period (days)" />
          <Select value={retention} onChange={setRetention} options={[
            { label: '30 days', value: '30' }, { label: '60 days', value: '60' },
            { label: '90 days (recommended)', value: '90' }, { label: '365 days', value: '365' },
          ]} />
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Business data older than this period is archived and compressed.</p>
        </div>
        <div>
          <FormLabel label="Log Storage Retention (days)" />
          <Select value={logStorage} onChange={setLogStorage} options={[
            { label: '7 days', value: '7' }, { label: '14 days', value: '14' },
            { label: '30 days (recommended)', value: '30' }, { label: '90 days', value: '90' },
          ]} />
        </div>
        <div>
          <FormLabel label="API Rate Limit (requests/hour)" />
          <Input type="number" value={rateLimit} onChange={setRateLimit} placeholder="1000" />
          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Applies to all outbound webhook and integration API calls.</p>
        </div>
      </div>
      <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} saved={saved} />
    </div>
  );
}

// ── Section map ──────────────────────────────────────────────
const SECTION_COMPONENTS: Record<string, React.FC> = {
  profile:      ProfileSection,
  stress:       StressSection,
  alerts:       AlertsSection,
  integrations: IntegrationsSection,
  preferences:  PreferencesSection,
  roles:        RolesSection,
  warroom:      WarRoomSection,
  system:       SystemSection,
};

// ── Main Page ────────────────────────────────────────────────
export default function SettingsPage() {
  const [active, setActive] = useState('profile');
  const ActiveSection = SECTION_COMPONENTS[active] ?? ProfileSection;

  return (
    <div className="animate-fade-in" style={{ minHeight: '100%' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="text-page-title text-[#0F172A]">Settings</h1>
        <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
          Manage your business configuration, integrations, and preferences.
        </p>
      </div>

      {/* Two-pane layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ── Left sidebar nav ── */}
        <div
          className="ops-card-flat"
          style={{ padding: '10px 8px', position: 'sticky', top: 20 }}
        >
          <p style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '6px 10px 10px' }}>
            Settings
          </p>
          {SECTIONS.map((s) => {
            const SIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`navItem ${active === s.id ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', marginBottom: 2 }}
              >
                <SIcon size={14} />
                <span style={{ fontSize: 13, lineHeight: 1.3 }}>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Right content panel ── */}
        <div className="ops-card" style={{ minHeight: 400 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <ActiveSection />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
