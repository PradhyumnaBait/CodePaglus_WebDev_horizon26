// ============================================================
// OpsPulse — Alert Badge Component
// ============================================================

import { AlertRuleEngine, type AlertRuleResult } from '@/lib/alerts/rule-engine';
import type { AlertSeverity } from '@/types';

interface AlertBadgeProps {
  severity: AlertSeverity;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function AlertBadge({ severity, size = 'md', showLabel = true }: AlertBadgeProps) {
  const color = AlertRuleEngine.getSeverityColor(severity);
  const bgColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.12)`;
  
  // Label mapping
  const labels: Record<AlertSeverity, string> = {
    'crisis': 'Crisis',
    'anomaly': 'Anomaly',
    'opportunity': 'Opportunity',
    'warning': 'Warning',
    'info': 'Info',
  };

  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    'sm': 'px-2.5 py-1 text-[11px]',
    'md': 'px-3 py-1.5 text-[12px]',
    'lg': 'px-4 py-2 text-[13px]',
  };

  return (
    <div
      className={`inline-flex items-center justify-center gap-2 rounded-md font-600 whitespace-nowrap transition-all ${sizeClasses[size]}`}
      style={{ backgroundColor: bgColor, color, borderLeft: `3px solid ${color}` }}
    >
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0`}
        style={{ backgroundColor: color }}
      />
      {showLabel && labels[severity]}
    </div>
  );
}
