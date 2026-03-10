'use client';

// ============================================================
// OpsPulse — Top Navbar
// ============================================================
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  RefreshCw,
  ChevronRight,
  Wifi,
  WifiOff,
  AlertTriangle,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAlertsStore } from '@/store/alertsStore';
import { useSocketStore } from '@/store/socketStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { formatRelativeTime } from '@/lib/utils';

// Route label map
const ROUTE_LABELS: Record<string, string[]> = {
  '/dashboard':            ['Dashboard'],
  '/dashboard/operations': ['Dashboard', 'Operations'],
  '/dashboard/war-room':   ['Dashboard', 'War Room'],
  '/dashboard/alerts':     ['Dashboard', 'Alerts'],
  '/dashboard/settings':   ['Dashboard', 'Settings'],
};

export function Navbar() {
  const pathname       = usePathname();
  const unreadCount    = useAlertsStore((s) => s.unreadCount);
  const markAllRead    = useAlertsStore((s) => s.markAllRead);
  const socketStatus   = useSocketStore((s) => s.status);
  const isWarRoomActive = useDashboardStore((s) => s.isWarRoomActive);
  const lastUpdated    = useDashboardStore((s) => s.lastUpdated);

  const breadcrumbs    = ROUTE_LABELS[pathname] ?? ['Dashboard'];
  const pageTitle      = breadcrumbs[breadcrumbs.length - 1];

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between px-6 h-16 border-b transition-colors duration-300',
        isWarRoomActive
          ? 'bg-[#1A0A0A] border-[rgba(239,68,68,0.3)]'
          : 'bg-[#0F172A] border-[#1E293B]',
      )}
    >
      {/* ---- Left: Breadcrumb / Title ---- */}
      <div className="flex items-center gap-2">
        {/* War Room indicator */}
        <AnimatePresence>
          {isWarRoomActive && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] mr-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="text-[11px] text-[#FCA5A5] font-600 uppercase tracking-wide">Crisis</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={13} className="text-[#334155]" />}
              <span
                className={cn(
                  'text-[14px] font-500',
                  i === breadcrumbs.length - 1
                    ? 'text-[#F1F5F9] font-700'
                    : 'text-[#64748B]',
                )}
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* ---- Right: Actions ---- */}
      <div className="flex items-center gap-2">
        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] hidden md:flex">
            <RefreshCw size={11} className="text-[#64748B]" />
            <span className="text-[11px] text-[#64748B]">
              {formatRelativeTime(lastUpdated)}
            </span>
          </div>
        )}

        {/* Connection Status */}
        <div
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border hidden sm:flex',
            socketStatus === 'connected'
              ? 'bg-[rgba(16,185,129,0.08)] border-[rgba(16,185,129,0.2)]'
              : socketStatus === 'connecting'
              ? 'bg-[rgba(245,158,11,0.08)] border-[rgba(245,158,11,0.2)]'
              : 'bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.2)]',
          )}
        >
          {socketStatus === 'connected' ? (
            <Wifi size={12} className="text-[#10B981]" />
          ) : (
            <WifiOff size={12} className="text-[#EF4444]" />
          )}
          <span
            className={cn(
              'text-[11px] font-500',
              socketStatus === 'connected' ? 'text-[#10B981]' :
              socketStatus === 'connecting' ? 'text-[#F59E0B]' :
              'text-[#EF4444]',
            )}
          >
            {socketStatus === 'connected' ? 'Live' : socketStatus === 'connecting' ? 'Connecting' : 'Offline'}
          </span>
        </div>

        {/* Search Button */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-[#64748B] hover:text-[#F1F5F9] hover:border-[#475569] transition-all duration-150 hidden md:flex"
          aria-label="Search"
        >
          <Search size={13} />
          <span className="text-[12px] font-500">Search</span>
          <kbd className="text-[10px] px-1 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[#475569] font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={markAllRead}
            className={cn(
              'relative flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-150',
              unreadCount > 0
                ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)] text-[#EF4444] hover:bg-[rgba(239,68,68,0.2)]'
                : 'bg-[#1E293B] border-[#334155] text-[#64748B] hover:text-[#F1F5F9] hover:border-[#475569]',
            )}
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          >
            <AnimatePresence mode="wait">
              {unreadCount > 0 ? (
                <motion.div
                  key="bell-active"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <Bell size={16} className="text-[#EF4444]" />
                </motion.div>
              ) : (
                <Bell key="bell-idle" size={16} />
              )}
            </AnimatePresence>
          </button>

          {/* Badge */}
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-0.5 bg-[#EF4444] text-white text-[9px] font-700 rounded-full border-2 border-[#0F172A]"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-white text-[12px] font-700 border border-[rgba(59,130,246,0.3)] hover:opacity-90 transition-opacity"
          aria-label="User menu"
        >
          A
        </button>
      </div>
    </header>
  );
}
