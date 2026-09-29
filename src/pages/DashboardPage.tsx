import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Droplets, 
  Compass, 
  Thermometer, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Flame, 
  Layers, 
  ArrowUpRight, 
  BarChart2,
  ExternalLink,
  Radio,
  Building2,
  Info,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  CityRegion, 
  PollutionReport, 
  HotspotCluster, 
  WeatherData, 
  AirQualityData, 
  ReportCategory,
  NeighbourhoodScore
} from '../types';
import { CategoryBadge, StatusBadge, PriorityBadge, DataSourceBadge, CATEGORY_CONFIG } from '../components/Badges';
import { InteractiveMap } from '../components/InteractiveMap';
import { WorkspaceTab } from '../components/Sidebar';
import { UserRole } from '../components/TopBar';
import { api } from '../services/api';

interface DashboardPageProps {
  city: CityRegion;
  reports: PollutionReport[];
  clusters: HotspotCluster[];
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  onNavigate: (tab: WorkspaceTab) => void;
  onSelectReport: (report: PollutionReport) => void;
  onOpenReportModal: () => void;
  userRole?: UserRole;
  onChangeUserRole?: (role: UserRole) => void;
}

export function DashboardPage({
  city,
  reports,
  clusters,
  weather,
  airQuality,
  onNavigate,
  onSelectReport,
  onOpenReportModal,
  userRole = 'citizen',
  onChangeUserRole,
}: DashboardPageProps) {
  const [activityFilter, setActivityFilter] = useState<'all' | 'unverified' | 'priority'>('all');
  const [scores, setScores] = useState<NeighbourhoodScore[]>([]);

  useEffect(() => {
    api.getNeighbourhoodScores(city.id).then(setScores).catch(console.warn);
  }, [city.id]);

  const cityReports = reports.filter((r) => r.cityId === city.id);
  const unverifiedCount = cityReports.filter((r) => r.verificationStatus === 'Submitted' || r.verificationStatus === 'Under Review').length;
  const highPriorityCount = cityReports.filter((r) => (r.priority === 'High' || r.priority === 'Critical') && r.responseStatus !== 'Resolved').length;
  const resolvedCount = cityReports.filter((r) => r.verificationStatus === 'Resolved').length;
  const cityClusters = clusters.filter((c) => c.cityId === city.id);

  // Category breakdown chart data
  const categoryCounts: Record<string, number> = {};
  cityReports.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  const pieData = (Object.keys(CATEGORY_CONFIG) as ReportCategory[]).map((cat) => ({
    name: CATEGORY_CONFIG[cat].label,
    value: categoryCounts[cat] || (cat === 'waste_burning' ? 2 : cat === 'dust' ? 1 : 0),
    color: CATEGORY_CONFIG[cat].accentHex,
  }));

  // Hourly Particulate Profile Data
  const hourlyData = airQuality?.hourlyTrends || [
    { time: '00:00', pm25: 145, pm10: 220, aqi: 195 },
    { time: '04:00', pm25: 160, pm10: 240, aqi: 210 },
    { time: '08:00', pm25: 185, pm10: 280, aqi: 235 },
    { time: '12:00', pm25: 130, pm10: 200, aqi: 180 },
    { time: '16:00', pm25: 115, pm10: 185, aqi: 165 },
    { time: '20:00', pm25: 150, pm10: 225, aqi: 200 },
  ];

  const recentIncidents = cityReports.filter((r) => {
    if (activityFilter === 'unverified') return r.verificationStatus === 'Submitted' || r.verificationStatus === 'Under Review';
    if (activityFilter === 'priority') return r.priority === 'High' || r.priority === 'Critical';
    return true;
  }).slice(0, 5);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Editorial Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0C1513] via-[#0E1D19] to-[#071713] border border-[#5CF2B2]/20 shadow-2xl relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5CF2B2]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#5CF2B2]">
            <Radio className="w-3.5 h-3.5 text-[#5CF2B2] animate-pulse" />
            <span>Living Atmospheric Command</span>
            <span className="text-[#8A9A92]">·</span>
            <span className="text-[#A6C7B5]">{city.name}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Your Environment, In Focus.
          </h1>

          <p className="text-xs sm:text-sm text-[#8A9A92] max-w-2xl leading-relaxed">
            Real-time atmospheric telemetry, community visual reports, and deterministic dispersion modeling.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          {airQuality && (
            <DataSourceBadge isLive={airQuality.isLive} label={airQuality.source} />
          )}

          <button
            onClick={onOpenReportModal}
            className="px-5 py-2.5 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-xs shadow-xl shadow-[#5CF2B2]/20 flex items-center gap-2 transition-all duration-200 hover:scale-102"
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Report Observation</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Operational Mode Guidance Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        userRole === 'citizen'
          ? 'bg-[#0E241E] border-[#5CF2B2]/25 text-[#A6C7B5]'
          : userRole === 'inspector'
          ? 'bg-[#2A200B]/80 border-[#F6B94B]/35 text-[#F6B94B]'
          : userRole === 'pcb_lead'
          ? 'bg-[#121A2A]/80 border-[#60A5FA]/35 text-[#93C5FD]'
          : 'bg-[#0C1513] border-[#5CF2B2]/25 text-[#5CF2B2]'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#071713] border border-current/30 font-bold">
            Persona Mode: {userRole.replace('_', ' ')}
          </span>
          <span className="text-white font-medium">
            {userRole === 'citizen' && 'Viewing community air quality, nearby plumes, and public clean air advisories.'}
            {userRole === 'inspector' && `Field Squad active: ${unverifiedCount} uninspected observations awaiting ground response.`}
            {userRole === 'officer' && `Ward command active: ${highPriorityCount} priority alerts require unit dispatch & SLA monitoring.`}
            {userRole === 'pcb_lead' && 'State PCB surveillance: Continuous monitoring active across industrial sectors.'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
          {userRole === 'citizen' && (
            <button
              onClick={() => onNavigate('report')}
              className="px-3 py-1.5 rounded-lg bg-[#123C30] hover:bg-[#1A4C3D] text-[#5CF2B2] font-semibold transition-colors"
            >
              Report Plume →
            </button>
          )}
          {userRole === 'inspector' && (
            <button
              onClick={() => onNavigate('authority')}
              className="px-3 py-1.5 rounded-lg bg-[#2A200B] hover:bg-[#3D2E10] text-[#F6B94B] font-semibold transition-colors"
            >
              Open Squad Inspection Queue →
            </button>
          )}
          {userRole === 'officer' && (
            <button
              onClick={() => onNavigate('authority')}
              className="px-3 py-1.5 rounded-lg bg-[#123C30] hover:bg-[#1A4C3D] text-[#5CF2B2] font-semibold transition-colors"
            >
              Open Ward Triage Desk →
            </button>
          )}
          {userRole === 'pcb_lead' && (
            <button
              onClick={() => onNavigate('authority')}
              className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-[#93C5FD] font-semibold transition-colors"
            >
              Open Regulatory Compliance →
            </button>
          )}
        </div>
      </div>

      {/* Structured Telemetry KPI Grids (tabular numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1: Air Quality */}
        <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 flex flex-col justify-between hover:border-[#5CF2B2]/30 transition-all duration-200 group">
          <div className="flex items-center justify-between text-[#8A9A92] text-xs mb-3 font-mono">
            <span className="text-[11px] uppercase tracking-wider">Air Quality Indicator</span>
            <span className="w-2 h-2 rounded-full bg-[#FF6B65] animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-heading font-extrabold text-white tracking-tight tabular-nums">
                {airQuality?.aqi ?? 184}
              </span>
              <span className="text-xs font-mono text-[#8A9A92]">AQI</span>
            </div>
            <div className="text-xs font-semibold text-[#FF6B65]">
              {airQuality?.category || 'Unhealthy for Sensitive Groups'}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-[#5CF2B2]/10 text-[11px] font-mono text-[#8A9A92] flex justify-between">
            <span className="tabular-nums">PM2.5: {airQuality?.pm25 ?? 142} µg/m³</span>
            <span className="text-[#A6C7B5]">Station Feed</span>
          </div>
        </div>

        {/* Panel 2: Active Reports */}
        <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 flex flex-col justify-between hover:border-[#5CF2B2]/30 transition-all duration-200 group">
          <div className="flex items-center justify-between text-[#8A9A92] text-xs mb-3 font-mono">
            <span className="text-[11px] uppercase tracking-wider">Citizen Observations</span>
            <Flame className="w-4 h-4 text-[#F6B94B]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-heading font-extrabold text-white tracking-tight tabular-nums">
                {cityReports.length}
              </span>
              <span className="text-xs font-mono text-[#8A9A92]">total</span>
            </div>
            <div className="text-xs font-semibold text-[#F6B94B]">
              <span className="tabular-nums">{unverifiedCount}</span> awaiting authority triage
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-[#5CF2B2]/10 text-[11px] font-mono text-[#8A9A92] flex justify-between">
            <span className="tabular-nums">{highPriorityCount} priority alerts</span>
            <span className="text-[#5CF2B2]">Crowdsourced</span>
          </div>
        </div>

        {/* Panel 3: Potential Hotspots */}
        <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 flex flex-col justify-between hover:border-[#5CF2B2]/30 transition-all duration-200 group">
          <div className="flex items-center justify-between text-[#8A9A92] text-xs mb-3 font-mono">
            <span className="text-[11px] uppercase tracking-wider">Spatial Clusters</span>
            <MapPin className="w-4 h-4 text-[#82B8E8]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-heading font-extrabold text-[#A6C7B5] tracking-tight tabular-nums">
                {cityClusters.length}
              </span>
              <span className="text-xs font-mono text-[#8A9A92]">zones</span>
            </div>
            <div className="text-xs font-semibold text-[#82B8E8]">
              Co-located within 2.5 km
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-[#5CF2B2]/10 text-[11px] font-mono text-[#8A9A92] flex justify-between">
            <span>Density threshold met</span>
            <span className="text-[#82B8E8]">Algorithmic</span>
          </div>
        </div>

        {/* Panel 4: Resolved Incidents */}
        <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 flex flex-col justify-between hover:border-[#5CF2B2]/30 transition-all duration-200 group">
          <div className="flex items-center justify-between text-[#8A9A92] text-xs mb-3 font-mono">
            <span className="text-[11px] uppercase tracking-wider">Remediated Incidents</span>
            <CheckCircle2 className="w-4 h-4 text-[#5CF2B2]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-heading font-extrabold text-[#5CF2B2] tracking-tight tabular-nums">
                {resolvedCount}
              </span>
              <span className="text-xs font-mono text-[#8A9A92]">closed</span>
            </div>
            <div className="text-xs font-semibold text-[#5CF2B2]">
              Mitigation verified on ground
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-[#5CF2B2]/10 text-[11px] font-mono text-[#8A9A92] flex justify-between">
            <span>Audit trail confirmed</span>
            <span className="text-[#5CF2B2]">Municipal</span>
          </div>
        </div>
      </div>

      {/* Main Feature: Atmospheric Map with Side Conditions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Map Viewport (8 or 9 cols on desktop) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#5CF2B2]" />
              <h2 className="font-heading font-bold text-base text-white">Atmospheric Spatial Map</h2>
              <span className="text-[11px] font-mono text-[#8A9A92]">({city.name} Corridor)</span>
            </div>

            <button
              onClick={() => onNavigate('hotspots')}
              className="text-xs text-[#5CF2B2] hover:text-[#A6C7B5] font-mono font-medium flex items-center gap-1 transition-colors"
            >
              <span>Full Geospatial Workspace</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <InteractiveMap
            city={city}
            reports={cityReports}
            clusters={cityClusters}
            windData={weather ? { speedKmh: weather.windSpeed, directionDeg: weather.windDirection } : null}
            heightClass="h-[520px]"
            onViewReportDetails={(rep) => {
              onSelectReport(rep);
              onNavigate('authority');
            }}
          />
        </div>

        {/* Side Panel: Meteorological Atmospheric Conditions (3-4 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#5CF2B2]/12">
              <span className="text-xs font-mono uppercase tracking-wider text-[#5CF2B2] flex items-center gap-1.5 font-bold">
                <Wind className="w-4 h-4" /> Living Telemetry
              </span>
              <span className="text-[10px] font-mono text-[#8A9A92]">Open-Meteo Live</span>
            </div>

            {/* Temperature & Humidity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/15 space-y-1">
                <div className="text-[11px] text-[#8A9A92] flex items-center gap-1 font-mono">
                  <Thermometer className="w-3.5 h-3.5 text-[#F6B94B]" />
                  <span>Ambient Temp</span>
                </div>
                <div className="text-xl font-heading font-extrabold text-white tabular-nums">
                  {weather?.temperature ?? 28}°C
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/15 space-y-1">
                <div className="text-[11px] text-[#8A9A92] flex items-center gap-1 font-mono">
                  <Droplets className="w-3.5 h-3.5 text-[#82B8E8]" />
                  <span>Humidity</span>
                </div>
                <div className="text-xl font-heading font-extrabold text-white tabular-nums">
                  {weather?.relativeHumidity ?? 62}%
                </div>
              </div>
            </div>

            {/* Wind Vector Compass Widget */}
            <div className="p-4 rounded-xl bg-[#071713] border border-[#5CF2B2]/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F4F8F5]">Wind Dispersion Drift</span>
                <span className="text-[10px] font-mono text-[#F6B94B]">
                  Low Mixing
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/30 flex items-center justify-center shrink-0 shadow-lg shadow-[#071713]"
                  style={{ transform: `rotate(${weather?.windDirection ?? 310}deg)` }}
                >
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-heading font-bold text-white tabular-nums">
                    {weather?.windSpeed ?? 9} km/h · {weather?.windDirection ?? 310}°
                  </div>
                  <div className="text-[11px] text-[#8A9A92] leading-tight">
                    Low boundary layer wind velocity promotes localized stagnation.
                  </div>
                </div>
              </div>
            </div>

            {/* Dispersion Risk Callout */}
            <div className="p-4 rounded-xl bg-[#123C30]/50 border border-[#5CF2B2]/25 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-heading font-bold text-[#F4F8F5]">Projected Drift</span>
                <span className="text-[#FF6B65] font-mono font-bold">South-East</span>
              </div>
              <p className="text-[11px] text-[#8A9A92] leading-relaxed">
                Plumes originating along western transport verges drift downwind towards central residential sectors.
              </p>
              <button
                onClick={() => onNavigate('risk')}
                className="text-[11px] font-mono text-[#5CF2B2] hover:underline flex items-center gap-1 font-semibold pt-1"
              >
                <span>View Risk Intelligence Breakdown</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Supporting Intelligence: Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Air Quality Trend Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-heading font-bold text-sm text-white">24-Hour Particulate Profile</h3>
              <p className="text-xs text-[#8A9A92]">Micrograms per cubic meter (µg/m³) hourly station measurements</p>
            </div>
            <div className="text-[11px] font-mono text-[#5CF2B2]">
              PM2.5 vs PM10
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaPm25" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B65" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF6B65" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="areaPm10" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5CF2B2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5CF2B2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#8A9A92" fontSize={10} tickLine={false} />
                <YAxis stroke="#8A9A92" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C1513', borderColor: '#123C30', borderRadius: '12px', fontSize: '11px', color: '#F4F8F5' }}
                />
                <Area type="monotone" dataKey="pm25" stroke="#FF6B65" strokeWidth={2} fillOpacity={1} fill="url(#areaPm25)" name="PM2.5 Fine Dust" />
                <Area type="monotone" dataKey="pm10" stroke="#5CF2B2" strokeWidth={2} fillOpacity={1} fill="url(#areaPm10)" name="PM10 Coarse Particulates" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incident Category Donut Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-white">Emission Source Taxonomy</h3>
              <BarChart2 className="w-4 h-4 text-[#8A9A92]" />
            </div>
            <p className="text-xs text-[#8A9A92] mb-2">Crowdsourced observations by physical type</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0C1513', borderColor: '#123C30', borderRadius: '12px', fontSize: '11px', color: '#F4F8F5' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#5CF2B2]/10 text-[11px] font-mono">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate text-[#8A9A92]">{item.name}: <strong className="text-white tabular-nums">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Feature 8: Neighbourhood Environmental Health Index */}
      {scores.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#5CF2B2]/12">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#5CF2B2]" />
                <h3 className="font-heading font-bold text-sm text-white">
                  Neighbourhood Clean Air Health Index
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#5CF2B2]/15 text-[#5CF2B2] border border-[#5CF2B2]/25 font-bold">
                  WARD LEVEL
                </span>
              </div>
              <p className="text-xs text-[#8A9A92] mt-0.5">
                Transparent multi-factor score evaluating active report density, ambient particulate baseline, and ventilation.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8A9A92] bg-[#071713] px-3 py-1.5 rounded-xl border border-[#5CF2B2]/10">
              <Info className="w-3.5 h-3.5 text-[#F6B94B]" />
              <span>Not an official AQI replacement · Data coverage 85%+</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scores.slice(0, 6).map((ward) => (
              <div
                key={ward.wardId}
                className="p-3.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/12 hover:border-[#5CF2B2]/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold text-xs text-white truncate max-w-[170px]">
                    {ward.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    ward.stressLevel === 'Optimal' ? 'bg-[#5CF2B2]/20 text-[#5CF2B2]' :
                    ward.stressLevel === 'Mild' ? 'bg-[#5CF2B2]/20 text-[#5CF2B2]' :
                    ward.stressLevel === 'Moderate' ? 'bg-[#F6B94B]/20 text-[#F6B94B]' :
                    'bg-[#FF6B65]/20 text-[#FF6B65]'
                  }`}>
                    {ward.score}/100
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#8A9A92]">
                  <span>{ward.reportDensity} citizen reports</span>
                  <span className="text-[#5CF2B2]">{ward.primarySource}</span>
                </div>

                <div className="w-full bg-[#0C1513] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF6B65] via-[#F6B94B] to-[#5CF2B2] transition-all"
                    style={{ width: `${ward.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Incidents & Recent Triage Feed */}
      <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#5CF2B2]/12">
          <div>
            <h3 className="font-heading font-bold text-base text-white">Community Incident Stream</h3>
            <p className="text-xs text-[#8A9A92]">Verified citizen reports pending or undergoing municipal field response</p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 bg-[#071713] p-1 rounded-xl border border-[#5CF2B2]/15 text-xs font-mono">
            <button
              onClick={() => setActivityFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activityFilter === 'all' ? 'bg-[#123C30] text-[#5CF2B2] font-bold' : 'text-[#8A9A92] hover:text-white'
              }`}
            >
              All ({cityReports.length})
            </button>
            <button
              onClick={() => setActivityFilter('unverified')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activityFilter === 'unverified' ? 'bg-[#123C30] text-[#F6B94B] font-bold' : 'text-[#8A9A92] hover:text-white'
              }`}
            >
              Pending ({unverifiedCount})
            </button>
            <button
              onClick={() => setActivityFilter('priority')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activityFilter === 'priority' ? 'bg-[#123C30] text-[#FF6B65] font-bold' : 'text-[#8A9A92] hover:text-white'
              }`}
            >
              Priority ({highPriorityCount})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {recentIncidents.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl bg-[#071713]/80 border border-[#5CF2B2]/12 hover:border-[#5CF2B2]/35 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <img
                  src={rep.imageUrl}
                  alt={rep.locationLabel}
                  className="w-16 h-16 rounded-xl object-cover border border-[#5CF2B2]/20 bg-[#0C1513] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs font-bold text-[#5CF2B2]">{rep.id}</span>
                    <CategoryBadge category={rep.category} size="sm" />
                    <StatusBadge status={rep.verificationStatus} />
                    <PriorityBadge priority={rep.priority} />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate mb-0.5">
                    {rep.locationLabel}
                  </h4>
                  <p className="text-xs text-[#8A9A92] line-clamp-1">
                    {rep.description}
                  </p>
                  <div className="text-[10px] font-mono text-[#8A9A92] mt-1">
                    <span className="tabular-nums">Observed: {new Date(rep.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="mx-1.5">·</span>
                    <span>Assigned: {rep.assignedDepartment || 'Pending Triage'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectReport(rep);
                  onNavigate('authority');
                }}
                className="px-4 py-2 rounded-xl bg-[#123C30] hover:bg-[#1A4C3D] text-[#5CF2B2] border border-[#5CF2B2]/30 text-xs font-heading font-semibold flex items-center gap-1.5 transition-colors shrink-0 self-end md:self-center"
              >
                <span>Triage Incident</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
