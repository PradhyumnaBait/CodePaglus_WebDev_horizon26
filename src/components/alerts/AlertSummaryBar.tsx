'use client';

// ============================================================
// OpsPulse — Alert Summary Bar Component
// ============================================================

import type { Alert } from '@/types';
import { AlertBadge } from './AlertBadge';

interface AlertSummaryBarProps {
  alerts: Alert[];
  selectedSeverity?: string;
  onSelectSeverity?: (severity: string) => void;
}

export function AlertSummaryBar({
  alerts,
  selectedSeverity = 'all',
  onSelectSeverity,
}: AlertSummaryBarProps) {
  // Count alerts by status and severity
  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const crisisCount = activeAlerts.filter((a) => a.severity === 'crisis').length;
  const opportunityCount = activeAlerts.filter((a) => a.severity === 'opportunity').length;
  const anomalyCount = activeAlerts.filter((a) => a.severity === 'anomaly').length;

  const stats = [
    { label: 'Active', count: activeAlerts.length, filter: 'all', color: '#6B7280' },
    { label: 'Crisis', count: crisisCount, filter: 'crisis', color: '#EF4444' },
    { label: 'Opportunity', count: opportunityCount, filter: 'opportunity', color: '#10B981' },
    { label: 'Anomaly', count: anomalyCount, filter: 'anomaly', color: '#F59E0B' },
  ];

  return (
    <div className="ops-card mb-7">
      <h3 className="text-[11px] font-black text-[#64748B] uppercase tracking-[0.12em] mb-5">
        📊 Active Alert Summary
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {stats.map((stat) => (
          <button
            key={stat.filter}
            onClick={() => onSelectSeverity?.(stat.filter)}
            className={`p-4 rounded-lg font-600 transition-all border-2 hover:scale-105 active:scale-95 ${
              selectedSeverity === stat.filter
                ? 'border-[#3B82F6] bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                : 'border-transparent bg-[#F8FAFC] hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-700 mb-2.5">{stat.label}</div>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-[32px] font-black"
                style={{ color: stat.color }}
              >
                {stat.count}
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1.5">
              {stat.count === 1 ? 'alert' : 'alerts'}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
