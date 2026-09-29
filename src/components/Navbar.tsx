import React, { useState } from 'react';
import { 
  Wind, 
  MapPin, 
  Leaf, 
  Bell, 
  RefreshCw, 
  Menu, 
  X, 
  Sparkles, 
  BarChart3, 
  ShieldAlert, 
  FileText, 
  Flame, 
  Compass,
  Cpu,
  Layers,
  ChevronDown
} from 'lucide-react';
import { CityRegion, WeatherData, AirQualityData } from '../types';
import { SUPPORTED_CITIES } from '../data/cities';
import { DataSourceBadge } from './Badges';

export type NavTab = 
  | 'landing'
  | 'dashboard'
  | 'report'
  | 'analysis'
  | 'hotspots'
  | 'risk'
  | 'authority'
  | 'analytics';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  selectedCity: CityRegion;
  onSelectCity: (city: CityRegion) => void;
  weather?: WeatherData | null;
  airQuality?: AirQualityData | null;
  unreadCount: number;
  onOpenNotifications: () => void;
  onResetDemo: () => void;
}

export function Navbar({
  currentTab,
  onSelectTab,
  selectedCity,
  onSelectCity,
  weather,
  airQuality,
  unreadCount,
  onOpenNotifications,
  onResetDemo
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleResetClick = async () => {
    setResetting(true);
    await onResetDemo();
    setTimeout(() => setResetting(false), 600);
  };

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Command Center', icon: Layers },
    { id: 'report', label: 'Report Pollution', icon: Flame },
    { id: 'analysis', label: 'AI Vision Lab', icon: Cpu },
    { id: 'hotspots', label: 'Hotspot Map', icon: MapPin },
    { id: 'risk', label: 'Risk Intelligence', icon: Compass },
    { id: 'authority', label: 'Authority Triage', icon: ShieldAlert },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b1220]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Hackathon Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('landing')}
              className="flex items-center gap-2.5 group text-left"
            >
              {/* Stylized Air wave + Map Pin + Leaf Logo */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0b1220] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                  <Wind className="w-5 h-5 text-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full blur-[2px]" />
                  <Leaf className="w-3 h-3 text-emerald-300 absolute bottom-1 right-1" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    AirLens<span className="text-emerald-400 font-black">AI</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Track 2: Clean Air
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden md:block">
                  Hyperlocal Pollution Intelligence
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* City Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="max-w-[100px] truncate">{selectedCity.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Target Metropolitan Area
                  </div>
                  {SUPPORTED_CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        onSelectCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        city.id === selectedCity.id
                          ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{city.name}</div>
                        <div className="text-[10px] text-slate-400">{city.state}</div>
                      </div>
                      {city.id === selectedCity.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weather / AQI Quick Pill (Desktop) */}
            {weather && (
              <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-emerald-400">{weather.temperature}°C</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Wind className="w-3 h-3 text-cyan-400" />
                  {weather.windSpeed} km/h
                </span>
                {airQuality && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className={`font-bold ${
                      airQuality.aqi > 200 ? 'text-rose-400' : airQuality.aqi > 150 ? 'text-orange-400' : 'text-amber-400'
                    }`}>
                      AQI {airQuality.aqi}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Incident Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={handleResetClick}
              disabled={resetting}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
              title="Reset Demo Records to initial state"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            <button
              onClick={() => { onSelectTab('landing'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold ${
                currentTab === 'landing' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-200'
              }`}
            >
              Public Home
            </button>
            <button
              onClick={() => { onSelectTab('report'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left text-xs font-semibold ${
                currentTab === 'report' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-200'
              }`}
            >
              Report Pollution
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => { handleResetClick(); setMobileMenuOpen(false); }}
              className="text-xs text-slate-400 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Incidents</span>
            </button>
            <span className="text-[11px] text-emerald-400 font-mono">AirLens v2.4</span>
          </div>
        </div>
      )}
    </header>
  );
}
