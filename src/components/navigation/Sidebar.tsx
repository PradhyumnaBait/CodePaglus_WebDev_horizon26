'use client';

// ============================================================
// OpsPulse — Sidebar Navigation
// 240px fixed sidebar with logo, nav links, and user section
// ============================================================
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Settings2,
  Siren,
  Bell,
  Settings,
  Activity,
  ChevronRight,
  Store,
  LogOut,
  User,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAlertsStore } from '@/store/alertsStore';
import { useSocketStore } from '@/store/socketStore';
import { useDashboardStore } from '@/store/dashboardStore';

interface NavItem {
  label:   string;
  href:    string;
  icon:    React.ComponentType<{ size?: number; className?: string }>;
  badge?:  number;
  warRoom?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  href: '/dashboard',            icon: LayoutDashboard },
  { label: 'Operations', href: '/dashboard/operations', icon: Settings2 },
  { label: 'War Room',   href: '/dashboard/war-room',   icon: Siren, warRoom: true },
  { label: 'Alerts',     href: '/dashboard/alerts',     icon: Bell },
  { label: 'Settings',   href: '/dashboard/settings',   icon: Settings },
];

export function Sidebar() {
  const pathname       = usePathname();
  const unreadCount    = useAlertsStore((s) => s.unreadCount);
  const socketStatus   = useSocketStore((s) => s.status);
  const isWarRoomActive = useDashboardStore((s) => s.isWarRoomActive);

  return (
    <aside
      style={{ width: '240px', minWidth: '240px' }}
      className="sidebar-gradient flex flex-col h-screen border-r border-[#1E293B] sticky top-0 z-40"
    >
      {/* ---- Logo ---- */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1E293B]">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#3B82F6] shadow-lg" style={{ boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}>
          <Activity size={18} className="text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#10B981] rounded-full border-2 border-[#0F172A] animate-pulse-glow" />
        </div>
        <div>
          <h1 className="text-[15px] font-700 text-[#F1F5F9] leading-tight tracking-tight">
            OpsPulse
          </h1>
          <p className="text-[10px] text-[#64748B] font-500 uppercase tracking-wider">
            Business Health
          </p>
        </div>
      </div>

      {/* ---- Store Info ---- */}
      <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center gap-2.5">
        <Store size={14} className="text-[#94A3B8] flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] text-[#64748B] font-500">Active Store</p>
          <p className="text-[13px] text-[#F1F5F9] font-600 truncate">Main Branch</p>
        </div>
        <div
          className={cn(
            'ml-auto w-2 h-2 rounded-full flex-shrink-0',
            socketStatus === 'connected'    ? 'bg-[#10B981]' :
            socketStatus === 'connecting'   ? 'bg-[#F59E0B] animate-pulse' :
            'bg-[#EF4444]',
          )}
          title={`WebSocket: ${socketStatus}`}
        />
      </div>

      {/* ---- Navigation ---- */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] text-[#475569] font-600 uppercase tracking-widest px-3 pb-2 pt-1">
          Navigation
        </p>

        {NAV_ITEMS.map((item) => {
          const isActive   = item.href === '/dashboard'
            ? pathname === '/dashboard'           // exact match — prevents /dashboard/xyz from also activating Dashboard
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon       = item.icon;
          const badge      = item.label === 'Alerts' ? unreadCount : undefined;
          const isWarRoom  = item.warRoom && isWarRoomActive;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer group transition-all duration-150',
                  isActive
                    ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6] border border-[rgba(59,130,246,0.2)]'
                    : isWarRoom
                    ? 'animate-crisis-pulse text-[#EF4444] border border-[rgba(239,68,68,0.2)]'
                    : 'text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#1E293B] border border-transparent',
                )}
              >
                {/* Active bar indicator */}
                {isActive && (
                  <span className="absolute left-0 w-0.5 h-6 bg-[#3B82F6] rounded-r-full" />
                )}

                <Icon
                  size={17}
                  className={cn(
                    'flex-shrink-0 transition-colors',
                    isActive  ? 'text-[#3B82F6]' :
                    isWarRoom ? 'text-[#EF4444]'  :
                    'text-[#475569] group-hover:text-[#94A3B8]',
                  )}
                />

                <span className={cn(
                  'flex-1 text-[13px] font-500 transition-colors',
                  isActive  ? 'text-[#F1F5F9] font-600' :
                  isWarRoom ? 'text-[#FCA5A5] font-600'  :
                  '',
                )}>
                  {item.label}
                </span>

                {/* Badge */}
                {badge !== undefined && badge > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-4.5 px-1 bg-[#EF4444] text-white text-[10px] font-700 rounded-full">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}

                {/* War room pulse indicator */}
                {isWarRoom && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                )}

                {/* Active chevron */}
                {isActive && (
                  <ChevronRight size={14} className="text-[#3B82F6] opacity-60" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ---- Bottom User Section ---- */}
      <div className="border-t border-[#1E293B] p-3 space-y-1">
        {/* Quick status pill */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0F172A] border border-[#1E293B]">
          <Zap size={12} className="text-[#F59E0B]" />
          <span className="text-[11px] text-[#64748B]">Real-time</span>
          <span className={cn(
            'ml-auto text-[10px] font-600 uppercase',
            socketStatus === 'connected' ? 'text-[#10B981]' : 'text-[#EF4444]',
          )}>
            {socketStatus === 'connected' ? 'Live' : socketStatus}
          </span>
        </div>

        {/* User row */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#1E293B] cursor-pointer transition-colors group">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#3B82F6] text-white text-[11px] font-700 flex-shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-[#F1F5F9] font-500 truncate">Admin User</p>
            <p className="text-[10px] text-[#64748B] truncate">Owner</p>
          </div>
          <LogOut size={13} className="text-[#475569] group-hover:text-[#94A3B8] transition-colors flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
