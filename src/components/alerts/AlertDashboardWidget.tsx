// ============================================================
// OpsPulse — Alert Dashboard Widget
// ============================================================
// Small summary widget for displaying on main dashboard

import Link from 'next/link';
import { AlertBadge } from './AlertBadge';
import type { Alert, AlertSeverity } from '@/types';

interface AlertDashboardWidgetProps {
  alerts: Alert[];
  maxItems?: number;
}

/**
 * Compact alert widget for dashboard
 * Shows recent active alerts with quick links
 */
export function AlertDashboardWidget({
  alerts,
  maxItems = 3,
}: AlertDashboardWidgetProps) {
  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const crisisCount = activeAlerts.filter((a) => a.severity === 'crisis').length;
  const recentAlerts = activeAlerts
    .sort((a, b) => {
      const aTime = new Date(a.timestamp || a.created_at || 0).getTime();
      const bTime = new Date(b.timestamp || b.created_at || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, maxItems);

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <div className="ops-card border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h4 className="text-[14px] font-black text-[#0F172A] mb-2 flex items-center gap-2">
            <span className="text-[18px]">⚠️</span> Active Alerts
          </h4>
          <p className="text-[12px] text-[#64748B] font-600">
            {crisisCount > 0 && (
              <>
                <span className="text-red-600 font-bold" style={{ fontSize: '13px' }}>{crisisCount} crisis{crisisCount > 1 ? 'es' : ''}</span>
                {activeAlerts.length - crisisCount > 0 && ' • '}
              </>
            )}
            {activeAlerts.length - crisisCount > 0 && (
              <span className="text-[#64748B]">{activeAlerts.length - crisisCount} other{activeAlerts.length - crisisCount > 1 ? 's' : ''}</span>
            )}
          </p>
        </div>
        <Link
          href="/dashboard/alerts"
          className="text-[12px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all active:scale-95 px-3 py-1.5 rounded-md hover:bg-blue-50"
        >
          View →
        </Link>
      </div>

      {recentAlerts.length > 0 && (
        <div className="space-y-3 mb-4 pb-4 border-t border-[#E2E8F0] pt-4">
          {recentAlerts.map((alert) => (
            <div key={alert.id || alert.alert_id} className="flex items-start gap-3 p-2.5 rounded-md bg-[#F8FAFC] hover:bg-white transition-colors">
              <AlertBadge severity={alert.severity} size="sm" showLabel={false} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-[#0F172A] line-clamp-1">
                  {alert.title}
                </p>
                <p className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                  {alert.description?.substring(0, 50)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/dashboard/alerts"
        className="w-full ops-btn-secondary text-[12px] px-4 py-3 rounded-md text-center font-600 transition-all hover:shadow-md active:scale-95"
      >
        📂 Manage All Alerts
      </Link>
    </div>
  );
}
