'use client';

// ============================================================
// OpsPulse — Operations Manager View
// 3-column layout: Alert Queue | KPI Tables | Live Event Feed
// ============================================================
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Package, ShoppingCart, Headphones,
  Filter, RefreshCw, ChevronUp, ChevronDown, ArrowRight,
  TrendingDown, TrendingUp, Clock, Zap,
} from 'lucide-react';
import { useAlertsStore } from '@/store/alertsStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { useSocketStore } from '@/store/socketStore';
import { AlertCard } from '@/components/cards/AlertCard';
import { LiveEventFeed } from '@/components/charts/LiveEventFeed';
import { TrendChart } from '@/components/charts/TrendChart';
import { DashboardCard, CardHeader } from '@/components/cards/DashboardCard';
import { getStressColor } from '@/lib/config/constants';
import { cn } from '@/lib/utils';

// ---- Inventory mock (would come from API in production) ----
const INVENTORY_TABLE = [
  { sku: 'SKU-1001', name: 'Gaming Laptop X1',   stock: 15, reorder: 10, status: 'low'      },
  { sku: 'SKU-1002', name: 'Wireless Headset Z',  stock: 45, reorder: 15, status: 'ok'       },
  { sku: 'SKU-1003', name: 'Mechanical Keyboard', stock: 30, reorder: 20, status: 'ok'       },
  { sku: 'SKU-1004', name: 'UltraWide Monitor',   stock: 8,  reorder: 10, status: 'critical' },
  { sku: 'SKU-1005', name: 'Ergonomic Mouse',     stock: 100,reorder:  5, status: 'ok'       },
];

const STOCK_STATUS = {
  ok:       { color: '#10B981', label: 'OK',       bg: 'rgba(16,185,129,0.1)'   },
  low:      { color: '#F59E0B', label: 'Low',      bg: 'rgba(245,158,11,0.12)'  },
  critical: { color: '#EF4444', label: 'Critical', bg: 'rgba(239,68,68,0.12)'   },
};

type AlertFilter = 'all' | 'crisis' | 'anomaly' | 'opportunity';

