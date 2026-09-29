import React from 'react';
import { 
  X, 
  Settings, 
  Globe, 
  Cpu, 
  Bell, 
  ShieldCheck, 
  Sliders, 
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import { CityRegion } from '../types';
import { SUPPORTED_CITIES } from '../data/cities';
import { UserRole } from './TopBar';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityRegion;
  onSelectCity: (city: CityRegion) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  onResetDemo: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  isDarkTheme,
  onToggleTheme,
  userRole,
  onChangeUserRole,
  onResetDemo,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#07120F]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#0C1D18] border border-[#65F0B5]/25 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#07120F] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#65F0B5]/12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#12372C] text-[#65F0B5] border border-[#65F0B5]/25">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-[#F3F7F4]">Workspace Preferences</h2>
              <p className="text-xs text-[#91A39A]">Customize telemetry, data models, and authority roles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#91A39A] hover:text-[#F3F7F4] hover:bg-[#12372C] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting Group: Region Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono text-[#91A39A] uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#65F0B5]" />
            <span>Default Metropolitan Zone</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUPPORTED_CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCity(c)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  c.id === selectedCity.id
                    ? 'bg-[#12372C] border-[#65F0B5] text-[#F3F7F4] shadow-md shadow-[#65F0B5]/10'
                    : 'bg-[#07120F]/60 border-[#65F0B5]/15 text-[#91A39A] hover:border-[#65F0B5]/30'
                }`}
              >
                <div className="text-xs font-bold">{c.name}</div>
                <div className="text-[10px] text-[#91A39A] truncate font-mono">{c.defaultStation}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Setting Group: Visual Theme & Appearance */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono text-[#91A39A] uppercase tracking-wider flex items-center gap-2">
            {isDarkTheme ? <Moon className="w-3.5 h-3.5 text-[#65F0B5]" /> : <Sun className="w-3.5 h-3.5 text-[#F5BD59]" />}
            <span>Interface Mode</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { if (!isDarkTheme) onToggleTheme(); }}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                isDarkTheme
                  ? 'bg-[#12372C] border-[#65F0B5] text-[#F3F7F4]'
                  : 'bg-[#07120F]/60 border-[#65F0B5]/15 text-[#91A39A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-[#65F0B5]" />
                <span className="text-xs font-semibold">Living Obsidian</span>
              </div>
              {isDarkTheme && <span className="w-2 h-2 rounded-full bg-[#65F0B5]" />}
            </button>

            <button
              onClick={() => { if (isDarkTheme) onToggleTheme(); }}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                !isDarkTheme
                  ? 'bg-[#12372C] border-[#65F0B5] text-[#F3F7F4]'
                  : 'bg-[#07120F]/60 border-[#65F0B5]/15 text-[#91A39A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-[#F5BD59]" />
                <span className="text-xs font-semibold">Warm Crisp</span>
              </div>
              {!isDarkTheme && <span className="w-2 h-2 rounded-full bg-[#65F0B5]" />}
            </button>
          </div>
        </div>

        {/* Setting Group: Operational Persona */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono text-[#91A39A] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#65F0B5]" />
            <span>Operational Role</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'citizen', label: 'Citizen' },
              { id: 'inspector', label: 'Inspector' },
              { id: 'officer', label: 'Municipal' },
              { id: 'pcb_lead', label: 'State PCB' },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => onChangeUserRole(role.id as UserRole)}
                className={`py-2 px-3 rounded-xl border font-medium transition-all ${
                  userRole === role.id
                    ? 'bg-[#12372C] border-[#65F0B5] text-[#65F0B5] font-semibold'
                    : 'bg-[#07120F]/60 border-[#65F0B5]/15 text-[#91A39A] hover:text-[#F3F7F4]'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Setting Group: Intelligence Connections */}
        <div className="p-4 rounded-2xl bg-[#07120F]/60 border border-[#65F0B5]/15 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-[#91A39A]">
            <span>Google Gemini 3.8 Flash:</span>
            <span className="text-[#65F0B5] font-bold">ACTIVE (Server Proxy)</span>
          </div>
          <div className="flex items-center justify-between text-[#91A39A]">
            <span>Open-Meteo Atmospheric Feed:</span>
            <span className="text-[#65F0B5] font-bold">CONNECTED (Live)</span>
          </div>
          <div className="flex items-center justify-between text-[#91A39A]">
            <span>Proximity Clustering Threshold:</span>
            <span className="text-[#F3F7F4]">2.5 km (Haversine Grid)</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#65F0B5]/12">
          <button
            onClick={() => {
              onResetDemo();
              onClose();
            }}
            className="text-xs text-[#91A39A] hover:text-[#FF706B] font-mono flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Incidents</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#65F0B5] hover:bg-[#C2F8DC] text-[#07120F] font-heading font-bold text-xs transition-all shadow-lg shadow-[#65F0B5]/20"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
