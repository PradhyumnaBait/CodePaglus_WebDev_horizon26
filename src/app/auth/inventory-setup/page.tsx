'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const D = {
  text: '#0F172A', textSec: '#334155', textMut: '#64748B', textFaint: '#94A3B8',
  border: '#E2E8F0', blue: '#2563EB', surface: '#FFFFFF', surfaceAlt: '#F8FAFC',
  success: '#22C55E', critical: '#EF4444',
  gradPrimary: 'linear-gradient(120deg,#2563EB 0%,#3B82F6 100%)',
  shadowBlue: '0 4px 20px rgba(37,99,235,0.25)',
  shadowCard: '0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)',
};

const CheckSVG = ({ color = 'white' }: { color?: string }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ActivitySVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const PlusSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const XSVGGray = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const PackageSVG = ({ color = '#2563EB' }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);
const UploadSVG = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 10px', display: 'block' }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const LinkSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const CATS = ['Electronics', 'Accessories', 'Peripherals', 'Clothing', 'Food & Beverage', 'Beauty', 'Sports', 'Other'];

const TABS = ['Manual Entry', 'Upload Files', 'Integrations'];

const fmtRs = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}k` : `₹${n}`;

interface Product { id: number; name: string; sku: string; category: string; sellPrice: number; basePrice: number; stock: number; }

const STEPS = ['Sign Up', 'Verify', 'Business', 'Inventory'];

function StepProgress({ activeIdx }: { activeIdx: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 26 }}>
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
                boxShadow: active ? D.shadowBlue : 'none',
              }}>
                {done ? <CheckSVG /> : i + 1}
              </div>
              <span style={{ fontSize: 10.5, color: active ? D.blue : D.textFaint, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 36, height: 2, background: i < activeIdx ? D.blue : D.border, margin: '0 4px', marginBottom: 16 }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function InventorySetupPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  // Stable individual field state
  const [fn,  setFn]  = useState('');
  const [fsk, setFsk] = useState('');
  const [fc,  setFc]  = useState('Electronics');
  const [fsp, setFsp] = useState('');
  const [fbp, setFbp] = useState('');
  const [fst, setFst] = useState('');

  const [uploadDone, setUploadDone] = useState<Record<string, boolean>>({});

  const margin = useMemo(() => {
    const s = +fsp, b = +fbp;
    return s > 0 ? Math.max(0, Math.round(((s - b) / s) * 100)) : null;
  }, [fsp, fbp]);

  const addProduct = useCallback(() => {
    if (!fn.trim() || !fsp || !fbp) return;
    setProducts(prev => [...prev, { id: Date.now(), name: fn.trim(), sku: fsk || `SKU-${Date.now()}`, category: fc, sellPrice: +fsp, basePrice: +fbp, stock: +fst || 0 }]);
    setFn(''); setFsk(''); setFc('Electronics'); setFsp(''); setFbp(''); setFst('');
  }, [fn, fsk, fc, fsp, fbp, fst]);

  const launchDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%,#EAF4FF,#F6F8FB 70%)', padding: '30px 20px', overflowY: 'auto' }}>
      <div className="aScale" style={{ background: D.surface, borderRadius: 16, padding: '32px 36px', maxWidth: 800, margin: '0 auto', boxShadow: '0 20px 60px rgba(15,23,42,0.10)', border: `1px solid ${D.border}` }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: D.gradPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: D.shadowBlue }}>
            <ActivitySVG />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: D.text, fontFamily: "'Inter'", letterSpacing: '-0.03em', marginBottom: 4 }}>Set Up Inventory</h2>
          <p style={{ fontSize: 13, color: D.textMut }}>Add products, upload data, or connect your platforms</p>
        </div>

        <StepProgress activeIdx={3} />

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: D.surfaceAlt, borderRadius: 10, padding: 4 }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: activeTab === i ? 600 : 500,
                background: activeTab === i ? D.surface : 'transparent',
                color: activeTab === i ? D.text : D.textMut,
                boxShadow: activeTab === i ? D.shadowCard : 'none',
                transition: 'all 0.18s',
                fontFamily: "'Inter'",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab 0: Manual Entry ── */}
        {activeTab === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Form */}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: D.text, marginBottom: 14 }}>Product Details</p>
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Name *</label>
                  <input value={fn} onChange={e => setFn(e.target.value)} placeholder="e.g. Wireless Headphones" className="inputField" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SKU</label>
                    <input value={fsk} onChange={e => setFsk(e.target.value)} placeholder="WH-001" className="inputField" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
                    <select value={fc} onChange={e => setFc(e.target.value)} className="inputField" style={{ appearance: 'none', cursor: 'pointer' }}>
                      {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sell ₹ *</label>
                    <input type="number" value={fsp} onChange={e => setFsp(e.target.value)} placeholder="2999" className="inputField" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cost ₹ *</label>
                    <input type="number" value={fbp} onChange={e => setFbp(e.target.value)} placeholder="1400" className="inputField" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock</label>
                    <input type="number" value={fst} onChange={e => setFst(e.target.value)} placeholder="0" className="inputField" />
                  </div>
                </div>

                {/* Margin preview */}
                {margin !== null && (
                  <div style={{ background: D.success + '08', border: `1px solid ${D.success}22`, borderRadius: 9, padding: '11px 14px', display: 'flex', gap: 24 }}>
                    <div>
                      <p style={{ fontSize: 11.5, color: D.textMut }}>Gross Margin</p>
                      <p style={{ fontSize: 20, fontWeight: 700, color: D.success, fontFamily: "'Inter'", letterSpacing: '-0.03em' }}>{margin}%</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11.5, color: D.textMut }}>Profit / Unit</p>
                      <p style={{ fontSize: 20, fontWeight: 700, color: D.success, fontFamily: "'Inter'", letterSpacing: '-0.03em' }}>₹{Math.max(0, (+fsp) - (+fbp))}</p>
                    </div>
                  </div>
                )}

                <button onClick={addProduct} disabled={!fn.trim() || !fsp || !fbp} className="btnPrimary" style={{ width: '100%', justifyContent: 'center', padding: 11 }}>
                  <PlusSVG /> Add Product
                </button>
              </div>
            </div>

            {/* Products list */}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: D.text, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Products Added
                {products.length > 0 && <span style={{ background: D.blue + '15', color: D.blue, fontSize: 11.5, padding: '2px 9px', borderRadius: 20, fontWeight: 600 }}>{products.length}</span>}
              </p>

              {products.length === 0 ? (
                <div style={{ border: `1.5px dashed ${D.border}`, borderRadius: 12, padding: '28px 20px', textAlign: 'center' }}>
                  <PackageSVG color={D.textFaint} />
                  <p style={{ fontSize: 13.5, color: D.textFaint, marginTop: 10 }}>Add your first product</p>
                  <p style={{ fontSize: 12, color: D.textFaint, marginTop: 4 }}>You can also skip and add products later</p>
                </div>
              ) : (
                <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {products.map(p => {
                    const m = p.sellPrice > 0 ? Math.round(((p.sellPrice - p.basePrice) / p.sellPrice) * 100) : 0;
                    return (
                      <div key={p.id} style={{ background: D.surfaceAlt, border: `1px solid ${D.border}`, borderRadius: 10, padding: '11px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: D.blue + '10', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <PackageSVG />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: D.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                          <p style={{ fontSize: 12, color: D.textMut, marginTop: 2 }}>₹{p.sellPrice.toLocaleString()} · {p.stock} units · {m}% margin</p>
                        </div>
                        <button onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: D.textFaint, padding: 4 }}>
                          <XSVGGray />
                        </button>
                      </div>
                    );
                  })}

                  {/* Summary */}
                  <div style={{ marginTop: 4, background: D.surfaceAlt, border: `1px solid ${D.border}`, borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ fontSize: 11.5, fontWeight: 600, color: D.textMut, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>Summary</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        ['Products', products.length],
                        ['Total Stock', products.reduce((s, p) => s + p.stock, 0)],
                        ['Stock Value', fmtRs(products.reduce((s, p) => s + p.basePrice * p.stock, 0))],
                        ['Avg Margin', `${Math.round(products.reduce((s, p) => s + (p.sellPrice > 0 ? Math.round(((p.sellPrice - p.basePrice) / p.sellPrice) * 100) : 0), 0) / products.length)}%`],
                      ].map(([l, v]) => (
                        <div key={String(l)}>
                          <p style={{ fontSize: 11.5, color: D.textFaint }}>{l}</p>
                          <p style={{ fontSize: 15, fontWeight: 700, color: D.text, fontFamily: "'Inter'", letterSpacing: '-0.02em' }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab 1: Upload Files ── */}
        {activeTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Sales Data', desc: 'Upload your historical sales records (CSV/Excel)', key: 'sales' },
              { label: 'Inventory Data', desc: 'Upload your current inventory list (CSV/Excel)', key: 'inventory' },
              { label: 'Cash Flow Data', desc: 'Upload income and expense records (CSV/Excel)', key: 'cash' },
            ].map(item => (
              <div key={item.key} style={{ border: `1.5px dashed ${uploadDone[item.key] ? D.success : D.border}`, borderRadius: 12, padding: '22px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.18s', background: uploadDone[item.key] ? D.success + '06' : 'transparent' }}
                onClick={() => setUploadDone(prev => ({ ...prev, [item.key]: true }))}>
                {uploadDone[item.key] ? (
                  <>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: D.success + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <CheckSVG color={D.success} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: D.success }}>{item.label} uploaded</p>
                  </>
                ) : (<>
                  <UploadSVG />
                  <p style={{ fontSize: 14, fontWeight: 600, color: D.text, marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 12.5, color: D.textMut, marginBottom: 12 }}>{item.desc}</p>
                  <span style={{ display: 'inline-block', background: D.blue + '10', color: D.blue, border: `1px solid ${D.blue}25`, borderRadius: 8, padding: '6px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Click to upload
                  </span>
                </>)}
              </div>
            ))}
          </div>
        )}

        {/* ── Tab 2: Integrations ── */}
        {activeTab === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { name: 'Shopify', desc: 'Sync products, orders & inventory', color: '#96BF48' },
              { name: 'WooCommerce', desc: 'Import WordPress store data', color: '#7F54B3' },
              { name: 'Amazon Seller', desc: 'Fetch marketplace sales data', color: '#FF9900' },
              { name: 'Razorpay', desc: 'Import payment & transaction data', color: '#3395FF' },
            ].map(p => (
              <div key={p.name} style={{ background: D.surfaceAlt, border: `1px solid ${D.border}`, borderRadius: 12, padding: '18px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: p.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LinkSVG />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: D.text }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: D.textMut }}>{p.desc}</p>
                  </div>
                </div>
                <button className="btnSecondary" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '8px 12px' }}>
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${D.border}`, marginTop: 24, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: 13, color: D.textFaint }}>
            {products.length === 0 ? 'You can skip and add products later from the dashboard.' : `${products.length} product${products.length > 1 ? 's' : ''} ready.`}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {products.length === 0 && (
              <button onClick={launchDashboard} className="btnSecondary" style={{ fontSize: 13.5 }}>Skip for now</button>
            )}
            <button onClick={launchDashboard} className="btnPrimary" style={{ padding: '11px 24px', fontSize: 14 }}>
              {products.length > 0 ? `Launch Dashboard (${products.length} products)` : 'Launch Dashboard'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
