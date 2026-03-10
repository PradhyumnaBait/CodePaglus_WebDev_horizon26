'use client';

// ============================================================
// OpsPulse — KPIStatCard  (TASK 1: uniform height + centered)
// CHANGE: Added minHeight so all 3 cards are identical height.
// CHANGE: Wrapped value/trend in a fixed-height center block.
// CHANGE: Added overflow/ellipsis to title to prevent blowout.
// CHANGE: Improved typography weight and spacing.
// ============================================================
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import type { ComponentType } from 'react';

export interface KPIStatCardProps {
  title:        string;
  value:        string | number;
  unit?:        string;
  trend?:       number;
  trendLabel?:  string;
  sparkline?:   number[];
  icon:         ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color:        string;
  status?:      'healthy' | 'warning' | 'crisis' | 'neutral';
  delay?:       number;
  className?:   string;
}

const STATUS_STYLE = {
  healthy: 'border-[rgba(16,185,129,0.20)]',
  warning: 'border-[rgba(245,158,11,0.22)]',
  crisis:  'border-[rgba(239,68,68,0.22)] animate-crisis-pulse',
  neutral: 'border-[#E2E8F0]',
};

export function KPIStatCard({
  title,
  value,
  unit,
  trend,
  trendLabel = 'vs yesterday',
  sparkline  = [],
  icon: Icon,
  color,
  status     = 'neutral',
  delay      = 0,
  className,
}: KPIStatCardProps) {
  const hasTrend  = trend !== undefined && trend !== null;
  const isUp      = hasTrend && trend! >= 0;
  const isFlat    = hasTrend && trend! === 0;
  const TrendIcon = isFlat ? Minus : isUp ? ArrowUpRight : ArrowDownRight;
  const trendColor = isFlat ? '#64748B' : isUp ? '#10B981' : '#EF4444';
  const sparkData  = sparkline.map((v, i) => ({ v, i }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className={cn(
        // TASK 1: unified min-height (160px) so all 3 cards are the same height.
        // overflow:hidden prevents any content from breaking the boundary.
        'relative rounded-2xl overflow-hidden border',
        'flex flex-col',           // column flex so children stack predictably
        STATUS_STYLE[status],
        className,
      )}
      style={{
        background: '#FFFFFF',
        minHeight: 160,            // ← uniform card height
        padding: '18px 20px',
        boxShadow: '0 1px 3px rgba(15,23,42,0.05), 0 4px 14px rgba(15,23,42,0.05)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(15,23,42,0.10)' } as any}
    >
      {/* Subtle background color wash from the card's accent color */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${color}09, transparent 65%)` }}
      />

      {/* ── Top row: label + icon ── */}
      <div className="flex items-start justify-between relative" style={{ marginBottom: 10 }}>
        {/* TASK 1: truncate long titles so they never wrap and break layout */}
        <p
          className="text-[11px] font-600 uppercase tracking-widest text-[#64748B]"
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}
        >
          {title}
        </p>
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 34, height: 34, backgroundColor: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>

      {/* ── Value block — grows to fill remaining space, centered vertically ── */}
      {/* TASK 1: flex-1 + flex/items-center centers the metric in remaining height */}
      <div className="flex-1 flex flex-col justify-center relative">
        {/* Primary value */}
        <div className="flex items-baseline gap-2" style={{ overflow: 'hidden' }}>
          <motion.span
            key={String(value)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-700 text-[#0F172A] leading-none"
            style={{
              fontSize: 'clamp(20px, 2.5vw, 26px)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {value}
          </motion.span>
          {unit && (
            <span
              className="text-[12px] text-[#64748B]"
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {unit}
            </span>
          )}
        </div>

        {/* Trend badge */}
        {hasTrend && (
          <div className="flex items-center gap-1.5" style={{ marginTop: 8 }}>
            <span
              className="flex items-center gap-0.5 text-[11px] font-600 px-1.5 py-0.5 rounded-md"
              style={{ color: trendColor, backgroundColor: `${trendColor}18` }}
            >
              <TrendIcon size={11} />
              {Math.abs(trend!).toFixed(1)}%
            </span>
            <span
              className="text-[11px] text-[#64748B]"
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {trendLabel}
            </span>
          </div>
        )}
      </div>

      {/* Sparkline — fixed height so it doesn't affect card height */}
      {sparkData.length > 2 && (
        <div style={{ marginTop: 10, height: 40, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={`spark-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={color} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={color} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.6}
                fill={`url(#spark-${title.replace(/\s+/g, '')})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
