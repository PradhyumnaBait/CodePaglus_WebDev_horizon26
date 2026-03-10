'use client';

// ============================================================
// OpsPulse — LiveEventFeed
// Real-time event ticker from socket store / simulator
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Package,
  Headphones,
  AlertTriangle,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import type { EventFeedItem } from '@/types';

interface LiveEventFeedProps {
  events:    EventFeedItem[];
  maxHeight?: string;
  className?: string;
}

const EVENT_CONFIG: Record<
  string,
  { icon: typeof ShoppingCart; color: string; bg: string }
> = {
  sale:             { icon: ShoppingCart,  color: '#10B981', bg: 'rgba(16,185,129,0.08)'  },
  inventory_update: { icon: Package,       color: '#F59E0B', bg: 'rgba(245,158,11,0.08)'  },
  ticket:           { icon: Headphones,    color: '#3B82F6', bg: 'rgba(59,130,246,0.08)'  },
  alert:            { icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.08)'   },
  opportunity:      { icon: TrendingUp,    color: '#A78BFA', bg: 'rgba(167,139,250,0.08)' },
};

function getFeedStyle(event: EventFeedItem) {
  // Severity overrides type color
  if (event.severity === 'crisis') {
    return { icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' };
  }
  if (event.severity === 'anomaly') {
    return { icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' };
  }
  return EVENT_CONFIG[event.type] ?? { icon: Zap, color: '#64748B', bg: 'rgba(100,116,139,0.08)' };
}

export function LiveEventFeed({ events, maxHeight = '420px', className }: LiveEventFeedProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
        <span className="text-[11px] text-[#64748B] font-600 uppercase tracking-widest">Live Feed</span>
        <span className="ml-auto text-[10px] text-[#475569]">{events.length} events</span>
      </div>

      <div
        className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar"
        style={{ maxHeight }}
      >
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <Zap size={24} className="text-[#334155] mb-2" />
              <p className="text-[12px] text-[#475569]">Waiting for live events…</p>
            </motion.div>
          ) : (
            events.map((event) => {
              const cfg = getFeedStyle(event);
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, x: 16, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{
                    backgroundColor: cfg.bg,
                    border: `1px solid ${cfg.color}20`,
                  }}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-6 h-6 mt-0.5 rounded-lg"
                    style={{ backgroundColor: `${cfg.color}18` }}
                  >
                    <Icon size={12} style={{ color: cfg.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#E2E8F0] font-500 leading-snug line-clamp-2">
                      {event.message}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-600 uppercase" style={{ color: cfg.color }}>
                        {event.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-[#475569]">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
