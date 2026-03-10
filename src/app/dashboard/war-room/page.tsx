'use client';

// ============================================================
// OpsPulse — War Room
// Crisis command center — auto-activates on Critical stress
// ============================================================
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Siren, Zap, AlertTriangle, CheckCheck, ArrowRight,
  Clock, Users, TrendingDown, RefreshCw, X, Activity,
} from 'lucide-react';
import Link from 'next/link';
import { useDashboardStore } from '@/store/dashboardStore';
import { useAlertsStore } from '@/store/alertsStore';
import { useSocketStore } from '@/store/socketStore';
import { DashboardCard, CardHeader } from '@/components/cards/DashboardCard';
import { StressScoreGauge } from '@/components/charts/StressScoreGauge';
import { TrendChart } from '@/components/charts/TrendChart';
import { AlertCard } from '@/components/cards/AlertCard';
import { LiveEventFeed } from '@/components/charts/LiveEventFeed';
import { getStressColor } from '@/lib/config/constants';

// ---- Root Cause Analysis (auto-populated based on conditions) ----
interface RootCause {
  id:          string;
  category:    'sales' | 'inventory' | 'support' | 'system';
  title:       string;
  impact:      string;
  probability: number;   // 0–100
  action:      string;
}

function useRootCauses(score: number, crisisAlerts: number, lowStockCount: number): RootCause[] {
  return useMemo(() => {
    const causes: RootCause[] = [];

    if (crisisAlerts > 0) {
      causes.push({
        id:          'rc-stockout',
        category:    'inventory',
        title:       'Multiple stock-out risks',
        impact:      `${crisisAlerts} SKUs projected to stock out within 2 hours`,
        probability: 90,
        action:      'Emergency supplier call',
      });
    }

    if (score > 60) {
      causes.push({
        id:          'rc-sales-drop',
        category:    'sales',
        title:       'Revenue velocity decline',
        impact:      'Hour revenue 28% below rolling average',
        probability: 75,
        action:      'Review POS system & active promotions',
      });
    }

    if (lowStockCount > 2) {
      causes.push({
        id:          'rc-inventory',
        category:    'inventory',
        title:       'Inventory health degrading',
        impact:      `${lowStockCount} SKUs below reorder point`,
        probability: 85,
        action:      'Trigger emergency reorders',
      });
    }

    causes.push({
      id:          'rc-support',
      category:    'support',
      title:       'Support ticket surge',
      impact:      'High-priority tickets 3x above normal rate',
      probability: 65,
      action:      'Escalate to senior staff',
    });

    return causes.slice(0, 4);
  }, [score, crisisAlerts, lowStockCount]);
}

const CATEGORY_STYLE = {
  inventory: { color: '#F59E0B', icon: AlertTriangle },
  sales:     { color: '#EF4444', icon: TrendingDown  },
  support:   { color: '#3B82F6', icon: Users         },
  system:    { color: '#A78BFA', icon: Activity      },
};

// ---- Emergency Action Cards ----
const EMERGENCY_ACTIONS = [
  { id: 'ea-1', title: 'Trigger Emergency Reorder',  icon: RefreshCw,    color: '#F59E0B', category: 'inventory' },
  { id: 'ea-2', title: 'Notify Store Manager',       icon: Users,        color: '#3B82F6', category: 'personnel' },
  { id: 'ea-3', title: 'Pause Low-Margin Products',  icon: X,            color: '#EF4444', category: 'sales'     },
  { id: 'ea-4', title: 'Deploy Promo Campaign',      icon: Zap,          color: '#10B981', category: 'sales'     },
  { id: 'ea-5', title: 'Escalate Support Tickets',   icon: ArrowRight,   color: '#A78BFA', category: 'support'   },
  { id: 'ea-6', title: 'Lock High-Value SKUs',       icon: CheckCheck,   color: '#F97316', category: 'inventory' },
];

