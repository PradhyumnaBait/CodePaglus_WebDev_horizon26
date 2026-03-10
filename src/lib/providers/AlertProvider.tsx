'use client';

// ============================================================
// OpsPulse — Alert Provider
// ============================================================
// Handles alert generation, storage, and real-time synchronization
// Works alongside SimulatorProvider to generate realistic alerts

import { useEffect, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAlertsStore } from '@/store/alertsStore';
import { AlertSimulator } from '@/lib/alerts/simulator';
import { ruleResultToAlert, AlertRuleEngine } from '@/lib/alerts/rule-engine';
import { DEFAULT_STORE_ID, QUERY_KEYS } from '@/lib/config/constants';

interface AlertProviderProps {
  children: ReactNode;
  enabled?: boolean;
  scenario?: 'normal' | 'crisis' | 'opportunity' | 'mixed';
}

/**
 * AlertProvider initializes the alert simulator and ensures
 * demo alerts are seeded on first load
 */
export function AlertProvider({
  children,
  enabled = true,
  scenario = 'mixed',
}: AlertProviderProps) {
  const simulatorRef = useRef<AlertSimulator | null>(null);
  const queryClient = useQueryClient();
  const { setAlerts, alerts } = useAlertsStore();
  const initRef = useRef(false);

  // Seed initial demo alerts on mount
  useEffect(() => {
    if (initRef.current || !enabled) return;
    initRef.current = true;

    const storeId = DEFAULT_STORE_ID;

    // Seed demo alerts from API
    fetch(`/api/alerts?storeId=${storeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setAlerts(data.data);
        }
      })
      .catch((err) => console.error('[AlertProvider] Failed to seed alerts:', err));
  }, [enabled, setAlerts]);

  // Initialize and run alert simulator
  useEffect(() => {
    if (!enabled) return;

    const storeId = DEFAULT_STORE_ID;

    // Create simulator
    simulatorRef.current = new AlertSimulator(
      (alertResult) => {
        // Convert to Alert entity
        const newAlert = ruleResultToAlert(alertResult, storeId);
        const alertWithId = {
          ...newAlert,
          id: `alert-${Date.now()}-${Math.random()}`,
          alert_id: `alert-${Date.now()}-${Math.random()}`,
        };

        // Add to store
        setAlerts([alertWithId, ...alerts]);

        // Invalidate queries to sync with API
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.alerts(storeId),
        });
      },
      {
        enabled: true,
        frequency: 20000, // Check every 20 seconds
        scenario,
        storeId,
      }
    );

    // Start the simulator
    simulatorRef.current.start();

    // Cleanup on unmount
    return () => {
      simulatorRef.current?.stop();
    };
  }, [enabled, scenario, alerts, setAlerts, queryClient]);

  return <>{children}</>;
}
