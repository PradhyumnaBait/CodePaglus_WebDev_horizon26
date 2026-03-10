'use client';

// ============================================================
// OpsPulse — Alerts Center Page
// ============================================================

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ActiveAlertsList } from '@/components/alerts';
import { useAlertsStore } from '@/store/alertsStore';
import { DEFAULT_STORE_ID } from '@/lib/config/constants';
import { QUERY_KEYS } from '@/lib/config/constants';
import type { Alert } from '@/types';
import axios from 'axios';

export default function AlertsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAlerts, alerts } = useAlertsStore();
  const storeId = DEFAULT_STORE_ID;

  // Fetch alerts
  const { data: fetchedAlerts = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.alerts(storeId),
    queryFn: async () => {
      const res = await axios.get(`/api/alerts?storeId=${storeId}`);
      return res.data.data as Alert[];
    },
    refetchInterval: 10_000, // Poll every 10 seconds
    staleTime: 5_000,
  });

  // Update store when alerts are fetched
  useEffect(() => {
    if (fetchedAlerts.length > 0) {
      setAlerts(fetchedAlerts);
    }
  }, [fetchedAlerts, setAlerts]);

  // Resolve alert mutation
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const res = await axios.patch(`/api/alerts/${alertId}/resolve`, {});
      return res.data.data as Alert;
    },
    onSuccess: (updatedAlert) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts(storeId) });
    },
  });

  // Escalate alert mutation
  const escalateAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const res = await axios.patch(`/api/alerts/${alertId}/escalate`, {});
      return res.data.data as Alert;
    },
    onSuccess: (updatedAlert) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts(storeId) });
    },
  });

  // Handle open war room
  const handleOpenWarRoom = (alertId: string) => {
    // Navigate to war room with alert context
    router.push(`/dashboard/war-room?alert=${alertId}`);
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-page-title text-[#0F172A]">Alerts Center</h1>
          <p className="text-[13px] text-[#64748B] mt-1">Manage, filter, and resolve operational alerts</p>
        </div>
        <div className="ops-card flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <div className="text-[32px]">⏳</div>
            </div>
            <p className="text-[13px] text-[#64748B]">Loading alerts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-page-title text-[#0F172A]">Alerts Center</h1>
          <p className="text-[13px] text-[#64748B] mt-1">Manage, filter, and resolve operational alerts</p>
        </div>
        <div className="ops-card border-l-4 border-red-500 bg-red-50 p-6">
          <h3 className="font-semibold text-red-900 mb-2">⚠️ Error Loading Alerts</h3>
          <p className="text-[12px] text-red-700">
            {error instanceof Error ? error.message : 'Failed to load alerts. Please try again.'}
          </p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts(storeId) })}
            className="mt-4 ops-btn-primary text-[12px] px-4 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-[32px] font-black text-[#0F172A]">🔔</h1>
          <h1 className="text-[32px] font-black text-[#0F172A]">Alerts Center</h1>
        </div>
        <p className="text-[14px] leading-relaxed text-[#64748B] max-w-2xl">
          Real-time monitoring and intelligent alerting system. Stay on top of critical business events across sales, inventory, and cash flow operations.
        </p>
      </div>

      {/* Info Banner */}
      <div className="ops-card bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 mb-8 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="text-[28px] flex-shrink-0 pt-0.5">💡</div>
          <div>
            <h4 className="text-[14px] font-bold text-blue-900 mb-2">
              Alert-Driven Decision Making
            </h4>
            <p className="text-[13px] leading-relaxed text-blue-800">
              Our intelligent system continuously monitors key business metrics and instantly surfaces anomalies, crises, and opportunities. Never miss critical operational events—resolve issues before they cascade into problems.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-[11px] font-600">24/7 Monitoring</span>
              <span className="inline-block px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-[11px] font-600">Real-Time Alerts</span>
              <span className="inline-block px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-[11px] font-600">Smart Escalation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ActiveAlertsList
        alerts={alerts.length > 0 ? alerts : fetchedAlerts}
        onResolveAlert={(alertId) => resolveAlertMutation.mutateAsync(alertId)}
        onEscalateAlert={(alertId) => escalateAlertMutation.mutateAsync(alertId)}
        onOpenWarRoom={handleOpenWarRoom}
      />

      {/* Quick Stats */}
      <div className="mt-12 pt-8 border-t-2 border-[#E2E8F0]">
        <h3 className="text-[14px] font-black text-[#0F172A] mb-6 uppercase tracking-wider">📊 Alert Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="ops-card text-center hover:shadow-md hover:scale-105 transition-all cursor-default">
            <div className="text-[32px] mb-3">📋</div>
            <div className="text-[11px] text-[#94A3B8] mb-2.5 font-bold uppercase tracking-wider">Total Alerts</div>
            <div className="text-[32px] font-black text-[#0F172A]">
              {fetchedAlerts.length}
            </div>
          </div>
          <div className="ops-card text-center hover:shadow-md hover:scale-105 transition-all cursor-default">
            <div className="text-[32px] mb-3">🚨</div>
            <div className="text-[11px] text-[#94A3B8] mb-2.5 font-bold uppercase tracking-wider">Critical</div>
            <div className="text-[32px] font-black" style={{ color: '#EF4444' }}>
              {fetchedAlerts.filter((a) => a.severity === 'crisis' && a.status === 'active').length}
            </div>
          </div>
          <div className="ops-card text-center hover:shadow-md hover:scale-105 transition-all cursor-default">
            <div className="text-[32px] mb-3">📈</div>
            <div className="text-[11px] text-[#94A3B8] mb-2.5 font-bold uppercase tracking-wider">Growth</div>
            <div className="text-[32px] font-black" style={{ color: '#10B981' }}>
              {fetchedAlerts.filter((a) => a.severity === 'opportunity').length}
            </div>
          </div>
          <div className="ops-card text-center hover:shadow-md hover:scale-105 transition-all cursor-default">
            <div className="text-[32px] mb-3">✅</div>
            <div className="text-[11px] text-[#94A3B8] mb-2.5 font-bold uppercase tracking-wider">Resolved</div>
            <div className="text-[32px] font-black" style={{ color: '#10B981' }}>
              {fetchedAlerts.filter((a) => a.status === 'resolved').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
