import React from 'react';
import { 
  Layers, 
  MapPin, 
  Flame, 
  Cpu, 
  Compass, 
  ShieldAlert, 
  BarChart3, 
  Bell, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Globe,
  Radio,
  Activity,
  Users,
  Wind
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CityRegion } from '../types';

export type WorkspaceTab = 
  | 'landing'
  | 'dashboard'
  | 'digitaltwin'
  | 'hotspots'
  | 'simulator'
  | 'community'
  | 'report'
  | 'analysis'
  | 'risk'
  | 'authority'
  | 'analytics';

interface SidebarProps {
  currentTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  selectedCity: CityRegion;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  unreadCount,
  onOpenNotifications,
  onOpenSettings,
  selectedCity,
}: SidebarProps) {
  const mainNavItems: {
    id: WorkspaceTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'dashboard', label: 'Overview', icon: Layers },
    { id: 'digitaltwin', label: 'Digital Twin', icon: Activity, badge: 'Twin' },
    { id: 'hotspots', label: 'Pollution Map', icon: MapPin },
    { id: 'simulator', label: 'Spread Simulator', icon: Wind, badge: 'AI' },
    { id: 'community', label: 'Community AirWatch', icon: Users },
    { id: 'report', label: 'Report Pollution', icon: Flame, badge: 'Submit' },
    { id: 'analysis', label: 'AI Vision Lab', icon: Cpu },
    { id: 'risk', label: 'Risk Intelligence', icon: Compass },
    { id: 'authority', label: 'Authority Center', icon: ShieldAlert },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 ease-in-out flex flex-col bg-[#0C1513]/95 backdrop-blur-2xl border-r border-[#5CF2B2]/12 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-[#5CF2B2]/10">
        <button
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-3 text-left overflow-hidden group focus:outline-none"
          title="Return to AirLens AI Landing"
        >
          <BrandLogo size="md" showWordmark={!isCollapsed} />
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-xl text-[#8A9A92] hover:text-[#5CF2B2] hover:bg-[#123C30] transition-colors border border-transparent hover:border-[#5CF2B2]/20 shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Region Status Pill (when expanded) */}
      {!isCollapsed ? (
        <div className="mx-4 mt-4 p-3 rounded-2xl bg-[#071713]/70 border border-[#5CF2B2]/15 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#5CF2B2] animate-ping" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider block">
                Monitored Metro
              </span>
              <span className="text-xs font-heading font-semibold text-[#F4F8F5] truncate block">
                {selectedCity.name}
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/20">
            ACTIVE
          </span>
        </div>
      ) : (
        <div className="mx-auto mt-4 w-10 h-10 rounded-2xl bg-[#071713] border border-[#5CF2B2]/20 flex items-center justify-center" title={selectedCity.name}>
          <Globe className="w-4 h-4 text-[#5CF2B2]" />
        </div>
      )}

      {/* Primary Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full group relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#123C30] to-[#0E1D19] text-[#5CF2B2] border border-[#5CF2B2]/35 shadow-lg shadow-[#071713]/60 font-semibold'
                  : 'text-[#8A9A92] hover:text-[#F4F8F5] hover:bg-[#123C30]/40 border border-transparent'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Left active marker glow */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#5CF2B2] rounded-r-full shadow-[0_0_12px_#5CF2B2]" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-[#5CF2B2]' : 'text-[#8A9A92] group-hover:text-[#A6C7B5]'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#5CF2B2]/15 text-[#5CF2B2] border border-[#5CF2B2]/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Floating Action Button inside Sidebar */}
      <div className="p-3 border-t border-[#5CF2B2]/10 space-y-2">
        {!isCollapsed ? (
          <button
            onClick={() => onSelectTab('report')}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#5CF2B2] via-[#48e3a2] to-[#2cd490] hover:brightness-105 text-[#071713] font-heading font-bold text-xs shadow-xl shadow-[#5CF2B2]/20 flex items-center justify-center gap-2 group transition-all"
          >
            <Flame className="w-4 h-4 fill-current text-[#071713]" />
            <span>Report Pollution</span>
          </button>
        ) : (
          <button
            onClick={() => onSelectTab('report')}
            className="w-12 h-12 mx-auto rounded-2xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] flex items-center justify-center shadow-lg shadow-[#5CF2B2]/25 transition-transform hover:scale-105"
            title="Report Pollution"
          >
            <Flame className="w-5 h-5 fill-current" />
          </button>
        )}

        {/* Notifications & Settings actions */}
        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between px-1'} pt-1`}>
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-[#8A9A92] hover:text-[#F4F8F5] hover:bg-[#123C30] transition-colors"
            title="Incident Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#5CF2B2] ring-2 ring-[#0C1513]" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-[#8A9A92] hover:text-[#F4F8F5] hover:bg-[#123C30] transition-colors"
            title="Settings & Telemetry Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
