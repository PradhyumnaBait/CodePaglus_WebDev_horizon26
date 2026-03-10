// ============================================================
// OpsPulse — Alerts Zustand Store
// ============================================================
import { create } from 'zustand';
import type { AlertsSlice, Alert, AlertSeverity, AlertStatus } from '@/types';

function applyFilters(
  alerts: Alert[],
  severity: AlertSeverity | 'all',
  status: AlertStatus | 'all',
): Alert[] {
  return alerts.filter((a) => {
    const sevMatch    = severity === 'all' || a.severity === severity;
    const statusMatch = status   === 'all' || a.status   === status;
    return sevMatch && statusMatch;
  });
}

export const useAlertsStore = create<AlertsSlice>()((set, get) => ({
  alerts:          [],
  filteredAlerts:  [],
  severityFilter:  'all',
  statusFilter:    'all',
  unreadCount:     0,

  setAlerts: (alerts: Alert[]) =>
    set((state) => ({
      alerts,
      filteredAlerts: applyFilters(alerts, state.severityFilter, state.statusFilter),
      unreadCount:    alerts.filter((a) => a.status === 'open').length,
    })),

  addAlert: (alert: Alert) =>
    set((state) => {
      const alerts = [alert, ...state.alerts];
      return {
        alerts,
        filteredAlerts: applyFilters(alerts, state.severityFilter, state.statusFilter),
        unreadCount:    state.unreadCount + (['open', 'active'].includes(alert.status) ? 1 : 0),
      };
    }),

  updateAlert: (id: string, update: Partial<Alert>) =>
    set((state) => {
      const alerts = state.alerts.map((a) =>
        (a.id === id || a.alert_id === id) ? { ...a, ...update } : a,
      );
      return {
        alerts,
        filteredAlerts: applyFilters(alerts, state.severityFilter, state.statusFilter),
        unreadCount:    alerts.filter((a) => ['open', 'active'].includes(a.status)).length,
      };
    }),

  setSeverityFilter: (severity: AlertSeverity | 'all') =>
    set((state) => ({
      severityFilter: severity,
      filteredAlerts: applyFilters(state.alerts, severity, state.statusFilter),
    })),

  setStatusFilter: (status: AlertStatus | 'all') =>
    set((state) => ({
      statusFilter:  status,
      filteredAlerts: applyFilters(state.alerts, state.severityFilter, status),
    })),

  markAllRead: () =>
    set({ unreadCount: 0 }),
}));
