'use client';

// ============================================================
// OpsPulse — Alert Card Component
// ============================================================

import { useState } from 'react';
import { AlertBadge } from './AlertBadge';
import type { Alert } from '@/types';
import { AlertRuleEngine } from '@/lib/alerts/rule-engine';

interface AlertCardProps {
  alert: Alert;
  onResolve: (alertId: string) => void;
  onEscalate: (alertId: string) => void;
  onOpenWarRoom: (alertId: string) => void;
  isLoading?: boolean;
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
function formatRelativeTime(timestamp: string | undefined): string {
  if (!timestamp) return 'Unknown';

  const now = new Date();
  const alertTime = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - alertTime.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function AlertCard({
  alert,
  onResolve,
  onEscalate,
  onOpenWarRoom,
  isLoading = false,
}: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const alertId = alert.id || alert.alert_id || '';
  const color = AlertRuleEngine.getSeverityColor(alert.severity);
  const bgColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.06)`;

  return (
    <div
      className="ops-card border-l-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-default"
      style={{ borderLeftColor: color, backgroundColor: bgColor }}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between gap-6 mb-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2.5">
            <div className="flex-1">
              <h3 className="font-bold text-[14px] leading-tight text-[#0F172A] mb-2.5">
                {alert.title}
              </h3>
              <p className="text-[12px] leading-relaxed text-[#475569] line-clamp-3">
                {alert.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          <AlertBadge severity={alert.severity} size="md" />
        </div>
      </div>

      {/* Metadata Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 pb-5 border-t border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <span className="text-[12px]">⏱️</span>
          <div>
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-600">Time</p>
            <p className="text-[12px] font-medium text-[#0F172A]">
              {formatRelativeTime(alert.timestamp || alert.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[12px]">🏢</span>
          <div>
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-600">Store</p>
            <p className="text-[12px] font-medium text-[#0F172A]">
              {alert.store_id || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[12px]">{alert.status === 'resolved' ? '✅' : alert.status === 'escalated' ? '📤' : '🔔'}</span>
          <div>
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-600">Status</p>
            <p className="text-[12px] font-medium capitalize" style={{ color: alert.status === 'resolved' ? '#10B981' : alert.status === 'escalated' ? '#F59E0B' : '#3B82F6' }}>
              {alert.status}
            </p>
          </div>
        </div>
        {alert.severity === 'crisis' && (
          <div className="flex items-center gap-2.5">
            <span className="text-[12px]">🚨</span>
            <div>
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-600">Priority</p>
              <p className="text-[12px] font-bold" style={{ color: color }}>URGENT</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {alert.status === 'active' && (
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onResolve(alertId)}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-md font-600 text-[12px] bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Resolving...' : '✓ Mark Resolved'}
          </button>
          <button
            onClick={() => onEscalate(alertId)}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-md font-600 text-[12px] bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Escalating...' : '⬆️ Escalate'}
          </button>
          {alert.severity === 'crisis' && (
            <button
              onClick={() => onOpenWarRoom(alertId)}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-md font-600 text-[12px] text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: color }}
            >
              {isLoading ? '⏳ Loading...' : '🎯 Open War Room'}
            </button>
          )}
        </div>
      )}

      {/* Resolved/Escalated State */}
      {alert.status !== 'active' && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-md" style={{ backgroundColor: alert.status === 'resolved' ? '#F0FDF4' : '#FFFBEB' }}>
          <span className="text-[14px]">{alert.status === 'resolved' ? '✅' : '📤'}</span>
          <p className="text-[12px] font-medium" style={{ color: alert.status === 'resolved' ? '#166534' : '#B45309' }}>
            {alert.status === 'resolved' && 'Alert has been resolved — archived in history'}
            {alert.status === 'escalated' && 'Alert escalated to War Room — requires investigation'}
          </p>
        </div>
      )}
    </div>
  );
}
