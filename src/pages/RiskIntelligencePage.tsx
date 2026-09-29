import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  RefreshCw,
  Activity,
  Layers
} from 'lucide-react';
import { CityRegion, RiskIntelligenceReport, WeatherData, AirQualityData } from '../types';
import { api } from '../services/api';
import { RiskBadge, DataSourceBadge } from '../components/Badges';

interface RiskIntelligencePageProps {
  city: CityRegion;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
}

export function RiskIntelligencePage({ city, weather, airQuality }: RiskIntelligencePageProps) {
  const [riskData, setRiskData] = useState<RiskIntelligenceReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadRisk() {
      setLoading(true);
      try {
        const data = await api.getRiskIntelligence(city.id);
        if (isMounted) setRiskData(data);
      } catch (err) {
        console.error('Failed to load risk intelligence:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadRisk();
    return () => { isMounted = false; };
  }, [city.id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#5CF2B2] animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#8A9A92]">Computing meteorological dispersion vectors for {city.name}...</p>
      </div>
    );
  }

  if (!riskData) return null;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#5CF2B2]/12">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5CF2B2] mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Atmospheric Dispersion Modeling</span>
            <span className="text-[#8A9A92]">·</span>
            <span className="text-[#A6C7B5]">{city.name} Corridor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            Pollution Risk Intelligence: {city.name}
          </h1>
          <p className="text-xs text-[#8A9A92] mt-1 max-w-2xl leading-relaxed">
            Multi-factor exposure intelligence combining crowdsourced visual report density with Open-Meteo meteorological boundary vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <RiskBadge risk={riskData.overallRiskLevel} />
          <DataSourceBadge isLive={true} label="Deterministic Atmospheric Model" />
        </div>
      </div>

      {/* Core Intelligence Grid: 3 Hero Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Composite Score Card */}
        <div className="p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <span className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider block mb-2">
              Composite Exposure Indicator
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-heading font-extrabold text-white tracking-tight tabular-nums">
                {riskData.riskScore}
              </span>
              <span className="text-xs font-mono text-[#8A9A92]">/ 100 Index</span>
            </div>
            <p className="text-xs text-[#8A9A92] leading-relaxed">
              Derived from report density, boundary layer wind stagnation, cluster proximity, and baseline station loading.
            </p>
          </div>

          <div className="pt-3 border-t border-[#5CF2B2]/10 flex items-center justify-between text-xs font-mono">
            <span className="text-[#8A9A92]">Risk Rating:</span>
            <span className={`font-bold ${
              riskData.overallRiskLevel === 'Elevated' ? 'text-[#FF6B65]' :
              riskData.overallRiskLevel === 'Moderate' ? 'text-[#F6B94B]' : 'text-[#5CF2B2]'
            }`}>
              {riskData.overallRiskLevel} Exposure
            </span>
          </div>
        </div>

        {/* Plume Dispersion Vector */}
        <div className="p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <span className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider block mb-2">
              Atmospheric Plume Drift Vector
            </span>
            <div className="flex items-center gap-4 my-2">
              <div 
                className="w-14 h-14 rounded-2xl bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/30 flex items-center justify-center shrink-0 shadow-lg shadow-[#071713]"
                style={{ transform: `rotate(${weather?.windDirection ?? 310}deg)` }}
              >
                <Wind className="w-8 h-8" />
              </div>
              <div>
                <div className="text-lg font-heading font-bold text-white">{riskData.windDispersion.directionText}</div>
                <div className="text-xs font-mono text-[#8A9A92] tabular-nums">Velocity: {weather?.windSpeed ?? 9} km/h</div>
              </div>
            </div>
            <p className="text-xs text-[#8A9A92] leading-relaxed mt-2">
              Downwind particulate plume travels towards <strong className="text-[#A6C7B5]">South-East azimuth ({riskData.windDispersion.projectedDriftAzimuth}°)</strong>.
            </p>
          </div>

          <div className="pt-3 border-t border-[#5CF2B2]/10 text-xs font-mono flex justify-between">
            <span className="text-[#8A9A92]">Ventilation Status:</span>
            <span className="text-[#F6B94B] font-bold">Low Atmospheric Mixing</span>
          </div>
        </div>

        {/* Downwind Affected Zones */}
        <div className="p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <span className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider block mb-2">
              Projected Exposure Corridors
            </span>
            <div className="text-xs text-[#8A9A92] mb-3">
              Neighborhoods directly downwind of active citizen emission reports:
            </div>
            <div className="space-y-1.5">
              {(riskData.downwindAreas || []).map((area, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/15 text-xs text-white flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{area.name}</div>
                    <div className="text-[10px] text-[#8A9A92] font-mono">{area.distanceKm} km downwind · ~{area.estimatedArrivalTimeMinutes} min arrival</div>
                  </div>
                  <span className="text-[10px] font-mono text-[#FF6B65]">Downwind Sector</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#5CF2B2]/10 text-xs font-mono text-[#8A9A92]">
            Based on current Open-Meteo wind azimuth
          </div>
        </div>

      </div>

      {/* 6-Hour Short-Term Risk Timeline */}
      <div className="p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#5CF2B2]/12">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#5CF2B2]" />
            <h3 className="font-heading font-bold text-sm text-white">
              Hourly Predictive Pollution Exposure Timeline
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#8A9A92]">
            Short-Term Meteorology Projection
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {(riskData.hourlyForecast || []).map((slot, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                slot.predictedRisk === 'Elevated' || slot.predictedRisk === 'Critical'
                  ? 'bg-[#2A0F0D]/60 border-[#FF6B65]/40 text-[#FF6B65]'
                  : slot.predictedRisk === 'Moderate'
                  ? 'bg-[#2A200B]/60 border-[#F6B94B]/35 text-[#F6B94B]'
                  : 'bg-[#071713] border-[#5CF2B2]/15 text-[#5CF2B2]'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-white">
                {slot.hour}
              </div>
              <div className="text-xl font-heading font-extrabold tabular-nums">
                {slot.predictedRisk}
              </div>
              <div className="text-[10px] font-mono text-[#8A9A92]">
                Confidence: {slot.confidence}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explainability Breakdown & Advisories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Risk Factors Breakdown */}
        <div className="p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
            <Layers className="w-4 h-4 text-[#5CF2B2]" />
            <span>Deterministic Risk Contribution Breakdown</span>
          </div>

          <div className="space-y-3">
            {riskData.factors.map((f, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/12 space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-white">{f.name}</span>
                  <span className={`tabular-nums ${f.impact === 'High' ? 'text-[#FF6B65]' : f.impact === 'Moderate' ? 'text-[#F6B94B]' : 'text-[#5CF2B2]'}`}>
                    {f.impact} Impact
                  </span>
                </div>
                <p className="text-[11px] text-[#8A9A92] leading-relaxed">
                  {f.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Public Health Recommendations */}
        <div className="p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-[#5CF2B2]" />
              <span>Protective Health & Community Advisories</span>
            </div>

            <div className="space-y-2.5">
              {(riskData.downwindAreas && riskData.downwindAreas.length > 0
                ? riskData.downwindAreas.map((a) => a.advisory)
                : [
                    'Sensitive individuals should limit prolonged outdoor physical exertion in downwind corridors.',
                    'Keep classroom windows shut facing western dust corridors during peak transit periods.',
                    'Municipal mist cannons scheduled for active construction sectors.'
                  ]
              ).map((act, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#071713] border border-[#5CF2B2]/12 flex items-start gap-2.5 text-xs text-[#8A9A92]">
                  <CheckCircle2 className="w-4 h-4 text-[#5CF2B2] shrink-0 mt-0.5" />
                  <span className="text-[#F4F8F5]">{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scientific Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#123C30]/40 border border-[#5CF2B2]/20 text-[11px] text-[#A6C7B5] space-y-1 mt-4">
            <div className="font-bold text-[#5CF2B2] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#5CF2B2]" />
              <span>Scientific Disclaimer:</span>
            </div>
            <p className="leading-relaxed">
              {riskData.modelDisclaimer || 'AirLens risk models reflect atmospheric dispersion calculations and crowdsourced visual observations. Real-time regulatory compliance mandates official reference gravimetric monitors.'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
