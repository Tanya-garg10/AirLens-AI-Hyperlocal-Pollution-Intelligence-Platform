import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Grid, 
  List, 
  Flame, 
  Calendar, 
  Eye, 
  ExternalLink,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { 
  CityRegion, 
  PollutionReport, 
  HotspotCluster, 
  ReportCategory, 
  VerificationStatus, 
  PriorityLevel,
  WeatherData
} from '../types';
import { CategoryBadge, StatusBadge, PriorityBadge, CATEGORY_CONFIG } from '../components/Badges';
import { InteractiveMap } from '../components/InteractiveMap';
import { WorkspaceTab } from '../components/Sidebar';

interface HotspotsPageProps {
  city: CityRegion;
  reports: PollutionReport[];
  clusters: HotspotCluster[];
  weather: WeatherData | null;
  selectedReport: PollutionReport | null;
  onSelectReport: (report: PollutionReport | null) => void;
  onNavigate: (tab: WorkspaceTab) => void;
  onOpenReportModal: () => void;
}

export function HotspotsPage({
  city,
  reports,
  clusters,
  weather,
  selectedReport,
  onSelectReport,
  onNavigate,
  onOpenReportModal,
}: HotspotsPageProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const cityReports = reports.filter((r) => r.cityId === city.id);
  const cityClusters = clusters.filter((c) => c.cityId === city.id);

  const filteredReports = cityReports.filter((r) => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && r.verificationStatus !== statusFilter) return false;
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.locationLabel.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-in fade-in duration-300">
      
      {/* Top Geospatial Intelligence Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/30 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              <span>Geospatial Intelligence: {city.name}</span>
              <span className="text-[11px] font-mono text-[#5CF2B2] tabular-nums">
                · {cityClusters.length} Clusters Detected
              </span>
            </h1>
            <p className="text-xs text-[#8A9A92]">
              Citizen optical observations, 2.5km spatial convergence clusters, and real-time dispersion streamlines.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Map vs List toggle */}
          <div className="bg-[#071713] p-1 rounded-xl border border-[#5CF2B2]/15 flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'map' ? 'bg-[#123C30] text-[#5CF2B2] font-bold border border-[#5CF2B2]/35' : 'text-[#8A9A92] hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-[#123C30] text-[#5CF2B2] font-bold border border-[#5CF2B2]/35' : 'text-[#8A9A92] hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Incident List</span>
            </button>
          </div>

          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-xs shadow-lg shadow-[#5CF2B2]/20 flex items-center gap-1.5 transition-transform hover:scale-102"
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>Pin Observation</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#0C1513]/90 border border-[#5CF2B2]/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8A9A92] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report ID, corridor, or sector..."
            className="w-full bg-[#071713] border border-[#5CF2B2]/15 focus:border-[#5CF2B2] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-[#8A9A92]/60 focus:outline-none transition-all font-mono"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#071713] border border-[#5CF2B2]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5CF2B2] font-mono"
          >
            <option value="all">All Emission Categories</option>
            {(Object.keys(CATEGORY_CONFIG) as ReportCategory[]).map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_CONFIG[cat].label}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#071713] border border-[#5CF2B2]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5CF2B2] font-mono"
          >
            <option value="all">All Verification States</option>
            <option value="Submitted">Submitted (New)</option>
            <option value="Under Review">Under Review</option>
            <option value="Verified">Verified</option>
            <option value="Assigned">Assigned to Squad</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-[#071713] border border-[#5CF2B2]/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5CF2B2] font-mono"
          >
            <option value="all">All Priority Levels</option>
            <option value="Critical">Critical Alert</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* View Switcher: Interactive Map or Data Table */}
      {viewMode === 'map' ? (
        <div className="relative">
          <InteractiveMap
            city={city}
            reports={filteredReports}
            clusters={cityClusters}
            selectedReport={selectedReport}
            onSelectReport={onSelectReport}
            windData={weather ? { speedKmh: weather.windSpeed, directionDeg: weather.windDirection } : null}
            heightClass="h-[680px]"
            onViewReportDetails={(rep) => {
              onSelectReport(rep);
              onNavigate('authority');
            }}
          />
        </div>
      ) : (
        /* High-Density Incident Data Grid (Anti-slop tabular presentation) */
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white">
              Incident Registry ({filteredReports.length} matches)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#5CF2B2]/15 text-[#8A9A92] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Report ID</th>
                  <th className="py-3 px-3">Evidence</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5CF2B2]/10 text-white">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#123C30]/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#5CF2B2]">{rep.id}</td>
                    <td className="py-3 px-3">
                      <img
                        src={rep.imageUrl}
                        alt="Evidence"
                        className="w-10 h-10 rounded-lg object-cover border border-[#5CF2B2]/20"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <CategoryBadge category={rep.category} size="sm" />
                    </td>
                    <td className="py-3 px-3 max-w-[200px] truncate text-[#F4F8F5]">
                      {rep.locationLabel}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={rep.verificationStatus} />
                    </td>
                    <td className="py-3 px-3">
                      <PriorityBadge priority={rep.priority} />
                    </td>
                    <td className="py-3 px-3 text-[#8A9A92] tabular-nums">
                      {new Date(rep.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          onSelectReport(rep);
                          onNavigate('authority');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#123C30] hover:bg-[#1A4C3D] text-[#5CF2B2] text-[11px] font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
