// ============================================================
// OpsPulse — Dashboard Zustand Store
// ============================================================
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  DashboardSlice,
  StressScore,
  SalesMetric,
  InventoryMetric,
  SupportMetric,
  WarRoomIncident,
  TimeSeriesPoint,
} from '@/types';

const MAX_HISTORY_POINTS = 60;

export const useDashboardStore = create<DashboardSlice>()(
  subscribeWithSelector((set, get) => ({
    stressScore:      null,
    salesMetric:      null,
    inventoryMetric:  null,
    supportMetric:    null,
    stressHistory:    [],
    isWarRoomActive:  false,
    activeIncident:   null,
    lastUpdated:      null,

    setStressScore: (score: StressScore) =>
      set({
        stressScore:     score,
        isWarRoomActive: score.status === 'critical',
        lastUpdated:     new Date().toISOString(),
      }),

    setSalesMetric: (m: SalesMetric) =>
      set({ salesMetric: m }),

    setInventoryMetric: (m: InventoryMetric) =>
      set({ inventoryMetric: m }),

    setSupportMetric: (m: SupportMetric) =>
      set({ supportMetric: m }),

    pushStressHistory: (point: TimeSeriesPoint) =>
      set((state) => ({
        stressHistory: [
          ...state.stressHistory.slice(-MAX_HISTORY_POINTS + 1),
          point,
        ],
      })),

    activateWarRoom: (incident: WarRoomIncident) =>
      set({ isWarRoomActive: true, activeIncident: incident }),

    deactivateWarRoom: () =>
      set({ isWarRoomActive: false, activeIncident: null }),
  })),
);
