'use client';

// ============================================================
// OpsPulse — StressScoreGauge
// Full radial gauge with animated score + breakdown bars
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, TrendingDown, TrendingUp } from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { getStressColor, STRESS_THRESHOLDS } from '@/lib/config/constants';

interface StressBreakdown {
  label: string;
  score: number;
  color: string;
}

interface StressScoreGaugeProps {
  score:       number;
  prev?:       number;           // previous score for trend arrow
  breakdown?:  StressBreakdown[];
  isLoading?:  boolean;
  animated?:   boolean;
  size?:       'sm' | 'md' | 'lg';
}

const DEFAULT_BREAKDOWN: StressBreakdown[] = [
  { label: 'Sales',     score: 0, color: '#3B82F6' },
  { label: 'Inventory', score: 0, color: '#F59E0B' },
  { label: 'Support',   score: 0, color: '#10B981' },
];

const SIZE_MAP = {
  sm: { chart: 140, label: 'text-[28px]', sub: 'text-[10px]' },
  md: { chart: 180, label: 'text-[36px]', sub: 'text-[11px]' },
  lg: { chart: 220, label: 'text-[46px]', sub: 'text-[12px]' },
};

export function StressScoreGauge({
  score,
  prev,
  breakdown = DEFAULT_BREAKDOWN,
  isLoading = false,
  animated  = true,
  size      = 'md',
}: StressScoreGaugeProps) {
  const color     = getStressColor(score);
  const label     = score <= STRESS_THRESHOLDS.HEALTHY.max   ? 'Healthy'  :
                    score <= STRESS_THRESHOLDS.MODERATE.max  ? 'Moderate' :
                    score <= 74                               ? 'Elevated' :
                    'Critical';

  const trending  = prev !== undefined
    ? score > prev ? 'up' : score < prev ? 'down' : 'flat'
    : 'flat';

  const gaugeData = [{ value: score, fill: color }];
  const dim       = SIZE_MAP[size];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-32 h-32 rounded-full skeleton-loader mb-4" />
        <div className="w-20 h-4 skeleton-loader rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Radial chart + center overlay */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: dim.chart, height: dim.chart }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="62%" outerRadius="82%"
            data={gaugeData}
            startAngle={210} endAngle={-30}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={8}
              background={{ fill: '#1E293B' }}
              isAnimationActive={animated}
              animationBegin={0}
              animationDuration={800}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
              className={cn(dim.label, 'font-700 leading-none tabular-nums')}
              style={{ color }}
            >
              {score}
            </motion.span>
          </AnimatePresence>
          <span className={cn(dim.sub, 'text-[#64748B] mt-0.5')}>/ 100</span>

          {/* Trend indicator */}
          {trending !== 'flat' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 mt-2"
            >
              {trending === 'up' ? (
                <TrendingUp size={13} className="text-[#EF4444]" />
              ) : (
                <TrendingDown size={13} className="text-[#10B981]" />
              )}
            </motion.div>
          )}
        </div>

        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${color}08 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Status pill */}
      <motion.div
        key={label}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'mt-3 px-4 py-1 rounded-full text-[12px] font-700 uppercase tracking-wider',
          label === 'Critical' && 'animate-crisis-pulse',
        )}
        style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
      >
        {label === 'Critical' && <Zap size={10} className="inline mr-1 mb-0.5" />}
        {label}
      </motion.div>

      {/* Breakdown mini bars */}
      {breakdown.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-5 w-full">
          {breakdown.map((item) => (
            <div key={item.label} className="text-center">
              <span
                className="text-[15px] font-700 block"
                style={{ color: item.color }}
              >
                {item.score}
              </span>
              <span className="text-[10px] text-[#64748B]">{item.label}</span>
              <div className="mt-1.5 h-1 rounded-full bg-[#F8FAFC] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
