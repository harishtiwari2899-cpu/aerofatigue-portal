import React from 'react';
import { RiskCategory } from '../../types/fatigue';
import { ShieldCheck, AlertTriangle, AlertOctagon, ShieldAlert } from 'lucide-react';

interface RiskBadgeProps {
  category: RiskCategory;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getBadgeConfig = () => {
    switch (category) {
      case 'LOW':
        return {
          label: 'LOW RISK',
          colorClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10',
          icon: <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        };
      case 'MODERATE':
        return {
          label: 'MODERATE RISK',
          colorClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        };
      case 'HIGH':
        return {
          label: 'HIGH RISK',
          colorClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-orange-500/20',
          icon: <ShieldAlert className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        };
      case 'CRITICAL':
        return {
          label: 'CRITICAL RISK',
          colorClass: 'bg-rose-500/25 text-rose-400 border-rose-500/50 shadow-rose-500/30 animate-pulse',
          icon: <AlertOctagon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        };
    }
  };

  const { label, colorClass, icon } = getBadgeConfig();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-3 py-1 text-xs font-bold tracking-wider gap-1.5',
    lg: 'px-4 py-1.5 text-sm font-bold tracking-wider gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${sizeClasses[size]} ${colorClass} ${className}`}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};
