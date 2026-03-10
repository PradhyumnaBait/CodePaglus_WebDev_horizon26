'use client';

// ============================================================
// OpsPulse — Top Navbar (Light Theme)
// White background header with breadcrumb, status, actions
// ============================================================
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronRight,
  Wifi,
  WifiOff,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAlertsStore } from '@/store/alertsStore';
import { useSocketStore } from '@/store/socketStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { formatRelativeTime } from '@/lib/utils';

// Route label map
const ROUTE_LABELS: Record<string, string[]> = {
  '/dashboard': ['Dashboard'],
  '/dashboard/operations': ['Dashboard', 'Operations'],
  '/dashboard/inventory': ['Dashboard', 'Inventory'],
  '/dashboard/reports': ['Dashboard', 'Reports'],
  '/dashboard/war-room': ['Dashboard', 'War Room'],
  '/dashboard/alerts': ['Dashboard', 'Alerts'],
  '/dashboard/settings': ['Dashboard', 'Settings'],
};

export function Navbar() {
  const pathname = usePathname();
  const unreadCount = useAlertsStore((s) => s.unreadCount);
  const markAllRead = useAlertsStore((s) => s.markAllRead);
  const socketStatus = useSocketStore((s) => s.status);
  const isWarRoomActive = useDashboardStore((s) => s.isWarRoomActive);
  const lastUpdated = useDashboardStore((s) => s.lastUpdated);

  const breadcrumbs = ROUTE_LABELS[pathname] ?? ['Dashboard'];

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 h-14"
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
      }}
    >
      {/* ---- Left: Breadcrumb ---- */}
      <div className="flex items-center gap-2">
        {/* War Room crisis pill */}
        <AnimatePresence>
          {isWarRoomActive && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md mr-2"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="text-[11px] text-[#DC2626] font-semibold uppercase tracking-wide">Crisis</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={13} className="text-[#CBD5E1]" />}
              <span
                className={cn(
                  'text-[14px]',
                  i === breadcrumbs.length - 1
                    ? 'text-[#0F172A] font-semibold'
                    : 'text-[#94A3B8] font-medium',
                )}
                style={{ letterSpacing: '-0.01em' }}
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hidden md:flex"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <RefreshCw size={11} className="text-[#94A3B8]" />
            <span className="text-[11px] text-[#64748B]">
              {formatRelativeTime(lastUpdated)}
            </span>
          </div>
        )}

        {/* Connection Status */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hidden sm:flex"
          style={{
            background: socketStatus === 'connected' ? 'rgba(34,197,94,0.08)' : socketStatus === 'connecting' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
            border: socketStatus === 'connected' ? '1px solid rgba(34,197,94,0.22)' : socketStatus === 'connecting' ? '1px solid rgba(245,158,11,0.22)' : '1px solid rgba(239,68,68,0.22)',
          }}
        >
          {socketStatus === 'connected' ? (
            <Wifi size={12} className="text-[#22C55E]" />
          ) : (
            <WifiOff size={12} className="text-[#EF4444]" />
          )}
          <span
            style={{ fontSize: 11, fontWeight: 600 }}
            className={cn(
              socketStatus === 'connected' ? 'text-[#16A34A]' :
                socketStatus === 'connecting' ? 'text-[#B45309]' :
                  'text-[#DC2626]',
            )}
          >
            {socketStatus === 'connected' ? 'Live' : socketStatus === 'connecting' ? 'Connecting' : 'Offline'}
          </span>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={markAllRead}
            className="navIconBtn relative w-9 h-9"
            style={{
              background: unreadCount > 0 ? 'rgba(239,68,68,0.08)' : '#F8FAFC',
              border: unreadCount > 0 ? '1px solid rgba(239,68,68,0.22)' : '1px solid #E2E8F0',
              color: unreadCount > 0 ? '#DC2626' : '#64748B',
            }}
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          >
            <Bell size={16} />
          </button>

          {/* Badge */}
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-0.5 bg-[#EF4444] text-white text-[9px] font-bold rounded-full border-2 border-white"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <button
          className="navIconBtn w-9 h-9 text-white text-[12px] font-bold"
          style={{ background: 'linear-gradient(120deg,#2563EB,#3B82F6)', border: 'none' }}
          aria-label="User menu"
        >
          A
        </button>
      </div>
    </header>
  );
}