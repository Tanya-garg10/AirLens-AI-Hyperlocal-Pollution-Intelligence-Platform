import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  ChevronDown, 
  Flame, 
  User, 
  Menu, 
  Wind, 
  Radio, 
  RefreshCw,
  Check,
  Calendar
} from 'lucide-react';
import { CityRegion, WeatherData, AirQualityData } from '../types';
import { SUPPORTED_CITIES } from '../data/cities';
import { BrandLogo } from './BrandLogo';

export type UserRole = 'citizen' | 'inspector' | 'officer' | 'pcb_lead';

interface TopBarProps {
  selectedCity: CityRegion;
  onSelectCity: (city: CityRegion) => void;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenReport: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  onResetDemo: () => void;
}

export function TopBar({
  selectedCity,
  onSelectCity,
  weather,
  airQuality,
  unreadCount,
  onOpenNotifications,
  onOpenReport,
  isDarkTheme,
  onToggleTheme,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  userRole,
  onChangeUserRole,
  onResetDemo,
}: TopBarProps) {
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    citizen: { label: 'Citizen Observer', badge: 'Public Access', color: 'text-[#5CF2B2]' },
    inspector: { label: 'Field Rapid Squad', badge: 'Ground Inspector', color: 'text-[#F6B94B]' },
    officer: { label: 'Municipal Triage Lead', badge: 'Ward Authority', color: 'text-[#A6C7B5]' },
    pcb_lead: { label: 'State PCB Analyst', badge: 'Regulatory Board', color: 'text-[#5CF2B2]' },
  };

  const handleReset = async () => {
    setIsResetting(true);
    await onResetDemo();
    setTimeout(() => setIsResetting(false), 600);
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0C1513]/90 backdrop-blur-xl border-b border-[#5CF2B2]/12 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Mobile Hamburger & Logo for small screens */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl bg-[#071713] border border-[#5CF2B2]/20 text-[#F4F8F5]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <BrandLogo size="sm" showWordmark={true} />
      </div>

      {/* Region Selector with Dropdown */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setRegionMenuOpen(!regionMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#071713]/80 hover:bg-[#123C30]/60 border border-[#5CF2B2]/20 text-xs font-medium text-[#F4F8F5] transition-all group shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-[#5CF2B2] animate-pulse" />
            <span className="font-heading font-semibold text-xs tracking-tight text-[#F4F8F5]">
              {selectedCity.name}
            </span>
            <span className="text-[#8A9A92] text-[10px] font-mono hidden md:inline">
              ({selectedCity.state})
            </span>
            <ChevronDown className="w-3 h-3 text-[#8A9A92] group-hover:text-[#5CF2B2] transition-transform duration-200" />
          </button>

          {regionMenuOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-[#0C1513]/95 backdrop-blur-2xl border border-[#5CF2B2]/25 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider border-b border-[#5CF2B2]/10">
                Monitoring Regions
              </div>
              <div className="py-1 space-y-1">
                {SUPPORTED_CITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCity(c);
                      setRegionMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      c.id === selectedCity.id
                        ? 'bg-[#123C30] text-[#5CF2B2] font-semibold border border-[#5CF2B2]/30'
                        : 'text-[#8A9A92] hover:bg-[#071713] hover:text-[#F4F8F5]'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-[#F4F8F5]">{c.name}</div>
                      <div className="text-[10px] text-[#8A9A92] font-mono">{c.defaultStation.split('/')[0]}</div>
                    </div>
                    {c.id === selectedCity.id && <Check className="w-3.5 h-3.5 text-[#5CF2B2]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Real-time Atmospheric Pill */}
        {weather && (
          <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-xl bg-[#071713]/60 border border-[#5CF2B2]/12 text-xs font-mono text-[#8A9A92]">
            <span className="flex items-center gap-1.5 text-[#5CF2B2] font-semibold">
              <span className="tabular-nums">{weather.temperature}°C</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#8A9A92]/40" />
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-[#A6C7B5]" />
              <span className="tabular-nums">{weather.windSpeed} km/h</span>
            </span>
            {airQuality && (
              <>
                <span className="w-1 h-1 rounded-full bg-[#8A9A92]/40" />
                <span
                  className={`font-bold tabular-nums ${
                    airQuality.aqi > 200
                      ? 'text-[#FF6B65]'
                      : airQuality.aqi > 150
                      ? 'text-[#F6B94B]'
                      : 'text-[#5CF2B2]'
                  }`}
                >
                  AQI {airQuality.aqi}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-[#8A9A92] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search report ID, corridor, or sector..."
            className="w-full bg-[#071713]/80 border border-[#5CF2B2]/15 focus:border-[#5CF2B2] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F4F8F5] placeholder:text-[#8A9A92]/60 focus:outline-none transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A9A92] hover:text-[#F4F8F5]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2">
        {/* Reset Demo Data */}
        <button
          onClick={handleReset}
          disabled={isResetting}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#071713]/60 hover:bg-[#123C30] border border-[#5CF2B2]/15 text-[#8A9A92] hover:text-[#5CF2B2] text-xs font-mono transition-colors"
          title="Reset Demo State"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-[#5CF2B2]' : ''}`} />
          <span className="hidden xl:inline">Refresh Data</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-[#071713]/80 hover:bg-[#123C30] border border-[#5CF2B2]/15 text-[#8A9A92] hover:text-[#5CF2B2] transition-colors"
          title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Forest Theme'}
        >
          {isDarkTheme ? <Sun className="w-4 h-4 text-[#F6B94B]" /> : <Moon className="w-4 h-4 text-[#A6C7B5]" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-[#071713]/80 hover:bg-[#123C30] border border-[#5CF2B2]/15 text-[#8A9A92] hover:text-[#F4F8F5] transition-colors"
          title="Incident Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5CF2B2] text-[#071713] font-black text-[10px] rounded-full flex items-center justify-center shadow-lg shadow-[#5CF2B2]/40 animate-pulse font-mono">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Role & Profile Switcher */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#071713]/80 hover:bg-[#123C30] border border-[#5CF2B2]/20 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#123C30] to-[#5CF2B2]/30 border border-[#5CF2B2]/40 flex items-center justify-center text-[#5CF2B2]">
              <User className="w-3 h-3" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-[#F4F8F5] leading-tight">
                {roleLabels[userRole].label}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-[#8A9A92] hidden sm:block" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0C1513]/95 backdrop-blur-2xl border border-[#5CF2B2]/25 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider border-b border-[#5CF2B2]/10">
                Operational Persona
              </div>
              <div className="py-1 space-y-1">
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onChangeUserRole(r);
                      setProfileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      userRole === r
                        ? 'bg-[#123C30] text-[#5CF2B2] font-semibold border border-[#5CF2B2]/30'
                        : 'text-[#8A9A92] hover:bg-[#071713] hover:text-[#F4F8F5]'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-[#F4F8F5]">{roleLabels[r].label}</div>
                      <div className="text-[10px] text-[#8A9A92] font-mono">{roleLabels[r].badge}</div>
                    </div>
                    {userRole === r && <Check className="w-3.5 h-3.5 text-[#5CF2B2]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary Report Button */}
        <button
          onClick={onOpenReport}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-xs shadow-md shadow-[#5CF2B2]/20 transition-all hover:scale-102"
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Report</span>
        </button>
      </div>
    </header>
  );
}
