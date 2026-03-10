'use client';

// ============================================================
// OpsPulse — Active Alerts List Component
// ============================================================

import { useState, useTransition } from 'react';
import { AlertCard } from './AlertCard';
import { AlertSummaryBar } from './AlertSummaryBar';
import type { Alert } from '@/types';

interface ActiveAlertsListProps {
  alerts: Alert[];
  onResolveAlert: (alertId: string) => Promise<void>;
  onEscalateAlert: (alertId: string) => Promise<void>;
  onOpenWarRoom: (alertId: string) => void;
}

export function ActiveAlertsList({
  alerts,
  onResolveAlert,
  onEscalateAlert,
  onOpenWarRoom,
}: ActiveAlertsListProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [isPending, startTransition] = useTransition();
  const [loadingAlertId, setLoadingAlertId] = useState<string | null>(null);

  // Filter alerts
  const filterAlerts = (alerts: Alert[]) => {
    return alerts.filter((alert) => {
      const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
      const statusMatch = selectedStatus === 'all' || alert.status === selectedStatus;
      return severityMatch && statusMatch;
    });
  };

  const filteredAlerts = filterAlerts(alerts);
  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved');

  // Handle resolve action
  const handleResolve = (alertId: string) => {
    setLoadingAlertId(alertId);
    startTransition(async () => {
      try {
        await onResolveAlert(alertId);
      } finally {
        setLoadingAlertId(null);
      }
    });
  };

  // Handle escalate action
  const handleEscalate = (alertId: string) => {
    setLoadingAlertId(alertId);
    startTransition(async () => {
      try {
        await onEscalateAlert(alertId);
      } finally {
        setLoadingAlertId(null);
      }
    });
  };

  return (
    <div>
      {/* Summary Bar */}
      <AlertSummaryBar
        alerts={activeAlerts}
        selectedSeverity={selectedSeverity}
        onSelectSeverity={setSelectedSeverity}
      />

      {/* Filters */}
      <div className="ops-card mb-7 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStatus('active')}
            className={`px-4 py-2.5 rounded-md text-[12px] font-600 transition-all border-2 hover:shadow-sm active:scale-95 ${
              selectedStatus === 'active'
                ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#3B82F6]'
            }`}
          >
            🔴 Active
          </button>
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2.5 rounded-md text-[12px] font-600 transition-all border-2 hover:shadow-sm active:scale-95 ${
              selectedStatus === 'all'
                ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#3B82F6]'
            }`}
          >
            📋 All Alerts
          </button>
        </div>
        <div className="text-[12px] font-600 text-[#475569] bg-[#F1F5F9] px-4 py-2 rounded-md">
          {filteredAlerts.length === 1 ? '1 result' : `${filteredAlerts.length} results`}
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="ops-card text-center py-16">
          <div className="text-[56px] mb-4">✨</div>
          <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">
            {selectedStatus === 'active' ? 'No Active Alerts' : 'No Alerts Found'}
          </h3>
          <p className="text-[13px] text-[#64748B] mb-6">
            {selectedStatus === 'active'
              ? 'Your operations are running smoothly. Keep monitoring the dashboard!'
              : 'Try adjusting your filters to view more alerts'}
          </p>
          <div className="flex justify-center gap-3">
            <div className="inline-block px-4 py-2 bg-blue-50 rounded-md text-[12px] text-blue-700 font-medium">
              💡 All systems healthy
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id || alert.alert_id}
              alert={alert}
              onResolve={handleResolve}
              onEscalate={handleEscalate}
              onOpenWarRoom={onOpenWarRoom}
              isLoading={loadingAlertId === (alert.id || alert.alert_id)}
            />
          ))}
        </div>
      )}

      {/* Alert History Section */}
      {resolvedAlerts.length > 0 && selectedStatus === 'all' && (
        <div className="mt-10 pt-8 border-t-2 border-[#E2E8F0]">
          <h3 className="text-[14px] font-black text-[#0F172A] mb-5 uppercase tracking-wider">
            ✅ Resolved History ({resolvedAlerts.length})
          </h3>
          <div className="space-y-2.5">
            {resolvedAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id || alert.alert_id}
                className="ops-card opacity-75 bg-gradient-to-r from-green-50 to-transparent border-l-4 border-green-500 hover:opacity-90 transition-opacity"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-[13px] font-medium text-[#475569] line-through">
                      {alert.title}
                    </h4>
                    <p className="text-[11px] text-[#94A3B8] mt-2">
                      ✓ Resolved {alert.resolved_at ? new Date(alert.resolved_at).toLocaleDateString('en-IN', { year: '2-digit', month: 'short', day: 'numeric' }) : 'recently'}
                    </p>
                  </div>
                  <span className="text-[12px] text-green-700 font-bold px-2.5 py-1 bg-green-100 rounded-md flex-shrink-0">DONE</span>
                </div>
              </div>
            ))}
            {resolvedAlerts.length > 4 && (
              <button className="w-full text-[12px] text-[#3B82F6] hover:text-[#1D4ED8] font-600 py-3 rounded-md hover:bg-blue-50 transition-all active:scale-95">
                📂 View all {resolvedAlerts.length} archived alerts →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
