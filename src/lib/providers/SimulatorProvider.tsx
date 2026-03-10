'use client';

// ============================================================
// OpsPulse — SimulatorProvider
// Connects the SimulatorEngine to Zustand stores for local dev
// Replaces the Socket.io layer when running without a backend
// ============================================================
import { useEffect, useRef, type ReactNode } from 'react';
import { SimulatorEngine, type Scenario } from '@/lib/simulator-engine';
import { useDashboardStore } from '@/store/dashboardStore';
import { useAlertsStore } from '@/store/alertsStore';
import { useSocketStore } from '@/store/socketStore';
import type { SaleEvent, InventoryUpdateEvent, SupportTicket, EventFeedItem } from '@/types';

interface SimulatorProviderProps {
  children:    ReactNode;
  enabled?:    boolean;
  scenario?:   Scenario;
  frequency?:  number;
}

// ---- Stress Score Engine ----
const WEIGHTS = { sales: 0.4, inventory: 0.35, support: 0.25 };

function computeStressScore(
  salesVelocity: number,       // revenue per hour (higher = healthier)
  inventoryHealth: number,     // 0–100
  openTickets: number,         // lower = healthier
): number {
  // Sales component: compare against baseline of ₹30,000/hr
  const salesScore = Math.min(100, Math.max(0, (salesVelocity / 30000) * 100));
  // Invert for stress: high sales → low stress contribution
  const salesStress = 100 - Math.min(100, salesScore);

  // Inventory: direct 0–100 (low stock = high stress)
  const inventoryStress = 100 - inventoryHealth;

  // Support: 0 tickets = 0, 20+ = 100
  const supportStress = Math.min(100, openTickets * 5);

  const raw = (
    salesStress     * WEIGHTS.sales     +
    inventoryStress * WEIGHTS.inventory +
    supportStress   * WEIGHTS.support
  );
  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function SimulatorProvider({
  children,
  enabled  = true,
  scenario = 'normal',
  frequency,
}: SimulatorProviderProps) {
  const engineRef   = useRef<SimulatorEngine | null>(null);

  // Revenue & ticket counters (per hour window)
  const salesWindow   = useRef<number[]>([]);
  const openTickets   = useRef<number>(0);
  const inventoryMap  = useRef<Record<string, number>>({
    'SKU-1001': 15, 'SKU-1002': 45, 'SKU-1003': 30,
    'SKU-1004': 8,  'SKU-1005': 100,
  });

  const { setStressScore, pushStressHistory, setSalesMetric } = useDashboardStore();
  const { addAlert }    = useAlertsStore();
  const { setStatus, pushEvent } = useSocketStore();

  useEffect(() => {
    if (!enabled) return;

    setStatus('connected');

    engineRef.current = new SimulatorEngine(
      (rawEvent) => {
        const now = Date.now();

        // ---- Handle SaleEvent (guard: order_id is unique to SaleEvent) ----
        if (rawEvent.type === 'sale' && 'order_id' in rawEvent) {
          const ev = rawEvent as SaleEvent;
          salesWindow.current.push(ev.amount);
          // Keep only last 60 seconds of sales for velocity calc
          const cutoff = now - 60_000;
          // Since we don't have timestamps tied to index, just keep last 12
          if (salesWindow.current.length > 12) salesWindow.current.shift();

          // Update sales metrics in store
          setSalesMetric({
            today_revenue:   salesWindow.current.reduce((a, b) => a + b, 0),
            today_orders:    salesWindow.current.length,
            hour_revenue:    salesWindow.current.reduce((a, b) => a + b, 0),
            avg_order_value: salesWindow.current.reduce((a, b) => a + b, 0) /
                             Math.max(1, salesWindow.current.length),
            top_category:    'Electronics',
            revenue_trend:   0,
          });
        }

        // ---- Handle InventoryUpdateEvent (guard: on_hand is unique to InventoryUpdateEvent) ----
        if (rawEvent.type === 'inventory_update' && 'on_hand' in rawEvent) {
          const ev = rawEvent as InventoryUpdateEvent;
          inventoryMap.current[ev.sku] = ev.on_hand;

          // Fire alert if low
          if (ev.on_hand === 0) {
            addAlert({
              id:          `alert-stockout-${ev.sku}-${now}`,
              severity:    'crisis',
              title:       `Stock-out: ${ev.sku}`,
              description: `${ev.sku} is completely out of stock.`,
              suggested_action: 'Emergency reorder',
              status:      'active',
              store_id:    ev.store_id,
              timestamp:   new Date().toISOString(),
              created_at:  new Date().toISOString(),
            });
          } else if (ev.on_hand < ev.reorder_point) {
            addAlert({
              id:          `alert-low-${ev.sku}-${now}`,
              severity:    'anomaly',
              title:       `Low stock: ${ev.sku} (${ev.on_hand} remaining)`,
              description: `Reorder point is ${ev.reorder_point}. Lead time: ${ev.lead_time_days} days.`,
              suggested_action: 'Trigger reorder',
              status:      'active',
              store_id:    ev.store_id,
              timestamp:   new Date().toISOString(),
              created_at:  new Date().toISOString(),
            });
          }
        }

        // ---- Handle SupportTicket ----
        if ('ticket_id' in rawEvent) {
          const ev = rawEvent as SupportTicket;
          if (ev.status === 'open') openTickets.current++;

          if (ev.priority === 'high') {
            addAlert({
              id:          `alert-ticket-${ev.ticket_id}`,
              severity:    'anomaly',
              title:       `High priority ticket: ${ev.category}`,
              description: `Ticket ${ev.ticket_id} needs immediate attention.`,
              suggested_action: 'View ticket',
              status:      'active',
              store_id:    ev.store_id,
              timestamp:   ev.timestamp,
              created_at:  ev.timestamp,
            });
          }
        }

        // ---- Handle EventFeedItem ----
        if ('message' in rawEvent && 'id' in rawEvent) {
          pushEvent(rawEvent as EventFeedItem);
        }

        // ---- Recompute Stress Score ----
        const hourRevenue = salesWindow.current.reduce((a, b) => a + b, 0);
        const avgInventory = Object.values(inventoryMap.current).length > 0
          ? Object.values(inventoryMap.current).reduce((a, b) => a + b, 0) /
            Object.values(inventoryMap.current).length
          : 50;
        const invHealth = Math.min(100, (avgInventory / 50) * 100);

        const newScore = computeStressScore(hourRevenue, invHealth, openTickets.current);
        const ts = new Date().toISOString();

        setStressScore({
          store_id:     'STORE-01',
          score:        newScore,
          stress_score: newScore,
          timestamp:    ts,
        });
        pushStressHistory({ timestamp: ts, value: newScore });
      },
      { scenario, ...(frequency ? { frequency } : {}) },
    );

    engineRef.current.start();

    return () => {
      engineRef.current?.stop();
      setStatus('disconnected');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, scenario]);

  // Update scenario on prop change
  useEffect(() => {
    engineRef.current?.setScenario(scenario);
  }, [scenario]);

  return <>{children}</>;
}
