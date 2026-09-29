import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  ShieldCheck, 
  Clock, 
  Layers, 
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { CityRegion, PollutionReport, HotspotCluster, ReportCategory } from '../types';
import { CATEGORY_CONFIG } from '../components/Badges';

interface AnalyticsPageProps {
  city: CityRegion;
  reports: PollutionReport[];
  clusters: HotspotCluster[];
}

export function AnalyticsPage({ city, reports, clusters }: AnalyticsPageProps) {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const cityReports = reports.filter((r) => r.cityId === city.id);
  const verifiedCount = cityReports.filter((r) => r.verificationStatus === 'Verified' || r.verificationStatus === 'Resolved').length;
  const verificationRate = cityReports.length > 0 ? Math.round((verifiedCount / cityReports.length) * 100) : 0;
  const resolvedCount = cityReports.filter((r) => r.verificationStatus === 'Resolved').length;

  // Trend Data for weekly trajectory
  const trendData = [
    { day: 'Mon', reports: 4, resolved: 3, hotspots: 1 },
    { day: 'Tue', reports: 6, resolved: 4, hotspots: 2 },
    { day: 'Wed', reports: 8, resolved: 6, hotspots: 2 },
    { day: 'Thu', reports: 5, resolved: 5, hotspots: 1 },
    { day: 'Fri', reports: 9, resolved: 7, hotspots: 3 },
    { day: 'Sat', reports: 11, resolved: 8, hotspots: 4 },
    { day: 'Sun', reports: 7, resolved: 6, hotspots: 2 },
  ];

  const categoryCounts: Record<string, number> = {};
  cityReports.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  const pieData = (Object.keys(CATEGORY_CONFIG) as ReportCategory[]).map((cat) => ({
    name: CATEGORY_CONFIG[cat].label,
    value: categoryCounts[cat] || (cat === 'waste_burning' ? 3 : cat === 'dust' ? 2 : 1),
    color: CATEGORY_CONFIG[cat].accentHex,
  }));

  const handleExportCSV = () => {
    window.location.href = '/api/export-csv';
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#5CF2B2]/12">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5CF2B2] mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Atmospheric Environmental Intelligence</span>
            <span className="text-[#8A9A92]">·</span>
            <span className="text-[#A6C7B5]">{city.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            Compliance & Pollution Analytics: {city.name}
          </h1>
          <p className="text-xs text-[#8A9A92] mt-1 max-w-2xl leading-relaxed">
            Longitudinal crowdsourced observation trends, municipal verification velocity, and spatial hotspot frequency.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-[#0C1513] hover:bg-[#123C30] text-[#F4F8F5] border border-[#5CF2B2]/25 text-xs font-mono font-semibold shadow-lg flex items-center gap-2 transition-all self-start sm:self-auto hover:border-[#5CF2B2]"
        >
          <Download className="w-4 h-4 text-[#5CF2B2]" />
          <span>Export Dataset (CSV)</span>
        </button>
      </div>

      {/* KPI Cards (Clean tabular numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-2">
          <div className="flex items-center justify-between text-[#8A9A92] text-xs font-mono">
            <span>Verification Rate</span>
            <ShieldCheck className="w-4 h-4 text-[#5CF2B2]" />
          </div>
          <div className="text-3xl font-heading font-extrabold text-white tabular-nums">{verificationRate}%</div>
          <div className="text-[11px] text-[#5CF2B2] font-mono">Confirmed with optical evidence</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-2">
          <div className="flex items-center justify-between text-[#8A9A92] text-xs font-mono">
            <span>Mean Triage Velocity</span>
            <Clock className="w-4 h-4 text-[#82B8E8]" />
          </div>
          <div className="text-3xl font-heading font-extrabold text-white tabular-nums">38 min</div>
          <div className="text-[11px] text-[#82B8E8] font-mono">From upload to unit dispatch</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-2">
          <div className="flex items-center justify-between text-[#8A9A92] text-xs font-mono">
            <span>Closed Incidents</span>
            <CheckCircle2 className="w-4 h-4 text-[#5CF2B2]" />
          </div>
          <div className="text-3xl font-heading font-extrabold text-[#5CF2B2] tabular-nums">{resolvedCount}</div>
          <div className="text-[11px] text-[#8A9A92] font-mono">With mitigation audit trail</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-2">
          <div className="flex items-center justify-between text-[#8A9A92] text-xs font-mono">
            <span>Spatial Hotspots</span>
            <Layers className="w-4 h-4 text-[#F6B94B]" />
          </div>
          <div className="text-3xl font-heading font-extrabold text-[#F6B94B] tabular-nums">{clusters.length}</div>
          <div className="text-[11px] text-[#8A9A92] font-mono">Active density zones</div>
        </div>
      </div>

      {/* Main Charts: Trends & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Bar Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-sm text-white">Incident & Remediation Velocity</h2>
              <p className="text-xs text-[#8A9A92]">Crowdsourced intake vs verified municipal closure</p>
            </div>

            <div className="flex bg-[#071713] p-1 rounded-xl border border-[#5CF2B2]/15 text-xs font-mono">
              {(['daily', 'weekly', 'monthly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    timeRange === t ? 'bg-[#123C30] text-[#5CF2B2] font-bold' : 'text-[#8A9A92] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#123C30" />
                <XAxis dataKey="day" stroke="#8A9A92" fontSize={11} tickLine={false} />
                <YAxis stroke="#8A9A92" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C1513', borderColor: '#123C30', borderRadius: '12px', fontSize: '11px', color: '#F4F8F5' }}
                />
                <Bar dataKey="reports" fill="#82B8E8" name="Incoming Reports" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#5CF2B2" name="Resolved Incidents" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <h2 className="font-heading font-bold text-sm text-white">Emission Source Proportions</h2>
            <p className="text-xs text-[#8A9A92] mb-2">Crowdsourced observations by physical taxonomy</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
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

          <div className="space-y-1.5 pt-2 border-t border-[#5CF2B2]/10 text-xs font-mono">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[#8A9A92]">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-bold text-white tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zonal Frequency Ranking */}
      <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-4 shadow-xl">
        <h2 className="font-heading font-bold text-sm text-white">Zonal & Ward Incident Concentration</h2>
        <p className="text-xs text-[#8A9A92]">Density rankings across metropolitan monitoring sectors</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#F4F8F5]">
            <thead className="bg-[#071713] text-[#8A9A92] font-mono uppercase text-[10px] tracking-wider border-b border-[#5CF2B2]/15">
              <tr>
                <th className="p-3">Ward / Corridor</th>
                <th className="p-3">Dominant Category</th>
                <th className="p-3">Observations</th>
                <th className="p-3">Hotspot Risk</th>
                <th className="p-3">Mitigation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5CF2B2]/10 font-sans">
              <tr className="hover:bg-[#071713]/60">
                <td className="p-3 font-semibold text-white">Connaught Place / Mandi House</td>
                <td className="p-3 text-[#A6C7B5]">Waste Burning</td>
                <td className="p-3 font-mono font-bold text-[#FF6B65] tabular-nums">3 Reports</td>
                <td className="p-3"><span className="text-[#FF6B65] font-mono font-bold text-[11px]">Elevated Cluster</span></td>
                <td className="p-3 text-[#5CF2B2] font-medium">Water Squad Deployed</td>
              </tr>
              <tr className="hover:bg-[#071713]/60">
                <td className="p-3 font-semibold text-white">Barakhamba Road Commercial Sector</td>
                <td className="p-3 text-[#A6C7B5]">Construction Activity</td>
                <td className="p-3 font-mono text-[#F6B94B] tabular-nums">2 Reports</td>
                <td className="p-3"><span className="text-[#F6B94B] font-mono text-[11px]">Moderate</span></td>
                <td className="p-3 text-[#82B8E8] font-medium">Inspection Assigned</td>
              </tr>
              <tr className="hover:bg-[#071713]/60">
                <td className="p-3 font-semibold text-white">Mayapuri Industrial Corridor</td>
                <td className="p-3 text-[#A6C7B5]">Industrial Emissions</td>
                <td className="p-3 font-mono text-[#82B8E8] tabular-nums">1 Report</td>
                <td className="p-3"><span className="text-[#82B8E8] font-mono text-[11px]">Single Source</span></td>
                <td className="p-3 text-[#F6B94B] font-medium">Under Review</td>
              </tr>
              <tr className="hover:bg-[#071713]/60">
                <td className="p-3 font-semibold text-white">Karol Bagh Residential Enclosure</td>
                <td className="p-3 text-[#A6C7B5]">Smoke / Generator Exhaust</td>
                <td className="p-3 font-mono text-[#5CF2B2] tabular-nums">1 Report</td>
                <td className="p-3"><span className="text-[#5CF2B2] font-mono text-[11px]">Resolved</span></td>
                <td className="p-3 text-[#5CF2B2] font-medium">Verified Remediated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
