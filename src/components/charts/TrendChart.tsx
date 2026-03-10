'use client';

// ============================================================
// OpsPulse — TrendChart
// Reusable area / line chart with OpsPulse dark styling
// ============================================================
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { cn } from '@/lib/utils';

export interface TrendChartSeries {
  dataKey:   string;
  label:     string;
  color:     string;
  dashed?:   boolean;
  area?:     boolean;
}

export interface TrendChartProps {
  data:       Record<string, string | number>[];
  series:     TrendChartSeries[];
  height?:    number;
  xKey?:      string;
  yFormatter?: (v: number) => string;
  reference?: { value: number; label?: string; color?: string };
  className?: string;
  type?:      'area' | 'line';
  showGrid?:  boolean;
  animate?:   boolean;
}

const CHART_STYLE = {
  backgroundColor: '#1E293B',
  border:          '1px solid #334155',
  borderRadius:    '10px',
  fontSize:        '12px',
  color:           '#F1F5F9',
  padding:         '8px 12px',
};

export function TrendChart({
  data,
  series,
  height     = 200,
  xKey       = 'time',
  yFormatter = (v: number) => String(v),
  reference,
  className,
  type       = 'area',
  showGrid   = true,
  animate    = true,
}: TrendChartProps) {
  const ChartRoot = type === 'area' ? AreaChart : LineChart;

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartRoot data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.dataKey} id={`grad-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={s.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0}    />
              </linearGradient>
            ))}
          </defs>

          {showGrid && (
            <CartesianGrid stroke="#1E293B" strokeDasharray="4 4" vertical={false} />
          )}

          <XAxis
            dataKey={xKey}
            tick={{ fill: '#475569', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={yFormatter}
          />

          <Tooltip
            contentStyle={CHART_STYLE}
            formatter={(value, name) => [
              yFormatter(Number(value)),
              series.find((s) => s.dataKey === name)?.label ?? String(name),
            ]}
          />

          {reference && (
            <ReferenceLine
              y={reference.value}
              stroke={reference.color ?? '#334155'}
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: reference.label ?? '', fill: reference.color ?? '#475569', fontSize: 10 }}
            />
          )}

          {series.map((s) =>
            type === 'area' ? (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.dashed ? '5 5' : undefined}
                fill={s.area !== false ? `url(#grad-${s.dataKey})` : 'none'}
                dot={false}
                isAnimationActive={animate}
                animationDuration={600}
                activeDot={{ r: 4, fill: s.color, strokeWidth: 2, stroke: '#0F172A' }}
              />
            ) : (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.dashed ? '5 5' : undefined}
                dot={false}
                isAnimationActive={animate}
                animationDuration={600}
                activeDot={{ r: 4, fill: s.color, strokeWidth: 2, stroke: '#0F172A' }}
              />
            ),
          )}
        </ChartRoot>
      </ResponsiveContainer>
    </div>
  );
}
