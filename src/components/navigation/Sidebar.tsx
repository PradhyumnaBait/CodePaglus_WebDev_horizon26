'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Zap,
  Package,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAlertsStore } from '@/store/alertsStore';
import { useSocketStore } from '@/store/socketStore';
import { useDashboardStore } from '@/store/dashboardStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  warRoom?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Operations', href: '/dashboard/operations', icon: Settings2 },
  { label: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { label: 'Reports', href: '/dashboard/reports', icon: FileText },
  { label: 'War Room', href: '/dashboard/war-room', icon: Siren, warRoom: true },
  { label: 'Alerts', href: '/dashboard/alerts', icon: Bell },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const unreadCount = useAlertsStore((s) => s.unreadCount);
  const socketStatus = useSocketStore((s) => s.status);
  const isWarRoomActive = useDashboardStore((s) => s.isWarRoomActive);

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 z-40"
      style={{ width: '228px', minWidth: '228px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0' }}
    >
      {/* ---- Logo ---- */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div
          className="relative flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: 'linear-gradient(120deg,#2563EB,#3B82F6)', boxShadow: '0 4px 16px rgba(37,99,235,0.25)' }}
        >
          <Activity size={18} className="text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse-glow" style={{ background: '#22C55E' }} />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-[#0F172A] leading-tight" style={{ letterSpacing: '-0.02em' }}>
            OpsPulse
          </h1>
          <p className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider">
            Business Health
          </p>
        </div>
      </div>

      {/* ---- Store Info ---- */}
      <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-lg flex items-center gap-2.5"
        style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <Store size={14} className="text-[#64748B] flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] text-[#94A3B8] font-medium">Active Store</p>
          <p className="text-[13px] text-[#0F172A] font-semibold truncate">Main Branch</p>
        </div>
        <div
          className={cn('ml-auto w-2 h-2 rounded-full flex-shrink-0',
            socketStatus === 'connected' ? 'bg-[#22C55E]' :
              socketStatus === 'connecting' ? 'bg-[#F59E0B] animate-pulse' : 'bg-[#EF4444]'
          )}
          title={`WebSocket: ${socketStatus}`}
        />
      </div>

      {/* ---- Navigation ---- */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <p className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-widest px-3 pb-2 pt-1">
          Navigation
        </p>

        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          const badge = item.label === 'Alerts' ? unreadCount : undefined;
          const isWarRoom = item.warRoom && isWarRoomActive;

          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div
                className={cn('navItem', isActive && 'active', isWarRoom && !isActive && 'animate-crisis-pulse')}
                style={isWarRoom && !isActive ? { color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', background: 'transparent' } : {}}
              >
                <Icon
                  size={16}
                  className={cn(
                    'flex-shrink-0',
                    isActive ? 'text-[#2563EB]' : isWarRoom ? 'text-[#EF4444]' : 'text-[#94A3B8]',
                  )}
                />
                <span className={cn(
                  'flex-1 text-[13.5px]',
                  isActive ? 'text-[#0F172A] font-semibold' : isWarRoom ? 'text-[#DC2626] font-semibold' : '',
                )}>
                  {item.label}
                </span>

                {badge !== undefined && badge > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-4 px-1 bg-[#EF4444] text-white text-[10px] font-bold rounded-full">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
                {isWarRoom && !isActive && <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />}
                {isActive && <ChevronRight size={14} className="text-[#2563EB] opacity-60" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ---- Bottom User Section ---- */}
      <div className="p-3" style={{ borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Status pill */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <Zap size={12} className="text-[#F59E0B]" />
          <span className="text-[11px] text-[#64748B]">Real-time</span>
          <span className={cn('ml-auto text-[10px] font-semibold uppercase',
            socketStatus === 'connected' ? 'text-[#22C55E]' : 'text-[#EF4444]'
          )}>
            {socketStatus === 'connected' ? 'Live' : socketStatus}
          </span>
        </div>

        {/* User row */}
        <div className="navItem" style={{ cursor: 'pointer' }}>
          <div className="flex items-center justify-center w-7 h-7 rounded-full text-white text-[11px] font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(120deg,#2563EB,#3B82F6)' }}>
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-[#0F172A] font-medium truncate">Admin User</p>
            <p className="text-[10px] text-[#94A3B8] truncate">Owner</p>
          </div>
          <LogOut size={13} className="text-[#CBD5E1] flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}