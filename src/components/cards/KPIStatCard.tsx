'use client';

// ============================================================
// OpsPulse — KPIStatCard
// Metric card with trend, sparkline, and status color
// ============================================================
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { ComponentType } from 'react';

export interface KPIStatCardProps {
  title:        string;
  value:        string | number;
  unit?:        string;
  trend?:       number;       // positive = up, negative = down
  trendLabel?:  string;       // e.g. "vs yesterday"
  sparkline?:   number[];
  icon:         ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color:        string;       // hex
  status?:      'healthy' | 'warning' | 'crisis' | 'neutral';
  delay?:       number;
  className?:   string;
}

const STATUS_STYLE = {
  healthy: 'border-[rgba(16,185,129,0.15)]',
  warning: 'border-[rgba(245,158,11,0.2)]',
  crisis:  'border-[rgba(239,68,68,0.2)]  animate-crisis-pulse',
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
  const hasTrend = trend !== undefined && trend !== null;
  const isUp     = hasTrend && trend! >= 0;
  const isFlat   = hasTrend && trend! === 0;

  const TrendIcon = isFlat ? Minus : isUp ? ArrowUpRight : ArrowDownRight;
  const trendColor = isFlat
    ? '#64748B'
    : isUp
    ? '#10B981'
    : '#EF4444';

  const sparkData = sparkline.map((v, i) => ({ v, i }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className={cn(
        'relative rounded-2xl p-5 bg-[#F8FAFC] border overflow-hidden',
        'hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow duration-200',
        STATUS_STYLE[status],
        className,
      )}
    >
      {/* Background color wash */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ background: `radial-gradient(ellipse at top right, ${color}, transparent)` }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-3 relative">
        <p className="text-[11px] text-[#64748B] font-600 uppercase tracking-widest">{title}</p>
        <div
          className="flex items-center justify-center w-8 h-8 rounded-xl"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-2 relative">
        <motion.span
          key={String(value)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[26px] font-700 text-[#0F172A] leading-none"
        >
          {value}
        </motion.span>
        {unit && <span className="text-[11px] text-[#64748B] mb-0.5">{unit}</span>}
      </div>

      {/* Trend badge */}
      {hasTrend && (
        <div className="flex items-center gap-1.5 mt-2 relative">
          <span
            className="flex items-center gap-0.5 text-[11px] font-600 px-1.5 py-0.5 rounded-md"
            style={{ color: trendColor, backgroundColor: `${trendColor}18` }}
          >
            <TrendIcon size={11} />
            {Math.abs(trend!).toFixed(1)}%
          </span>
          <span className="text-[10px] text-[#475569]">{trendLabel}</span>
        </div>
      )}

      {/* Sparkline */}
      {sparkData.length > 2 && (
        <div className="mt-3 h-10 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={`spark-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.5}
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
