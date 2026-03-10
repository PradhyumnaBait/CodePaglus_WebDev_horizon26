// ============================================================
// OpsPulse — App Constants
// ============================================================

export const APP_NAME = 'OpsPulse';
export const APP_VERSION = '1.0.0';

export const DEFAULT_STORE_ID = 'STORE-01';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
export const WS_URL       = process.env.NEXT_PUBLIC_WS_URL  ?? 'http://localhost:3001';

// --------------------------------------------------------
// TanStack Query Keys
// --------------------------------------------------------
export const QUERY_KEYS = {
  stressScore:    (storeId: string) => ['stressScore', storeId] as const,
  alerts:         (storeId: string) => ['alerts', storeId] as const,
  metrics:        (storeId: string) => ['metrics', storeId] as const,
  salesMetric:    (storeId: string) => ['salesMetric', storeId] as const,
  inventoryMetric:(storeId: string) => ['inventoryMetric', storeId] as const,
  supportMetric:  (storeId: string) => ['supportMetric', storeId] as const,
  warRoom:        (storeId: string) => ['warRoom', storeId] as const,
  eventFeed:      (storeId: string) => ['eventFeed', storeId] as const,
} as const;

// --------------------------------------------------------
// Stress Score Thresholds
// --------------------------------------------------------
export const STRESS_THRESHOLDS = {
  HEALTHY:  { max: 25,  label: 'Healthy',  color: '#10B981' },
  MODERATE: { max: 75,  label: 'Moderate', color: '#F59E0B' },
  CRITICAL: { max: 100, label: 'Critical', color: '#EF4444' },
} as const;

export function getStressStatus(score: number): 'healthy' | 'moderate' | 'critical' {
  if (score <= STRESS_THRESHOLDS.HEALTHY.max)  return 'healthy';
  if (score <= STRESS_THRESHOLDS.MODERATE.max) return 'moderate';
  return 'critical';
}

export function getStressColor(score: number): string {
  const status = getStressStatus(score);
  return {
    healthy:  STRESS_THRESHOLDS.HEALTHY.color,
    moderate: STRESS_THRESHOLDS.MODERATE.color,
    critical: STRESS_THRESHOLDS.CRITICAL.color,
  }[status];
}

// --------------------------------------------------------
// Alert Severity Config
// --------------------------------------------------------
export const ALERT_SEVERITY_CONFIG = {
  crisis: {
    label:     'Crisis',
    color:     '#EF4444',
    bgColor:   'rgba(239,68,68,0.15)',
    textColor: '#FCA5A5',
    priority:  0,
  },
  anomaly: {
    label:     'Anomaly',
    color:     '#F59E0B',
    bgColor:   'rgba(245,158,11,0.15)',
    textColor: '#FCD34D',
    priority:  1,
  },
  opportunity: {
    label:     'Opportunity',
    color:     '#10B981',
    bgColor:   'rgba(16,185,129,0.15)',
    textColor: '#6EE7B7',
    priority:  2,
  },
  warning: {
    label:     'Warning',
    color:     '#FB923C',
    bgColor:   'rgba(251,146,60,0.15)',
    textColor: '#FDBA74',
    priority:  3,
  },
  info: {
    label:     'Info',
    color:     '#3B82F6',
    bgColor:   'rgba(59,130,246,0.12)',
    textColor: '#93C5FD',
    priority:  4,
  },
} as const;

// --------------------------------------------------------
// WebSocket Events
// --------------------------------------------------------
export const WS_EVENTS = {
  SCORE_UPDATE:       'score_update',
  ALERT_CREATED:      'alert_created',
  ALERT_UPDATED:      'alert_updated',
  WAR_ROOM_ACTIVATED: 'war_room_activated',
  WAR_ROOM_RESOLVED:  'war_room_resolved',
  EVENT_FEED:         'event_feed',
  METRICS_UPDATE:     'metrics_update',
  CONNECT:            'connect',
  DISCONNECT:         'disconnect',
  CONNECT_ERROR:      'connect_error',
} as const;

// --------------------------------------------------------
// Polling Intervals (ms)
// --------------------------------------------------------
export const POLLING_INTERVALS = {
  STRESS_SCORE: 5_000,
  ALERTS:      10_000,
  METRICS:     15_000,
  FEED:        10_000,
} as const;

// --------------------------------------------------------
// Navigation
// --------------------------------------------------------
export const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/dashboard',            icon: 'LayoutDashboard' },
  { label: 'Operations', href: '/dashboard/operations', icon: 'Settings2'       },
  { label: 'War Room',   href: '/dashboard/war-room',   icon: 'Siren'           },
  { label: 'Alerts',     href: '/dashboard/alerts',     icon: 'Bell'            },
  { label: 'Settings',   href: '/dashboard/settings',   icon: 'Settings'        },
] as const;
