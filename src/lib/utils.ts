// ============================================================
// OpsPulse — Utility Functions
// ============================================================
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertSeverity } from '@/types';
import { ALERT_SEVERITY_CONFIG } from '@/lib/config/constants';

// --------------------------------------------------------
// Tailwind Class Merge Utility
// --------------------------------------------------------
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// --------------------------------------------------------
// Number Formatting
// --------------------------------------------------------
export function formatCurrency(value: number, currency = 'INR'): string {
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000)    return `₹${(value / 100_000).toFixed(1)}L`;
  if (value >= 1_000)      return `₹${(value / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString('en-IN');
}

export function formatPercent(value: number, decimals = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

// --------------------------------------------------------
// Date / Time Formatting
// --------------------------------------------------------
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('en-IN', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);

  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date(iso));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(new Date(iso));
}

// --------------------------------------------------------
// Alert Helpers
// --------------------------------------------------------
export function getSeverityConfig(severity: AlertSeverity) {
  return ALERT_SEVERITY_CONFIG[severity];
}

export function getSeverityBadgeClass(severity: AlertSeverity): string {
  const map: Record<string, string> = {
    crisis:      'badge-crisis',
    anomaly:     'badge-warning',
    warning:     'badge-warning',
    opportunity: 'badge-success',
    info:        'badge-healthy',
  };
  return map[severity] ?? 'badge-healthy';
}

// --------------------------------------------------------
// Trend Helpers
// --------------------------------------------------------
export function getTrendColor(value: number): string {
  if (value > 0)  return '#10B981';
  if (value < 0)  return '#EF4444';
  return '#94A3B8';
}

export function getTrendArrow(value: number): '↑' | '↓' | '→' {
  if (value > 0) return '↑';
  if (value < 0) return '↓';
  return '→';
}

// --------------------------------------------------------
// Misc Helpers
// --------------------------------------------------------
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
