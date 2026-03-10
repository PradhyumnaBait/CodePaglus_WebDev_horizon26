'use client';

// ============================================================
// OpsPulse — DashboardCard
// Base container for all dashboard panels
// ============================================================
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DashboardCardProps {
  children:   ReactNode;
  className?: string;
  variant?:   'default' | 'flat' | 'glow';
  glowColor?: string;
  /** If set, animates in with a stagger delay */
  delay?:     number;
  onClick?:   () => void;
}

export function DashboardCard({
  children,
  className,
  variant   = 'default',
  glowColor,
  delay     = 0,
  onClick,
}: DashboardCardProps) {
  const base = cn(
    'relative rounded-2xl p-5 transition-all duration-200 overflow-hidden',
    variant === 'default' && 'ops-card',
    variant === 'flat'    && 'ops-card-flat',
    variant === 'glow'    && 'ops-card border border-[rgba(59,130,246,0.2)]',
    onClick && 'cursor-pointer',
    className,
  );

  const style = glowColor
    ? { boxShadow: `0 0 24px ${glowColor}20, 0 4px 24px rgba(0,0,0,0.4)` }
    : undefined;

  return (
    <motion.div
      className={base}
      style={style}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      whileHover={onClick ? { scale: 1.01, y: -1 } : undefined}
      onClick={onClick}
    >
      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />
      {children}
    </motion.div>
  );
}

/** Compact inline card header with optional icon + trailing action */
interface CardHeaderProps {
  title:    string;
  subtitle?: string;
  icon?:    ReactNode;
  action?:  ReactNode;
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-2.5">
        {icon && (
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-[14px] font-600 text-[#F1F5F9] leading-tight">{title}</h3>
          {subtitle && <p className="text-[11px] text-[#64748B] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
