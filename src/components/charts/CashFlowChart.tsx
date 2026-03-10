'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CASH_FLOW_DATA = [
  { day: 'Mon', revenue: 42500, expenses: 28200, netProfit: 14300 },
  { day: 'Tue', revenue: 38900, expenses: 25800, netProfit: 13100 },
  { day: 'Wed', revenue: 51200, expenses: 31500, netProfit: 19700 },
  { day: 'Thu', revenue: 46800, expenses: 29900, netProfit: 16900 },
  { day: 'Fri', revenue: 55300, expenses: 33200, netProfit: 22100 },
  { day: 'Sat', revenue: 62100, expenses: 35800, netProfit: 26300 },
  { day: 'Sun', revenue: 48700, expenses: 27500, netProfit: 21200 },
];

const TOOLTIP_STYLE = {
  backgroundColor: '#1E293B',
  border: '1px solid #334155',
  borderRadius: '10px',
  fontSize: '12px',
  color: '#F1F5F9',
  padding: '8px 12px',
};

export function CashFlowChart() {
  return (
    <div className="w-full" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={CASH_FLOW_DATA} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grad-expenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grad-profit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1E293B" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#475569', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: any, name: any) => [
              `₹${value.toLocaleString('en-IN')}`,
              name === 'revenue' ? 'Revenue' : name === 'expenses' ? 'Expenses' : 'Net Profit',
            ]}
          />
          <Legend
            verticalAlign="top"
            height={32}
            formatter={(value) =>
              value === 'revenue' ? 'Revenue' : value === 'expenses' ? 'Expenses' : 'Net Profit'
            }
            wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563EB"
            strokeWidth={2}
            fill="url(#grad-revenue)"
            dot={false}
            activeDot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#0F172A' }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#EF4444"
            strokeWidth={2}
            fill="url(#grad-expenses)"
            dot={false}
            activeDot={{ r: 4, fill: '#EF4444', strokeWidth: 2, stroke: '#0F172A' }}
          />
          <Area
            type="monotone"
            dataKey="netProfit"
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#grad-profit)"
            dot={false}
            activeDot={{ r: 4, fill: '#22C55E', strokeWidth: 2, stroke: '#0F172A' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
