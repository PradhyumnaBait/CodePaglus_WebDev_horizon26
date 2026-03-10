'use client';

// ============================================================
// OpsPulse — Owner Dashboard (Live Data)
// Stress Gauge + KPI Cards + Alert Feed + Sales Trend
// ============================================================
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Package, HeadphonesIcon,
  Clock, Zap, BarChart3, TrendingUp, ArrowUpRight,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { useDashboardStore } from '@/store/dashboardStore';
import { useAlertsStore } from '@/store/alertsStore';
import { useSocketStore } from '@/store/socketStore';

import { StressScoreGauge } from '@/components/charts/StressScoreGauge';
import { KPIStatCard } from '@/components/cards/KPIStatCard';
import { AlertCard } from '@/components/cards/AlertCard';
import { TrendChart } from '@/components/charts/TrendChart';
import { LiveEventFeed } from '@/components/charts/LiveEventFeed';
import { DashboardCard, CardHeader } from '@/components/cards/DashboardCard';
import { getStressColor } from '@/lib/config/constants';

export default function DashboardPage() {
  // ---- Store data ----
  const stressScore     = useDashboardStore((s) => s.stressScore);
  const stressHistory   = useDashboardStore((s) => s.stressHistory);
  const isWarRoomActive = useDashboardStore((s) => s.isWarRoomActive);
  const salesMetric     = useDashboardStore((s) => s.salesMetric);

  const alerts          = useAlertsStore((s) => s.alerts);
  const resolveAlert    = useAlertsStore((s) => s.updateAlert);

  const events          = useSocketStore((s) => s.events);
  const socketStatus    = useSocketStore((s) => s.status);

  const rawScore  = stressScore?.stress_score;
  const score      = (rawScore !== undefined && rawScore !== null && Number.isFinite(rawScore)) ? rawScore : 42;
  const scoreColor = getStressColor(score);

  // ---- Stress history chart ----
  const stressChartData = useMemo(() => {
    if (stressHistory.length === 0) {
      // Show placeholder with flat line
      return Array.from({ length: 10 }, (_, i) => ({
        time: `${i}s`,
        score: 42,
      }));
    }
    return stressHistory.slice(-30).map((h, i) => ({
      time:  i === stressHistory.slice(-30).length - 1 ? 'Now' : `${stressHistory.slice(-30).length - 1 - i}s`,
      score: h.value,
    }));
  }, [stressHistory]);

  // ---- Top 5 active alerts ----
  const topAlerts = useMemo(
    () => alerts
      .filter((a) => a.status === 'active')
      .sort((a, b) => {
        const order = { crisis: 0, anomaly: 1, warning: 2, opportunity: 3, info: 4 };
        return (order[a.severity] ?? 5) - (order[b.severity] ?? 5);
      })
      .slice(0, 5),
    [alerts],
  );

  const totalRevenue   = salesMetric?.today_revenue   ?? 0;
  const totalOrders    = salesMetric?.today_orders    ?? 0;
  const avgOrder       = salesMetric?.avg_order_value ?? 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ---- Page Header ---- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-[#F1F5F9]">Dashboard</h1>
          <p className="text-[12px] text-[#64748B] mt-1 flex items-center gap-1.5">
            <Clock size={11} />
            Real-time business health · STORE-01
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/war-room">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={isWarRoomActive
                ? 'btn-danger text-[13px] animate-crisis-pulse'
                : 'btn-secondary text-[13px]'
              }
            >
              <Zap size={13} />
              War Room
            </motion.button>
          </Link>
        </div>
      </div>

      {/* ---- Row 1: Stress Score + KPI Stats ---- */}
      <div className="grid grid-cols-12 gap-5">
        {/* Stress Gauge Card */}
        <DashboardCard
          className="col-span-12 lg:col-span-3"
          glowColor={scoreColor}
          delay={0}
        >
          <CardHeader
            title="Business Health Score"
            subtitle="Real-time stress index"
            action={
              <span className="flex items-center gap-1 text-[11px] text-[#10B981] font-500 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] px-2 py-0.5 rounded-full">
                <span className={socketStatus === 'connected' ? 'w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse inline-block' : 'w-1.5 h-1.5 rounded-full bg-[#EF4444] inline-block'} />
                {socketStatus === 'connected' ? 'Live' : 'Offline'}
              </span>
            }
          />
          <StressScoreGauge
            score={score}
            breakdown={[
              { label: 'Sales',     score: Math.max(0, 100 - Math.round(score * 0.4)), color: '#3B82F6' },
              { label: 'Inventory', score: Math.max(0, 100 - Math.round(score * 0.35)), color: '#F59E0B' },
              { label: 'Support',   score: Math.max(0, 100 - Math.round(score * 0.25)), color: '#10B981' },
            ]}
            size="md"
          />
        </DashboardCard>

        {/* KPI Cards */}
        <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-4">
            <KPIStatCard
              title="Sales Revenue"
              value={totalRevenue > 0 ? `₹${totalRevenue.toLocaleString('en-IN')}` : '—'}
              unit="today"
              trend={14.2}
              trendLabel="vs yesterday"
              sparkline={stressHistory.slice(-10).map((h) => h.value)}
              icon={ShoppingCart}
              color="#3B82F6"
              status={totalRevenue > 0 ? 'healthy' : 'neutral'}
              delay={0.05}
            />
          </div>

          <div className="col-span-12 sm:col-span-4">
            <KPIStatCard
              title="Orders"
              value={totalOrders > 0 ? `${totalOrders}` : '—'}
              unit="transactions"
              trend={-2.1}
              trendLabel="vs last hour"
              icon={Package}
              color="#F59E0B"
              status="warning"
              delay={0.1}
            />
          </div>

          <div className="col-span-12 sm:col-span-4">
            <KPIStatCard
              title="Avg Order Value"
              value={avgOrder > 0 ? `₹${Math.round(avgOrder).toLocaleString('en-IN')}` : '—'}
              unit="per order"
              trend={8.5}
              trendLabel="vs yesterday"
              icon={HeadphonesIcon}
              color="#10B981"
              status="healthy"
              delay={0.15}
            />
          </div>

          {/* Stress History Mini Chart */}
          <DashboardCard className="col-span-12" delay={0.2}>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={14} className="text-[#3B82F6]" />
              <span className="text-[13px] font-600 text-[#F1F5F9]">Stress Score History</span>
              <span
                className="ml-auto text-[13px] font-700"
                style={{ color: scoreColor }}
              >
                {score}/100
              </span>
            </div>
            <TrendChart
              data={stressChartData}
              height={90}
              xKey="time"
              series={[{
                dataKey: 'score',
                label:   'Stress Score',
                color:   scoreColor,
                area:    true,
              }]}
              reference={{ value: 75, label: 'Critical', color: '#EF4444' }}
              yFormatter={(v) => String(v)}
              showGrid={false}
              animate={false}
            />
          </DashboardCard>
        </div>
      </div>

      {/* ---- Row 2: Alerts + Event Feed ---- */}
      <div className="grid grid-cols-12 gap-5">
        {/* Active Alerts */}
        <DashboardCard className="col-span-12 lg:col-span-7" delay={0.25}>
          <CardHeader
            title="Active Alerts"
            subtitle={`${topAlerts.length} requiring attention`}
            action={
              <Link href="/dashboard/alerts">
                <span className="text-[11px] text-[#3B82F6] hover:text-[#60A5FA] transition-colors font-500 cursor-pointer">
                  View all →
                </span>
              </Link>
            }
          />

          <div className="space-y-2">
            <AnimatePresence>
              {topAlerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <div className="text-[32px] mb-2">✅</div>
                  <p className="text-[13px] text-[#64748B]">No active alerts</p>
                  <p className="text-[11px] text-[#475569] mt-1">All systems operating normally</p>
                </motion.div>
              ) : (
                topAlerts.map((alert, i) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    delay={i * 0.05}
                    onResolve={(id) => resolveAlert(id, { status: 'resolved' })}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </DashboardCard>

        {/* Live Event Feed */}
        <DashboardCard className="col-span-12 lg:col-span-5" delay={0.3}>
          <LiveEventFeed events={[...events].reverse()} maxHeight="340px" />
        </DashboardCard>
      </div>

      {/* ---- Row 3: Quick Stats ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',    value: totalRevenue > 0 ? `₹${totalRevenue.toLocaleString('en-IN')}` : '₹0', icon: TrendingUp,    color: '#3B82F6' },
          { label: 'Active Alerts',    value: topAlerts.length,                                                          icon: Zap,           color: '#EF4444' },
          { label: 'Events Today',     value: events.length,                                                              icon: BarChart3,     color: '#A78BFA' },
          { label: 'Health Score',     value: `${score}/100`,                                                             icon: ArrowUpRight,  color: scoreColor },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <DashboardCard key={stat.label} variant="flat" delay={0.35 + i * 0.05}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={13} style={{ color: stat.color }} />
                <span className="text-[11px] text-[#64748B] font-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-[20px] font-700 text-[#F1F5F9]">{stat.value}</p>
            </DashboardCard>
          );
        })}
      </div>
    </div>
  );
}