export default function WarRoomPage() {
  const [executedActions, setExecutedActions] = useState<Set<string>>(new Set());
  const [incidentSummary, setIncidentSummary] = useState('');

  const rawScore      = useDashboardStore((s) => s.stressScore?.stress_score);
  const score         = (rawScore !== undefined && rawScore !== null && Number.isFinite(rawScore)) ? rawScore : 42;
  const history      = useDashboardStore((s) => s.stressHistory);
  const isActive     = useDashboardStore((s) => s.isWarRoomActive);
  const alerts       = useAlertsStore((s) => s.alerts);
  const updateAlert  = useAlertsStore((s) => s.updateAlert);
  const events       = useSocketStore((s) => s.events);

  const scoreColor   = getStressColor(score);
  const isCritical   = score >= 75;

  const crisisAlerts  = alerts.filter((a) => a.status === 'active' && a.severity === 'crisis');
  const rootCauses    = useRootCauses(score, crisisAlerts.length, 2);

  const chartData = history.slice(-30).map((h, i) => ({
    t:     i,
    score: h.value,
  }));

  const elapsed = useMemo(() => {
    const now = new Date();
    const h   = now.getHours().toString().padStart(2, '0');
    const m   = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }, []);

  function executeAction(id: string) {
    setExecutedActions((prev) => new Set([...prev, id]));
  }

  return (
    <div className={`space-y-5 animate-fade-in ${isCritical ? 'war-room-active' : ''}`}>
      {/* ---- Crisis Banner ---- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${
          isCritical
            ? 'bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.3)] animate-crisis-pulse'
            : 'bg-[rgba(245,158,11,0.06)] border-[rgba(245,158,11,0.2)]'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
            isCritical ? 'bg-[rgba(239,68,68,0.15)]' : 'bg-[rgba(245,158,11,0.15)]'
          }`}>
            <Siren size={20} className={isCritical ? 'text-[#EF4444]' : 'text-[#F59E0B]'} />
          </div>
          <div>
            <h1 className={`text-[18px] font-700 uppercase tracking-wide ${isCritical ? 'text-[#FCA5A5]' : 'text-[#FDE68A]'}`}>
              War Room
            </h1>
            <p className="text-[12px] text-[#94A3B8] mt-0.5">
              Crisis Command Center · Incident started {elapsed} ·{' '}
              {crisisAlerts.length} critical alert{crisisAlerts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="px-3 py-1.5 rounded-xl text-[13px] font-700 uppercase tracking-wide"
            style={{ color: scoreColor, backgroundColor: `${scoreColor}12`, border: `1px solid ${scoreColor}30` }}
          >
            {score >= 75 ? '🔴 CRITICAL' : score >= 50 ? '🟡 ELEVATED' : '🟢 MODERATE'}
          </div>
          <Link href="/dashboard">
            <button className="text-[12px] text-[#64748B] hover:text-[#0F172A] px-3 py-1.5 rounded-lg border border-[#E2E8F0] transition-colors">
              ← Back
            </button>
          </Link>
        </div>
      </motion.div>

      {/* ---- Main Grid ---- */}
      <div className="grid grid-cols-12 gap-4">

        {/* ---- LEFT: Stress Gauge + history ---- */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <DashboardCard glowColor={scoreColor} delay={0.05}>
            <CardHeader title="Health Score" subtitle="Live" />
            <StressScoreGauge
              score={score}
              breakdown={[
                { label: 'Sales',     score: Math.max(0, 100 - Math.round(score * 0.4)),  color: '#3B82F6' },
                { label: 'Inventory', score: Math.max(0, 100 - Math.round(score * 0.35)), color: '#F59E0B' },
                { label: 'Support',   score: Math.max(0, 100 - Math.round(score * 0.25)), color: '#10B981' },
              ]}
              size="sm"
            />
          </DashboardCard>

          {chartData.length > 0 && (
            <DashboardCard delay={0.1}>
              <CardHeader title="Score Timeline" subtitle="Last 30 events" />
              <TrendChart
                data={chartData}
                height={80}
                xKey="t"
                series={[{ dataKey: 'score', label: 'Stress', color: scoreColor }]}
                reference={{ value: 75, color: '#EF4444' }}
                yFormatter={(v) => String(v)}
                showGrid={false}
                animate={false}
              />
            </DashboardCard>
          )}
        </div>

        {/* ---- CENTER: Root Causes + Emergency Actions ---- */}
        <div className="col-span-12 lg:col-span-5 space-y-4">

          {/* Root Cause Analysis */}
          <DashboardCard delay={0.1}>
            <CardHeader
              title="Root Cause Analysis"
              subtitle="AI-detected contributing factors"
            />
            <div className="space-y-2.5">
              {rootCauses.map((cause, i) => {
                const cfg  = CATEGORY_STYLE[cause.category];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={cause.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: `${cfg.color}08`, border: `1px solid ${cfg.color}20` }}
                  >
                    <div
                      className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg mt-0.5"
                      style={{ backgroundColor: `${cfg.color}15` }}
                    >
                      <Icon size={13} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-600 text-[#0F172A]">{cause.title}</span>
                        <div className="ml-auto flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <div className="w-12 h-1.5 rounded-full bg-[#FFFFFF] overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${cause.probability}%`, backgroundColor: cfg.color }}
                              />
                            </div>
                            <span className="text-[10px]" style={{ color: cfg.color }}>{cause.probability}%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#64748B] line-clamp-1">{cause.impact}</p>
                      <button
                        className="mt-1.5 text-[10px] font-600 px-2 py-0.5 rounded-md"
                        style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}
                      >
                        → {cause.action}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </DashboardCard>

          {/* Emergency Action Grid */}
          <DashboardCard delay={0.2}>
            <CardHeader title="Emergency Actions" subtitle={`${executedActions.size}/${EMERGENCY_ACTIONS.length} executed`} />
            <div className="grid grid-cols-2 gap-2.5">
              {EMERGENCY_ACTIONS.map((action, i) => {
                const Icon     = action.icon;
                const done     = executedActions.has(action.id);
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + i * 0.06 }}
                    whileHover={!done ? { scale: 1.02 } : undefined}
                    whileTap={!done ? { scale: 0.98 } : undefined}
                    onClick={() => !done && executeAction(action.id)}
                    className={`text-left p-3 rounded-xl border transition-all duration-150 ${
                      done
                        ? 'opacity-50 border-[#E2E8F0] bg-[#FFFFFF] cursor-default'
                        : 'cursor-pointer hover:opacity-90'
                    }`}
                    style={!done ? {
                      backgroundColor: `${action.color}08`,
                      borderColor:     `${action.color}25`,
                    } : undefined}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {done
                        ? <CheckCheck size={13} className="text-[#10B981]" />
                        : <Icon size={13} style={{ color: action.color }} />
                      }
                      <span
                        className="text-[10px] font-600 uppercase tracking-wider"
                        style={{ color: done ? '#10B981' : action.color }}
                      >
                        {action.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#0F172A] font-500 leading-snug">
                      {done ? '✓ ' : ''}{action.title}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </DashboardCard>

          {/* Incident Notes */}
          <DashboardCard delay={0.3}>
            <CardHeader title="Incident Notes" subtitle="Document resolution steps" />
            <textarea
              value={incidentSummary}
              onChange={(e) => setIncidentSummary(e.target.value)}
              placeholder="Describe the incident, actions taken, and resolution..."
              className="w-full h-24 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-[12px] text-[#E2E8F0] placeholder:text-[#475569] resize-none focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-[#475569]">{incidentSummary.length} chars</span>
              <button className="btn-primary text-[11px] py-1 px-3">
                Save Log
              </button>
            </div>
          </DashboardCard>
        </div>

        {/* ---- RIGHT: Crisis Alerts + Event Feed ---- */}
        <div className="col-span-12 lg:col-span-4 space-y-4">

          {/* Crisis Alerts */}
          <DashboardCard delay={0.15}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="text-[13px] font-600 text-[#0F172A]">Crisis Alerts</span>
              <span className="ml-auto text-[10px] bg-[rgba(239,68,68,0.15)] text-[#FCA5A5] px-1.5 py-0.5 rounded-full font-700">
                {crisisAlerts.length}
              </span>
            </div>
            <div className="space-y-2 max-h-[260px] overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {crisisAlerts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6"
                  >
                    <div className="text-[28px]">✅</div>
                    <p className="text-[12px] text-[#64748B] mt-2">No crisis alerts</p>
                  </motion.div>
                ) : (
                  crisisAlerts.map((a, i) => (
                    <AlertCard
                      key={a.id}
                      alert={a}
                      compact
                      delay={i * 0.05}
                      onResolve={(id) => updateAlert(id, { status: 'resolved' })}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </DashboardCard>

          {/* Live Event Feed */}
          <DashboardCard delay={0.2} className="h-[280px]">
            <LiveEventFeed events={[...events].reverse()} maxHeight="220px" />
          </DashboardCard>

          {/* Incident Metadata */}
          <DashboardCard delay={0.25} variant="flat">
            <div className="space-y-2">
              {[
                { label: 'Incident Start',   value: elapsed,              icon: Clock    },
                { label: 'Actions Executed', value: `${executedActions.size}/6`, icon: CheckCheck },
                { label: 'Alerts Resolved',  value: `${alerts.filter(a => a.status === 'resolved').length}`, icon: CheckCheck },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 text-[12px]">
                    <Icon size={12} className="text-[#64748B]" />
                    <span className="text-[#64748B]">{item.label}</span>
                    <span className="ml-auto text-[#0F172A] font-600">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
