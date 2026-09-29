import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  X,
  ExternalLink,
  Sliders,
  AlertTriangle,
  Wind
} from 'lucide-react';
import { InAppNotification, SmartAlertRule } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: InAppNotification[];
  onMarkAllRead: () => void;
  onSelectReportId?: (reportId: string) => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectReportId,
}: NotificationDrawerProps) {
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules'>('alerts');
  const [alertRules, setAlertRules] = useState<SmartAlertRule[]>([
    { id: 'rule-nearby', label: 'Nearby Incident Alerts (Within 3km of my location)', enabled: true, notifyHotspots: true },
    { id: 'rule-surge', label: 'High-Density Emission Surge (3+ reports in same sector)', enabled: true, notifyHotspots: true },
    { id: 'rule-aqi', label: 'Severe PM2.5 Spike Alert (AQI > 180)', enabled: true, aqiThreshold: 180, notifyHotspots: false },
    { id: 'rule-downwind', label: 'Downwind Plume Trajectory Warning for my neighborhood', enabled: true, notifyHotspots: true },
    { id: 'rule-status', label: 'Status Updates & Remediation Verification on my reports', enabled: true, notifyHotspots: false },
  ]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleRule = (id: string) => {
    setAlertRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const getIcon = (type: InAppNotification['type']) => {
    switch (type) {
      case 'report':
        return <Flame className="w-4 h-4 text-[#F6B94B]" />;
      case 'hotspot':
        return <ShieldAlert className="w-4 h-4 text-[#FF6B65]" />;
      case 'verification':
        return <CheckCircle2 className="w-4 h-4 text-[#5CF2B2]" />;
      case 'resolution':
        return <CheckCircle2 className="w-4 h-4 text-[#5CF2B2]" />;
      default:
        return <Bell className="w-4 h-4 text-[#8A9A92]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#071713]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0C1513] border-l border-[#5CF2B2]/20 shadow-2xl flex flex-col font-sans">
          
          {/* Header */}
          <div className="p-5 border-b border-[#5CF2B2]/12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/25">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-white">Smart Alerts & Early Warnings</h3>
                <p className="text-[11px] font-mono text-[#8A9A92]">
                  {unreadCount > 0 ? `${unreadCount} unread incident notifications` : 'All alerts caught up'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && activeTab === 'alerts' && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-[#5CF2B2] hover:text-white flex items-center gap-1 font-mono font-medium transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-[#8A9A92] hover:text-white rounded-xl hover:bg-[#123C30] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation: Alerts Stream vs Rules Config */}
          <div className="flex items-center border-b border-[#5CF2B2]/10 bg-[#071713]/60 px-4 py-2 text-xs">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 py-1.5 rounded-xl font-heading font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'alerts' ? 'bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/30' : 'text-[#8A9A92]'
              }`}
            >
              <span>Alert History</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#5CF2B2]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex-1 py-1.5 rounded-xl font-heading font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'rules' ? 'bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/30' : 'text-[#8A9A92]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Smart Rules</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'alerts' ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-16 text-[#8A9A92] text-xs font-mono">
                  No incident alerts logged yet.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      !item.read
                        ? 'bg-[#123C30]/40 border-[#5CF2B2]/40 shadow-lg shadow-[#071713]'
                        : 'bg-[#071713]/60 border-[#5CF2B2]/12 hover:border-[#5CF2B2]/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-[#071713] border border-[#5CF2B2]/20 mt-0.5 shrink-0">
                        {getIcon(item.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-1 font-mono">
                          <span className="font-heading font-bold text-xs text-white">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-[#8A9A92] shrink-0">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-[#8A9A92] leading-relaxed mb-2.5">
                          {item.message}
                        </p>
                        {item.linkedReportId && onSelectReportId && (
                          <button
                            onClick={() => {
                              onSelectReportId(item.linkedReportId!);
                              onClose();
                            }}
                            className="text-[11px] font-mono text-[#5CF2B2] hover:text-white font-semibold flex items-center gap-1 transition-colors"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Inspect Report {item.linkedReportId}</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Smart Alert Rules Configurator */
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#071713] border border-[#5CF2B2]/15 text-[#8A9A92] leading-relaxed">
                Configure personalized in-app atmospheric triggers. Alerts are evaluated against real-time citizen reports and Open-Meteo European air models.
              </div>

              <div className="space-y-3">
                {alertRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3.5 rounded-2xl bg-[#071713] border border-[#5CF2B2]/15 flex items-center justify-between gap-3"
                  >
                    <span className="text-xs text-[#F4F8F5] leading-snug">
                      {rule.label}
                    </span>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        rule.enabled ? 'bg-[#5CF2B2]' : 'bg-[#123C30]'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-[#071713] transition-transform ${
                          rule.enabled ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#123C30]/40 border border-[#5CF2B2]/20 text-[11px] text-[#A6C7B5]">
                <strong className="text-[#5CF2B2] block mb-1">In-App Notification Guarantee:</strong>
                All smart alerts are processed client-side and saved into your session telemetry storage. We do not transmit spam SMS or unrequested emails.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
