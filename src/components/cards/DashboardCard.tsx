'use client';

// ============================================================
// OpsPulse — DashboardCard
// Base container for all dashboard panels — enhanced with
// blue top-accent line on hover and richer shadow system
// ============================================================
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'flat' | 'glow';
  glowColor?: string;
  /** If set, animates in with a stagger delay */
  delay?: number;
  onClick?: () => void;
}

export function DashboardCard({
  children,
  className,
  style,
  variant = 'default',
  glowColor,
  delay = 0,
  onClick,
}: DashboardCardProps) {
  const base = cn(
    'relative rounded-2xl p-5 transition-all duration-200 overflow-hidden',
    variant === 'default' && 'ops-card',
    variant === 'flat'    && 'ops-card-flat',
    variant === 'glow'    && 'ops-card border border-[rgba(37,99,235,0.2)]',
    onClick && 'cursor-pointer',
    className,
  );

  const computedStyle: React.CSSProperties = {
    ...style,
    ...(glowColor
      ? { boxShadow: `0 0 28px ${glowColor}18, 0 2px 8px rgba(0,0,0,0.06)` }
      : {}),
  };

  return (
    <motion.div
      className={base}
      style={computedStyle}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={onClick ? { scale: 1.01, y: -2 } : undefined}
      onClick={onClick}
    >
      {/* Animated top accent line — only shows when hovered via CSS */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.22) 50%, transparent 100%)',
        }}
      />
      {children}
    </motion.div>
  );
}

/** Compact inline card header with optional icon + trailing action */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-2.5">
        {icon && (
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: 'rgba(37,99,235,0.08)' }}
          >
            {icon}
          </div>
        )}
        <div>
          <h3
            className="text-[14px] leading-tight"
            style={{ fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em' }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}