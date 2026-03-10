'use client';

// ============================================================
// OpsPulse — AlertCard
// Severity-styled alert row with actions
// ============================================================
import { motion } from 'framer-motion';
import { X, CheckCheck, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import type { Alert } from '@/types';

interface AlertCardProps {
  alert:      Alert;
  compact?:   boolean;
  onDismiss?: (id: string) => void;
  onResolve?: (id: string) => void;
  delay?:     number;
}

const SEVERITY_CONFIG = {
  crisis: {
    bg:    'rgba(239,68,68,0.08)',
    border:'rgba(239,68,68,0.25)',
    dot:   '#EF4444',
    label: 'Crisis',
    pulse:  true,
  },
  anomaly: {
    bg:    'rgba(245,158,11,0.08)',
    border:'rgba(245,158,11,0.2)',
    dot:   '#F59E0B',
    label: 'Anomaly',
    pulse:  false,
  },
  warning: {
    bg:    'rgba(245,158,11,0.06)',
    border:'rgba(245,158,11,0.15)',
    dot:   '#FB923C',
    label: 'Warning',
    pulse:  false,
  },
  opportunity: {
    bg:    'rgba(16,185,129,0.08)',
    border:'rgba(16,185,129,0.2)',
    dot:   '#10B981',
    label: 'Opportunity',
    pulse:  false,
  },
  info: {
    bg:    'rgba(59,130,246,0.06)',
    border:'rgba(59,130,246,0.15)',
    dot:   '#3B82F6',
    label: 'Info',
    pulse:  false,
  },
} as const;

export function AlertCard({ alert, compact = false, onDismiss, onResolve, delay = 0 }: AlertCardProps) {
  const cfg = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 10, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: -10, height: 0 }}
      transition={{ duration: 0.25, delay }}
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${cfg.border}`, backgroundColor: cfg.bg }}
    >
      <div className={cn('flex gap-3', compact ? 'p-2.5' : 'p-4')}>
        {/* Dot indicator */}
        <div className="flex-shrink-0 pt-1">
          <span
            className={cn('block rounded-full', compact ? 'w-1.5 h-1.5' : 'w-2 h-2', cfg.pulse && 'animate-pulse')}
            style={{ backgroundColor: cfg.dot }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-700 uppercase tracking-widest"
              style={{ color: cfg.dot }}
            >
              {cfg.label}
            </span>
            {alert.status === 'resolved' && (
              <span className="text-[10px] text-[#10B981] font-600 bg-[rgba(16,185,129,0.1)] px-1.5 py-0.5 rounded">
                Resolved
              </span>
            )}
            <span className="text-[10px] text-[#475569] ml-auto flex-shrink-0">
              {formatRelativeTime(alert.timestamp ?? alert.created_at ?? '')}
            </span>
          </div>

          {/* Title */}
          <p className={cn(
            'font-500 text-[#F1F5F9] leading-snug mt-0.5',
            compact ? 'text-[12px]' : 'text-[13px]',
          )}>
            {alert.title}
          </p>

          {/* Description — hide in compact mode */}
          {!compact && alert.description && (
            <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2">
              {alert.description}
            </p>
          )}

          {/* Actions row */}
          {!compact && (
            <div className="flex items-center gap-2 mt-2.5">
              {alert.suggested_action && (
                <button
                  className="flex items-center gap-1 text-[11px] font-600 px-2 py-1 rounded-lg transition-opacity hover:opacity-80"
                  style={{ color: cfg.dot, backgroundColor: `${cfg.dot}18` }}
                >
                  <ExternalLink size={10} />
                  {alert.suggested_action}
                </button>
              )}
              {onResolve && alert.status !== 'resolved' && (
                <button
                  onClick={() => onResolve(alert.id ?? alert.alert_id ?? '')}
                  className="flex items-center gap-1 text-[11px] font-600 px-2 py-1 rounded-lg text-[#10B981] bg-[rgba(16,185,129,0.1)] hover:bg-[rgba(16,185,129,0.18)] transition-colors"
                >
                  <CheckCheck size={10} />
                  Resolve
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(alert.id ?? alert.alert_id ?? '')}
                  className="ml-auto flex items-center justify-center w-6 h-6 rounded-lg text-[#475569] hover:text-[#94A3B8] hover:bg-[#334155] transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