export default function OperationsPage() {
  const [alertFilter, setAlertFilter] = useState<AlertFilter>('all');
  const [sortStock, setSortStock]     = useState<'asc' | 'desc'>('asc');

  const alerts       = useAlertsStore((s) => s.alerts);
  const updateAlert  = useAlertsStore((s) => s.updateAlert);
  const rawScore      = useDashboardStore((s) => s.stressScore?.stress_score);
  const score         = (rawScore !== undefined && rawScore !== null && Number.isFinite(rawScore)) ? rawScore : 42;
  const history      = useDashboardStore((s) => s.stressHistory);
  const events       = useSocketStore((s) => s.events);

  const scoreColor = getStressColor(score);

  // Filtered + sorted alerts
  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((a) => a.status === 'active')
      .filter((a) => alertFilter === 'all' || a.severity === alertFilter)
      .sort((a, b) => {
        const order = { crisis: 0, anomaly: 1, warning: 2, opportunity: 3, info: 4 };
        return (order[a.severity] ?? 5) - (order[b.severity] ?? 5);
      });
  }, [alerts, alertFilter]);

  // Sorted inventory
  const sortedInventory = useMemo(() => {
    return [...INVENTORY_TABLE].sort((a, b) =>
      sortStock === 'asc' ? a.stock - b.stock : b.stock - a.stock,
    );
  }, [sortStock]);

  // Stress history chart data
  const chartData = useMemo(() =>
    history.slice(-20).map((h, i) => ({
      t:     i,
      score: h.value,
    })),
  [history]);

  const crisisCount  = alerts.filter((a) => a.status === 'active' && a.severity === 'crisis').length;
  const anomalyCount = alerts.filter((a) => a.status === 'active' && a.severity === 'anomaly').length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-[#0F172A]">Operations</h1>
          <p className="text-[12px] text-[#64748B] mt-1 flex items-center gap-1.5">
            <Clock size={11} />
            Operations Manager View · STORE-01
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Score pill */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border"
            style={{ color: scoreColor, borderColor: `${scoreColor}30`, backgroundColor: `${scoreColor}10` }}
          >
            <span className="text-[12px] font-500">Stress</span>
            <span className="text-[18px] font-700">{score}</span>
          </div>
        </div>
      </div>

      {/* ---- Stress History sparkline (compact) ---- */}
      {chartData.length > 0 && (
        <DashboardCard delay={0} className="py-3">
          <div className="flex items-center gap-3 mb-2">
            <Zap size={13} className="text-[#F59E0B]" />
            <span className="text-[12px] font-600 text-[#0F172A]">Live Stress Trend</span>
            <span className="ml-auto text-[11px]" style={{ color: scoreColor }}>{score}/100</span>
          </div>
          <TrendChart
            data={chartData}
            height={60}
            xKey="t"
            series={[{ dataKey: 'score', label: 'Score', color: scoreColor, area: true }]}
            reference={{ value: 75, color: '#EF4444' }}
            yFormatter={(v) => String(v)}
            showGrid={false}
            animate={false}
          />
        </DashboardCard>
      )}

      {/* ---- 3-Column Grid ---- */}
      {/* reverted spacing to 24px gutter (gap-6); removed fixed minHeight to let content flow naturally */}
      <div className="grid grid-cols-12 gap-6">

        {/* ---- LEFT: Alert Queue ---- */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
          <DashboardCard delay={0.05} className="flex-1 flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={14} className="text-[#F59E0B]" />
              <span className="text-[13px] font-600 text-[#0F172A]">Alert Queue</span>
              <span className="ml-auto text-[10px] bg-[rgba(239,68,68,0.15)] text-[#FCA5A5] px-1.5 py-0.5 rounded-full font-700">
                {filteredAlerts.length}
              </span>
            </div>

            {/* Severity summary pills */}
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {crisisCount > 0 && (
                <span className="badge-crisis text-[10px] px-2 py-0.5">{crisisCount} Crisis</span>
              )}
              {anomalyCount > 0 && (
                <span className="badge-warning text-[10px] px-2 py-0.5">{anomalyCount} Anomaly</span>
              )}
              {crisisCount === 0 && anomalyCount === 0 && (
                <span className="badge-healthy text-[10px] px-2 py-0.5">All clear</span>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 flex-wrap">
              {(['all', 'crisis', 'anomaly', 'opportunity'] as AlertFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setAlertFilter(f)}
                  className={cn('filterChip', alertFilter === f && 'active')}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Alert list */}
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar min-h-0">
              <AnimatePresence>
                {filteredAlerts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-[24px] mb-2">✅</div>
                    <p className="text-[12px] text-[#64748B]">No alerts</p>
                  </motion.div>
                ) : (
                  filteredAlerts.map((alert, i) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      compact
                      delay={i * 0.03}
                      onResolve={(id) => updateAlert(id, { status: 'resolved' })}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </DashboardCard>
        </div>

        {/* ---- CENTER: KPI / Inventory Tables ---- */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
          {/* Sales Summary quick cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Revenue/hr',   value: '₹28,500', trend: 'up',   icon: ShoppingCart,  color: '#3B82F6' },
              { label: 'Tickets open', value: '12',       trend: 'down', icon: Headphones,    color: '#EF4444' },
              { label: 'SKUs at risk', value: '2',        trend: 'up',   icon: Package,       color: '#F59E0B' },
            ].map((item, i) => {
              const Icon = item.icon;
              const Trend = item.trend === 'up' ? TrendingUp : TrendingDown;
              return (
                <DashboardCard key={item.label} variant="flat" delay={0.1 + i * 0.05}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon size={12} style={{ color: item.color }} />
                    <span className="text-[10px] text-[#64748B] font-500 uppercase tracking-wider">{item.label}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-[22px] font-700 text-[#0F172A]">{item.value}</span>
                    <Trend size={14} style={{ color: item.trend === 'up' ? '#EF4444' : '#10B981' }} />
                  </div>
                </DashboardCard>
              );
            })}
          </div>

          {/* Inventory Table */}
          <DashboardCard className="flex-1" delay={0.15}>
            <div className="flex items-center gap-2 mb-4">
              <Package size={14} className="text-[#F59E0B]" />
              <span className="text-[13px] font-600 text-[#0F172A]">Inventory Status</span>
              <button
                onClick={() => setSortStock(sortStock === 'asc' ? 'desc' : 'asc')}
                className="ml-auto flex items-center gap-1 text-[11px] text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                <Filter size={11} />
                Stock {sortStock === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    {['SKU', 'Product', 'On Hand', 'Reorder', 'Status'].map((col) => (
                      <th key={col} className="pb-2 text-[10px] font-600 text-[#475569] uppercase tracking-wider pr-3">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {sortedInventory.map((item, i) => {
                    const s = STOCK_STATUS[item.status as keyof typeof STOCK_STATUS];
                    return (
                      <motion.tr
                        key={item.sku}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                      >
                        <td className="py-2.5 pr-3 text-[12px] font-600 text-[#64748B]">{item.sku}</td>
                        <td className="py-2.5 pr-3 text-[12px] text-[#334155] truncate max-w-[120px]">{item.name}</td>
                        <td className="py-2.5 pr-3 text-[13px] font-700 text-[#0F172A] tabular-nums">{item.stock}</td>
                        <td className="py-2.5 pr-3 text-[12px] text-[#64748B] tabular-nums">{item.reorder}</td>
                        <td className="py-2.5">
                          <span
                            className="text-[10px] font-700 uppercase px-2 py-0.5 rounded-full"
                            style={{ color: s.color, backgroundColor: s.bg }}
                          >
                            {s.label}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DashboardCard>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Trigger Reorder',     icon: RefreshCw,   color: '#3B82F6' },
              { label: 'Assign Support Shift', icon: ArrowRight, color: '#10B981' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="actionBtn"
                  style={{
                    borderColor:     `${action.color}35`,
                    backgroundColor: `${action.color}10`,
                    color:           action.color,
                  }}
                >
                  <Icon size={13} />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- RIGHT: Live Event Feed ---- */}
        <div className="col-span-12 lg:col-span-3">
          <DashboardCard delay={0.2} className="h-full">
            <LiveEventFeed
              events={[...events].reverse()}
              maxHeight="560px"
            />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
