import React from 'react';
import { 
  Flame, 
  Wind, 
  Trash2, 
  HardHat, 
  Factory, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  UserCheck, 
  XCircle, 
  Activity, 
  Radio
} from 'lucide-react';
import { ReportCategory, VerificationStatus, PriorityLevel, RiskLevel } from '../types';

export const CATEGORY_CONFIG: Record<
  ReportCategory, 
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string; accentHex: string }
> = {
  smoke: {
    label: 'Smoke Plume',
    icon: Flame,
    color: 'text-[#F6B94B]',
    bg: 'bg-[#F6B94B]/10',
    border: 'border-[#F6B94B]/30',
    accentHex: '#F6B94B',
  },
  dust: {
    label: 'Road & Silt Dust',
    icon: Wind,
    color: 'text-[#A6C7B5]',
    bg: 'bg-[#A6C7B5]/10',
    border: 'border-[#A6C7B5]/30',
    accentHex: '#A6C7B5',
  },
  waste_burning: {
    label: 'Waste Burning',
    icon: Trash2,
    color: 'text-[#FF6B65]',
    bg: 'bg-[#FF6B65]/10',
    border: 'border-[#FF6B65]/30',
    accentHex: '#FF6B65',
  },
  construction_activity: {
    label: 'Construction Activity',
    icon: HardHat,
    color: 'text-[#F6B94B]',
    bg: 'bg-[#F6B94B]/10',
    border: 'border-[#F6B94B]/30',
    accentHex: '#F6B94B',
  },
  industrial_emissions: {
    label: 'Industrial Stack',
    icon: Factory,
    color: 'text-[#A78BFA]',
    bg: 'bg-[#A78BFA]/10',
    border: 'border-[#A78BFA]/30',
    accentHex: '#A78BFA',
  },
  other: {
    label: 'Visible Emission',
    icon: AlertCircle,
    color: 'text-[#5CF2B2]',
    bg: 'bg-[#5CF2B2]/10',
    border: 'border-[#5CF2B2]/30',
    accentHex: '#5CF2B2',
  },
};

export function CategoryBadge({ 
  category, 
  size = 'sm',
  className = ''
}: { 
  category: ReportCategory; 
  size?: 'sm' | 'md';
  className?: string;
}) {
  const conf = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
  const Icon = conf.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border ${conf.bg} ${conf.color} ${conf.border} font-mono tracking-tight ${sizeClasses} ${className}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{conf.label}</span>
    </span>
  );
}

export function StatusBadge({ status, className = '' }: { status: VerificationStatus; className?: string }) {
  switch (status) {
    case 'Submitted':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/25 ${className}`}>
          <Clock className="w-3 h-3 text-[#60A5FA]" />
          <span>Submitted</span>
        </span>
      );
    case 'Under Review':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-[#F6B94B]/10 text-[#F6B94B] border border-[#F6B94B]/30 ${className}`}>
          <Activity className="w-3 h-3 text-[#F6B94B] animate-pulse" />
          <span>Under Review</span>
        </span>
      );
    case 'Verified':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-[#5CF2B2]/10 text-[#5CF2B2] border border-[#5CF2B2]/30 ${className}`}>
          <CheckCircle2 className="w-3 h-3 text-[#5CF2B2]" />
          <span>Verified</span>
        </span>
      );
    case 'Assigned':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-[#A855F7]/10 text-[#C084FC] border border-[#A855F7]/25 ${className}`}>
          <UserCheck className="w-3 h-3 text-[#C084FC]" />
          <span>Assigned</span>
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-[#06B6D4]/10 text-[#22D3EE] border border-[#06B6D4]/25 ${className}`}>
          <Radio className="w-3 h-3 text-[#22D3EE] animate-pulse" />
          <span>In Progress</span>
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/30 ${className}`}>
          <CheckCircle2 className="w-3 h-3 text-[#5CF2B2]" />
          <span>Resolved</span>
        </span>
      );
    case 'Rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-[#FF6B65]/10 text-[#FF6B65] border border-[#FF6B65]/25 ${className}`}>
          <XCircle className="w-3 h-3 text-[#FF6B65]" />
          <span>Rejected</span>
        </span>
      );
  }
}

export function PriorityBadge({ priority, className = '' }: { priority: PriorityLevel; className?: string }) {
  switch (priority) {
    case 'Critical':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-[#FF6B65]/15 text-[#FF6B65] border border-[#FF6B65]/35 animate-pulse ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B65]" />
          <span>Critical</span>
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-[#F6B94B]/15 text-[#F6B94B] border border-[#F6B94B]/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F6B94B]" />
          <span>High Priority</span>
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-[#8A9A92]/10 text-[#A6C7B5] border border-[#8A9A92]/25 ${className}`}>
          <span>Medium</span>
        </span>
      );
    case 'Low':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-[#5CF2B2]/10 text-[#5CF2B2] border border-[#5CF2B2]/25 ${className}`}>
          <span>Low</span>
        </span>
      );
  }
}

export function RiskBadge({ risk, className = '' }: { risk: RiskLevel; className?: string }) {
  switch (risk) {
    case 'Elevated':
    case 'Critical':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#FF6B65]/15 text-[#FF6B65] border border-[#FF6B65]/35 ${className}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-[#FF6B65]" />
          <span>Elevated Dispersion Risk</span>
        </span>
      );
    case 'Moderate':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#F6B94B]/15 text-[#F6B94B] border border-[#F6B94B]/35 ${className}`}>
          <Activity className="w-3.5 h-3.5 text-[#F6B94B]" />
          <span>Moderate Local Dispersion</span>
        </span>
      );
    case 'Low':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-[#5CF2B2]/15 text-[#5CF2B2] border border-[#5CF2B2]/30 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-[#5CF2B2]" />
          <span>Low Stagnation Risk</span>
        </span>
      );
  }
}

export function DataSourceBadge({ isLive, label }: { isLive: boolean; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0C1513] border border-[#5CF2B2]/20 text-[11px] font-mono text-[#8A9A92]">
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-[#5CF2B2] animate-pulse' : 'bg-[#F6B94B]'}`} />
      <span className="text-[#F4F8F5] font-medium">{label}</span>
      <span className="text-[#8A9A92]">·</span>
      <span className="text-[10px] uppercase tracking-wider text-[#A6C7B5]">
        {isLive ? 'Live API Feed' : 'Calibrated Proxy'}
      </span>
    </div>
  );
}
