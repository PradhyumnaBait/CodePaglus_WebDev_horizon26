'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const MONTHLY_ORDERS = [
  { month: 'Jan', orders: 320 },
  { month: 'Feb', orders: 410 },
  { month: 'Mar', orders: 380 },
  { month: 'Apr', orders: 490 },
  { month: 'May', orders: 530 },
  { month: 'Jun', orders: 470 },
  { month: 'Jul', orders: 610 },
  { month: 'Aug', orders: 580 },
  { month: 'Sep', orders: 520 },
  { month: 'Oct', orders: 640 },
  { month: 'Nov', orders: 710 },
  { month: 'Dec', orders: 680 },
];

const TOOLTIP_STYLE = {
  backgroundColor: '#1E293B',
  border: '1px solid #334155',
  borderRadius: '10px',
  fontSize: '12px',
  color: '#F1F5F9',
  padding: '8px 12px',
};

const BAR_COLORS = [
  '#2563EB', '#3B82F6', '#2563EB', '#3B82F6',
  '#2563EB', '#3B82F6', '#2563EB', '#3B82F6',
  '#2563EB', '#3B82F6', '#2563EB', '#3B82F6',
];

export function MonthlyOrdersChart() {
  return (
    <div className="w-full" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MONTHLY_ORDERS} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1E293B" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#475569', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(value: any) => [`${value} orders`, 'Total Orders']}
          />
          <Bar
            dataKey="orders"
            fill="url(#bar-grad)"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          >
            {MONTHLY_ORDERS.map((_, idx) => (
              <Cell key={idx} fill={BAR_COLORS[idx]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
