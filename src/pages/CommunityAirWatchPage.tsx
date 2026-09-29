import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Flame, 
  ShieldCheck, 
  ThumbsUp, 
  Share2, 
  Radio, 
  HeartHandshake, 
  Sparkles,
  Filter,
  AlertCircle
} from 'lucide-react';
import { CityRegion, PollutionReport } from '../types';
import { api } from '../services/api';

interface CommunityAirWatchPageProps {
  city: CityRegion;
  onOpenReportModal: () => void;
  onSelectReportId?: (reportId: string) => void;
}

export function CommunityAirWatchPage({
  city,
  onOpenReportModal,
  onSelectReportId
}: CommunityAirWatchPageProps) {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [filterRadius, setFilterRadius] = useState<'all' | 'nearby'>('all');
  const [confirmedReports, setConfirmedReports] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCommunityFeed(city.id);
      setFeedItems(data);
    } catch (err) {
      console.warn('Community feed fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [city.id]);

  const handleConfirmReport = async (reportId: string) => {
    if (confirmedReports.has(reportId)) return;

    try {
      const res = await api.confirmCommunityReport(reportId);
      setConfirmedReports(prev => new Set(prev).add(reportId));
      setFeedItems(prev => prev.map(item => 
        item.id === reportId ? { ...item, communityConfirmations: res.count } : item
      ));
    } catch (err) {
      console.error('Confirmation failed:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#5CF2B2]/15">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#5CF2B2]/15 text-[#5CF2B2] border border-[#5CF2B2]/30 uppercase tracking-wider">
              Citizen Environmental Network
            </span>
            <span className="text-xs font-mono text-[#8A9A92]">· Privacy-Protective Public Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-[#F4F8F5]">
            Community AirWatch
          </h1>
          <p className="text-xs sm:text-sm text-[#8A9A92] mt-1 max-w-2xl">
            Empower neighborhood clean air monitoring through crowd-sourced incident confirmations, transparent status tracking, and privacy-shielded public participation.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#5CF2B2] to-[#48e3a2] text-[#071713] font-heading font-bold text-xs hover:brightness-105 transition-all shadow-xl shadow-[#5CF2B2]/20 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>Report Pollution Sighting</span>
        </button>
      </div>

      {/* Community Impact Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-[#8A9A92]">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Watchers</span>
            <Users className="w-4 h-4 text-[#5CF2B2]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#F4F8F5]">
            1,482
          </div>
          <span className="text-[11px] text-[#A6C7B5] block">
            Citizens in {city.name} metro
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-[#8A9A92]">
            <span className="text-[10px] font-mono uppercase tracking-wider">Community Confirmations</span>
            <ThumbsUp className="w-4 h-4 text-[#5CF2B2]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#5CF2B2]">
            386
          </div>
          <span className="text-[11px] text-[#A6C7B5] block">
            "I observe this too" +1 signals
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-[#8A9A92]">
            <span className="text-[10px] font-mono uppercase tracking-wider">Resolved via Citizen Data</span>
            <CheckCircle2 className="w-4 h-4 text-[#5CF2B2]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#F4F8F5]">
            42
          </div>
          <span className="text-[11px] text-[#A6C7B5] block">
            Squads dispatched this cycle
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between text-[#8A9A92]">
            <span className="text-[10px] font-mono uppercase tracking-wider">Privacy Protocol</span>
            <ShieldCheck className="w-4 h-4 text-[#5CF2B2]" />
          </div>
          <div className="text-sm font-heading font-bold text-[#5CF2B2]">
            100% Anonymized
          </div>
          <span className="text-[11px] text-[#8A9A92] block">
            Zero personal contact data shared
          </span>
        </div>
      </div>

      {/* Main Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Feed List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Feed Filter Header */}
          <div className="p-3 bg-[#0C1513] border border-[#5CF2B2]/20 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-heading font-semibold text-[#F4F8F5] flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#5CF2B2] animate-pulse" />
              Live Citizen Observation Feed
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterRadius('all')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                  filterRadius === 'all' 
                    ? 'bg-[#5CF2B2] text-[#071713] font-bold' 
                    : 'bg-[#071713] text-[#8A9A92] hover:text-[#F4F8F5]'
                }`}
              >
                All Wards ({feedItems.length})
              </button>
              <button
                onClick={() => setFilterRadius('nearby')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                  filterRadius === 'nearby' 
                    ? 'bg-[#5CF2B2] text-[#071713] font-bold' 
                    : 'bg-[#071713] text-[#8A9A92] hover:text-[#F4F8F5]'
                }`}
              >
                Nearby (Within 3km)
              </button>
            </div>
          </div>

          {/* Feed Stream */}
          <div className="space-y-4">
            {feedItems.map((item) => {
              const hasConfirmed = confirmedReports.has(item.id);
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-4 shadow-xl hover:border-[#5CF2B2]/40 transition-all"
                >
                  {/* Top Item Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-[#123C30] border border-[#5CF2B2]/30 flex items-center justify-center text-[#5CF2B2] text-xs font-mono font-bold">
                        #
                      </div>
                      <div>
                        <span className="text-xs font-heading font-bold text-[#F4F8F5]">
                          {item.reporterAlias}
                        </span>
                        <span className="text-[11px] font-mono text-[#8A9A92] block">
                          Report ID: {item.id} · Observed {new Date(item.observedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/30 uppercase">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Body: Photo & Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {item.imageUrl && (
                      <div className="sm:col-span-4 rounded-2xl overflow-hidden bg-[#071713] border border-[#5CF2B2]/15 aspect-video sm:aspect-square">
                        <img 
                          src={item.imageUrl} 
                          alt="Observation evidence" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`${item.imageUrl ? 'sm:col-span-8' : 'sm:col-span-12'} space-y-2`}>
                      <div className="flex items-center gap-1.5 text-xs text-[#8A9A92]">
                        <MapPin className="w-3.5 h-3.5 text-[#5CF2B2]" />
                        <span className="text-[#F4F8F5] font-medium">{item.locationLabel}</span>
                        <span className="text-[10px] font-mono">(approx grid ±1km)</span>
                      </div>
                      <p className="text-xs text-[#A6C7B5] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-[#5CF2B2]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#8A9A92]">
                        Community Weight:
                      </span>
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#5CF2B2]/15 text-[#5CF2B2]">
                        {item.communityConfirmations} Citizen Confirmations
                      </span>
                    </div>

                    <button
                      onClick={() => handleConfirmReport(item.id)}
                      disabled={hasConfirmed}
                      className={`px-4 py-2 rounded-xl text-xs font-heading font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        hasConfirmed 
                          ? 'bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/40' 
                          : 'bg-[#5CF2B2] text-[#071713] font-bold hover:brightness-110 shadow-md shadow-[#5CF2B2]/20'
                      }`}
                    >
                      {hasConfirmed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5CF2B2]" />
                          <span>Confirmed By You</span>
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>I Observe This Too (+1)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Community Action & Awareness Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Clean Air Citizen Tips */}
          <div className="p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-[#5CF2B2]/10">
              <Sparkles className="w-4 h-4 text-[#5CF2B2]" />
              <h3 className="text-sm font-heading font-bold text-[#F4F8F5]">
                Clean Air Community Actions
              </h3>
            </div>

            <div className="space-y-3 text-xs text-[#A6C7B5]">
              <div className="p-3 rounded-2xl bg-[#071713] border border-[#5CF2B2]/10 space-y-1">
                <span className="font-heading font-bold text-[#F4F8F5] block">
                  Zero Waste Burning Pledge
                </span>
                <p className="text-[11px] text-[#8A9A92]">
                  Report active dry leaf or garbage bonfires immediately. Ground-level smoke contributes over 40% of localized respirable PM2.5.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#071713] border border-[#5CF2B2]/10 space-y-1">
                <span className="font-heading font-bold text-[#F4F8F5] block">
                  Construction Dust Barriers
                </span>
                <p className="text-[11px] text-[#8A9A92]">
                  Mandate green geotextile dust screens around demolition or excavation works in your residential ward.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#071713] border border-[#5CF2B2]/10 space-y-1">
                <span className="font-heading font-bold text-[#F4F8F5] block">
                  Sensitive Group Exposure Window
                </span>
                <p className="text-[11px] text-[#8A9A92]">
                  Boundary layer temperature inversion traps smoke between 18:00 and 09:00. Schedule outdoor cardiovascular exercise between 12:00 and 15:00.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Guarantee Card */}
          <div className="p-5 rounded-3xl bg-[#071713] border border-[#5CF2B2]/15 space-y-3">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#5CF2B2]">
              <ShieldCheck className="w-4 h-4" />
              <span>AirLens AI Privacy Guarantee</span>
            </div>
            <p className="text-[11px] text-[#8A9A92] leading-relaxed">
              We never expose citizen phone numbers, email addresses, or exact residential coordinates on the community feed. Locations are aggregated into broad neighborhood sectors (±1km precision) to prevent private property exposure.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
