// ============================================================
// OpsPulse — Alert Simulator Hook
// ============================================================

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAlertsStore } from '@/store/alertsStore';
import { DEFAULT_STORE_ID, QUERY_KEYS } from '@/lib/config/constants';
import { AlertSimulator } from '@/lib/alerts/simulator';
import { ruleResultToAlert } from '@/lib/alerts/rule-engine';

/**
 * Hook to initialize alert simulator and manage in-memory seeding
 * Runs once on component mount
 */
export function useAlertSimulator(enabled: boolean = true) {
  const queryClient = useQueryClient();
  const { addAlert } = useAlertsStore();

  useEffect(() => {
    if (!enabled) return;

    const storeId = DEFAULT_STORE_ID;

    // Create simulator instance
    const simulator = new AlertSimulator(
      (alertResult) => {
        // Convert rule result to Alert entity
        const alert = ruleResultToAlert(alertResult, storeId);
        
        // Add to Zustand store
        addAlert({
          ...alert,
          id: `alert-${Date.now()}-${Math.random()}`,
          alert_id: `alert-${Date.now()}-${Math.random()}`,
        });

        // Invalidate queries to trigger refetch
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts(storeId) });
      },
      {
        enabled: true,
        frequency: 15000, // Check every 15 seconds (less aggressive for demo)
        scenario: 'mixed', // Mix of scenarios
        storeId,
      }
    );

    // Start simulator
    simulator.start();

    // Cleanup on unmount
    return () => {
      simulator.stop();
    };
  }, [enabled, addAlert, queryClient]);
}

/**
 * Seed initial demo alerts
 * Ensures dashboard always has alerts on first load
 */
export async function seedDemoAlerts(storeId: string = DEFAULT_STORE_ID) {
  try {
    const response = await fetch(`/api/alerts?storeId=${storeId}`);
    const data = await response.json();
    
    // Check if we already have demo alerts
    if (data.data && data.data.length > 0) {
      return data.data;
    }

    // If no alerts exist, the API should return demo alerts
    // This is handled in the API route
    return [];
  } catch (error) {
    console.error('[seedDemoAlerts] Error:', error);
    return [];
  }
}
