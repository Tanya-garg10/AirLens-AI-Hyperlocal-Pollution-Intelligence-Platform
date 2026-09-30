import React, { useState, useRef } from 'react';
import satelliteImg from '../assets/images/satellite_pollution_plume_1790691020109.jpg';
import { 
  Plus, 
  Minus, 
  Crosshair, 
  Wind, 
  MapPin, 
  Layers, 
  Info,
  Calendar,
  Eye, 
  ExternalLink,
  Flame,
  Activity,
  Image,
  Compass
} from 'lucide-react';
import { PollutionReport, HotspotCluster, CityRegion, ReportCategory } from '../types';
import { CategoryBadge, StatusBadge, PriorityBadge, CATEGORY_CONFIG } from './Badges';

export type MapLayerMode = 'vector' | 'satellite' | 'heatmap';

interface InteractiveMapProps {
  city: CityRegion;
  reports: PollutionReport[];
  clusters: HotspotCluster[];
  selectedReport?: PollutionReport | null;
  onSelectReport?: (report: PollutionReport | null) => void;
  onSelectCoordinates?: (lat: number, lng: number, addressHint?: string) => void;
  selectableLocation?: boolean;
  selectedCoordinates?: { lat: number; lng: number } | null;
  windData?: { speedKmh: number; directionDeg: number } | null;
  showClusters?: boolean;
  heightClass?: string;
  onViewReportDetails?: (report: PollutionReport) => void;
}

export function InteractiveMap({
  city,
  reports,
  clusters,
  selectedReport,
  onSelectReport,
  onSelectCoordinates,
  selectableLocation = false,
  selectedCoordinates,
  windData,
  showClusters = true,
  heightClass = 'h-[580px]',
  onViewReportDetails,
}: InteractiveMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeCluster, setActiveCluster] = useState<HotspotCluster | null>(null);
  const [showWindVectors, setShowWindVectors] = useState(true);
  const [layerMode, setLayerMode] = useState<MapLayerMode>('vector');
  const [showLegend, setShowLegend] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Geographic bounds around city center (approx 0.12 degrees lat, 0.14 degrees lng)
  const LAT_SPAN = 0.11 / zoomLevel;
  const LNG_SPAN = 0.13 / zoomLevel;

  // Coordinate to Map Pixel % projection
  const coordsToPercent = (lat: number, lng: number) => {
    const dLat = lat - city.latitude;
    const dLng = lng - city.longitude;

    const x = 50 + (dLng / LNG_SPAN) * 50 + panOffset.x;
    const y = 50 - (dLat / LAT_SPAN) * 50 + panOffset.y; // Inverted latitude
    return { x, y };
  };

  // Pixel % to Coordinate reverse projection (for dropping pin)
  const percentToCoords = (xPct: number, yPct: number) => {
    const normX = (xPct - 50 - panOffset.x) / 50;
    const normY = -(yPct - 50 - panOffset.y) / 50;
    const lng = city.longitude + normX * LNG_SPAN;
    const lat = city.latitude + normY * LAT_SPAN;
    return { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) };
  };

  // Mouse handlers for dragging/panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== mapContainerRef.current && (e.target as HTMLElement).closest('.interactive-control')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Click on map to drop pin if selectable
  const handleMapClick = (e: React.MouseEvent) => {
    if (!selectableLocation || !onSelectCoordinates || !mapContainerRef.current) return;
    if ((e.target as HTMLElement).closest('.interactive-control')) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const { lat, lng } = percentToCoords(xPct, yPct);
    onSelectCoordinates(lat, lng, `Pinned Coordinate (${lat}, ${lng})`);
  };

  const handleResetCenter = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation && onSelectCoordinates) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          onSelectCoordinates(lat, lng, `Device GPS Observation (${lat}, ${lng})`);
        },
        (err) => {
          console.warn('Geolocation unavailable:', err.message);
        }
      );
    }
  };

  const getMarkerStyling = (report: PollutionReport) => {
    if (report.verificationStatus === 'Resolved') {
      return {
        bg: 'bg-[#123C30]',
        border: 'border-[#5CF2B2]/60',
        text: 'text-[#A6C7B5]',
        ring: 'shadow-[0_0_12px_rgba(92,242,178,0.4)]',
        color: '#5CF2B2',
      };
    }
    if (report.priority === 'Critical' || report.priority === 'High') {
      return {
        bg: 'bg-[#2A0F0D]',
        border: 'border-[#FF6B65]',
        text: 'text-[#FF6B65]',
        ring: 'shadow-[0_0_16px_rgba(255,107,101,0.6)] animate-pulse',
        color: '#FF6B65',
      };
    }
    if (report.verificationStatus === 'Submitted' || report.verificationStatus === 'Under Review') {
      return {
        bg: 'bg-[#2A200B]',
        border: 'border-[#F6B94B]',
        text: 'text-[#F6B94B]',
        ring: 'shadow-[0_0_10px_rgba(246,185,75,0.4)]',
        color: '#F6B94B',
      };
    }
    return {
      bg: 'bg-[#0E1D19]',
      border: 'border-[#5CF2B2]',
      text: 'text-[#5CF2B2]',
      ring: 'shadow-[0_0_10px_rgba(92,242,178,0.4)]',
      color: '#5CF2B2',
    };
  };

  return (
    <div className={`relative w-full ${heightClass} bg-[#071713] rounded-3xl overflow-hidden border border-[#5CF2B2]/20 shadow-2xl select-none group transition-all duration-300`}>
      
      {/* Interactive Geo-Canvas Area */}
      <div 
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleMapClick}
        className={`w-full h-full relative overflow-hidden ${
          selectableLocation ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Layer 1: Satellite Plume Composite underlay if satellite mode active */}
        {layerMode === 'satellite' && (
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 overflow-hidden"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}%, ${panOffset.y / zoomLevel}%)`,
              transformOrigin: '50% 50%',
            }}
          >
            <img
              src={satelliteImg}
              alt="Satellite pollution plume composite"
              className="w-full h-full object-cover opacity-65 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071713] via-transparent to-[#071713]/80" />
          </div>
        )}

        {/* Layer 2: Vector Cartography (Roads, Rivers, Coordinates, Contours) */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="living-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(92, 242, 178, 0.05)" strokeWidth="0.8" />
                <circle cx="20" cy="20" r="0.8" fill="rgba(92, 242, 178, 0.15)" />
              </pattern>
              <radialGradient id="living-vignette" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#0C1513" stopOpacity={layerMode === 'satellite' ? '0.2' : '0.4'} />
                <stop offset="100%" stopColor="#071713" stopOpacity="0.95" />
              </radialGradient>
            </defs>

            {/* Grid & Vignette */}
            <rect width="100%" height="100%" fill="url(#living-grid)" />
            <rect width="100%" height="100%" fill="url(#living-vignette)" />

            {/* Atmospheric Contour Isobars */}
            <g opacity={layerMode === 'satellite' ? '0.25' : '0.45'} stroke="#123C30" strokeWidth="1.4" fill="none">
              <path d="M -50 150 C 150 80 350 250 550 160 S 900 120 1200 220" />
              <path d="M -50 280 C 120 220 320 380 620 260 S 850 320 1200 350" />
              <path d="M -50 420 C 200 340 450 500 750 410 S 950 430 1200 480" />
              {/* Concentric rings */}
              <circle cx="50%" cy="50%" r="18%" stroke="rgba(92, 242, 178, 0.12)" strokeDasharray="4 6" />
              <circle cx="50%" cy="50%" r="35%" stroke="rgba(92, 242, 178, 0.08)" />
              <circle cx="50%" cy="50%" r="52%" stroke="rgba(92, 242, 178, 0.05)" />
            </g>

            {/* River corridor (natural organic flow) */}
            <path
              d="M 50 10 C 180 140 220 280 380 350 S 550 490 700 580"
              fill="none"
              stroke="#0E2D24"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Heatmap Layer Overlay */}
        {layerMode === 'heatmap' && (
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70">
            {clusters.map((cluster) => {
              const { x, y } = coordsToPercent(cluster.latitude, cluster.longitude);
              return (
                <div
                  key={`heat-${cluster.id}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${cluster.estimatedRadiusMeters / 12}px`,
                    height: `${cluster.estimatedRadiusMeters / 12}px`,
                    backgroundColor: cluster.riskLevel === 'Elevated' ? 'rgba(255, 107, 101, 0.45)' : 'rgba(246, 185, 75, 0.35)',
                  }}
                />
              );
            })}
          </div>
        )}

        {/* City Epicenter Marker */}
        <div 
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 text-center"
          style={{
            left: `${50 + panOffset.x}%`,
            top: `${50 + panOffset.y}%`,
          }}
        >
          <div className="px-3 py-1 rounded-full bg-[#071713]/90 backdrop-blur-md border border-[#5CF2B2]/25 text-[10px] font-mono tracking-widest text-[#5CF2B2] uppercase shadow-lg">
            {city.name} Meteorological Core
          </div>
        </div>

        {/* Dynamic Wind Current Streamlines */}
        {showWindVectors && windData && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[15, 35, 55, 75, 90].map((x) =>
              [20, 45, 70, 85].map((y) => (
                <div
                  key={`streamline-${x}-${y}`}
                  className="absolute opacity-35"
                  style={{
                    left: `${x + (panOffset.x % 20)}%`,
                    top: `${y + (panOffset.y % 20)}%`,
                    transform: `rotate(${windData.directionDeg}deg)`,
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-[1.5px] bg-gradient-to-r from-transparent via-[#5CF2B2] to-transparent animate-pulse" />
                    <div className="w-1.5 h-1.5 border-t border-r border-[#5CF2B2] rotate-45 -ml-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Potential Hotspot Cluster Zones */}
        {showClusters && clusters.map((cluster) => {
          const { x, y } = coordsToPercent(cluster.latitude, cluster.longitude);
          if (x < -20 || x > 120 || y < -20 || y > 120) return null;

          const isElevated = cluster.riskLevel === 'Elevated' || cluster.riskLevel === 'Critical';
          const clusterColor = isElevated ? '#FF6B65' : '#F6B94B';

          return (
            <div
              key={cluster.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveCluster(cluster);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer interactive-control group/cluster z-10"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {/* Radiating Atmospheric Ring */}
              <div 
                className="w-28 h-28 rounded-full border border-dashed animate-ping opacity-25"
                style={{ 
                  borderColor: clusterColor, 
                  backgroundColor: `${clusterColor}15`,
                  animationDuration: '4s' 
                }}
              />
              <div
                className="absolute inset-0 -m-1.5 rounded-full border border-dashed opacity-60"
                style={{ borderColor: clusterColor }}
              />

              {/* Cluster Tag */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-tight shadow-xl border backdrop-blur-md"
                style={{
                  backgroundColor: isElevated ? 'rgba(42, 15, 13, 0.9)' : 'rgba(42, 32, 11, 0.9)',
                  borderColor: clusterColor,
                  color: isElevated ? '#FF6B65' : '#F6B94B',
                }}
              >
                {cluster.reportCount} reports
              </div>
            </div>
          );
        })}

        {/* Pin Location Drop (When in Selectable Mode) */}
        {selectedCoordinates && (
          <div
            className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-30 transition-all duration-200"
            style={{
              left: `${coordsToPercent(selectedCoordinates.lat, selectedCoordinates.lng).x}%`,
              top: `${coordsToPercent(selectedCoordinates.lat, selectedCoordinates.lng).y}%`,
            }}
          >
            <div className="flex flex-col items-center animate-bounce">
              <div className="px-2.5 py-1 bg-[#5CF2B2] text-[#071713] text-[11px] font-heading font-bold rounded-lg shadow-xl whitespace-nowrap">
                Incident Location Set
              </div>
              <MapPin className="w-8 h-8 text-[#5CF2B2] fill-[#5CF2B2] drop-shadow-[0_4px_12px_rgba(92,242,178,0.6)] -mt-1" />
            </div>
          </div>
        )}

        {/* Incident Report Markers */}
        {reports.map((report) => {
          const { x, y } = coordsToPercent(report.latitude, report.longitude);
          if (x < -10 || x > 110 || y < -10 || y > 110) return null;

          const isSelected = selectedReport?.id === report.id;
          const conf = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.other;
          const Icon = conf.icon;
          const styling = getMarkerStyling(report);

          return (
            <div
              key={report.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectReport?.(isSelected ? null : report);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer interactive-control transition-all duration-200 z-20 ${
                isSelected ? 'scale-125 z-40' : 'hover:scale-115'
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {/* Marker Pin Icon */}
              <div
                className={`relative p-2.5 rounded-xl backdrop-blur-md shadow-xl border flex items-center justify-center transition-all ${styling.bg} ${styling.border} ${styling.text} ${styling.ring} ${
                  isSelected ? 'ring-2 ring-[#5CF2B2] scale-110' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                {report.verificationStatus === 'Verified' && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#5CF2B2] ring-2 ring-[#071713]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Left Floating Telemetry Bar with Layer Switcher */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 flex-wrap">
        <div className="bg-[#0C1513]/90 backdrop-blur-xl border border-[#5CF2B2]/20 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-[#5CF2B2] animate-ping" />
          <span className="font-heading font-semibold text-[#F4F8F5]">{city.name}</span>
          <span className="text-[#8A9A92]">·</span>
          <span className="text-[#8A9A92] font-mono text-[11px] tabular-nums">{reports.length} observations</span>
        </div>

        {/* Map Layer Mode Switcher */}
        <div className="bg-[#0C1513]/90 backdrop-blur-xl border border-[#5CF2B2]/20 p-1 rounded-xl shadow-xl flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => setLayerMode('vector')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              layerMode === 'vector' ? 'bg-[#123C30] text-[#5CF2B2] font-bold' : 'text-[#8A9A92] hover:text-white'
            }`}
            title="Procedural Vector Grid"
          >
            Vector
          </button>
          <button
            onClick={() => setLayerMode('satellite')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              layerMode === 'satellite' ? 'bg-[#123C30] text-[#5CF2B2] font-bold' : 'text-[#8A9A92] hover:text-white'
            }`}
            title="Satellite Plume Composite"
          >
            <Image className="w-3 h-3" />
            <span>Satellite</span>
          </button>
          <button
            onClick={() => setLayerMode('heatmap')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              layerMode === 'heatmap' ? 'bg-[#123C30] text-[#5CF2B2] font-bold' : 'text-[#8A9A92] hover:text-white'
            }`}
            title="Atmospheric Heatmap"
          >
            Heatmap
          </button>
        </div>

        {windData && (
          <button
            onClick={() => setShowWindVectors(!showWindVectors)}
            className={`interactive-control px-2.5 py-1.5 rounded-xl text-xs font-mono border backdrop-blur-xl shadow-lg flex items-center gap-1.5 transition-colors ${
              showWindVectors 
                ? 'bg-[#123C30] text-[#5CF2B2] border-[#5CF2B2]/40' 
                : 'bg-[#0C1513]/80 text-[#8A9A92] border-[#5CF2B2]/15'
            }`}
            title="Toggle Wind Dispersion Currents"
          >
            <Wind className="w-3.5 h-3.5 text-[#5CF2B2]" />
            <span className="tabular-nums">Wind {windData.speedKmh} km/h ({windData.directionDeg}°)</span>
          </button>
        )}
      </div>

      {/* Top Right Map Control Buttons */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel((prev) => Math.min(prev * 1.35, 3.5))}
          className="interactive-control w-9 h-9 rounded-xl bg-[#0C1513]/90 hover:bg-[#123C30] text-[#F4F8F5] border border-[#5CF2B2]/20 shadow-xl flex items-center justify-center transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((prev) => Math.max(prev / 1.35, 0.7))}
          className="interactive-control w-9 h-9 rounded-xl bg-[#0C1513]/90 hover:bg-[#123C30] text-[#F4F8F5] border border-[#5CF2B2]/20 shadow-xl flex items-center justify-center transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCenter}
          className="interactive-control w-9 h-9 rounded-xl bg-[#0C1513]/90 hover:bg-[#123C30] text-[#F4F8F5] border border-[#5CF2B2]/20 shadow-xl flex items-center justify-center transition-colors"
          title="Reset to Core Center"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className={`interactive-control w-9 h-9 rounded-xl border shadow-xl flex items-center justify-center transition-colors ${
            showLegend 
              ? 'bg-[#123C30] text-[#5CF2B2] border-[#5CF2B2]' 
              : 'bg-[#0C1513]/90 text-[#8A9A92] border-[#5CF2B2]/20'
          }`}
          title="Atmospheric Map Legend"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Selectable Mode Floating Hint */}
      {selectableLocation && (
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
          <div className="bg-[#123C30]/95 backdrop-blur-xl border border-[#5CF2B2]/40 text-[#5CF2B2] text-xs px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 font-mono">
            <MapPin className="w-4 h-4 text-[#5CF2B2] animate-bounce" />
            <span>Click anywhere on the map to pin incident coordinates</span>
          </div>
          {navigator.geolocation && (
            <button
              onClick={handleDetectLocation}
              className="interactive-control bg-[#0C1513]/90 hover:bg-[#123C30] border border-[#5CF2B2]/25 text-[#F4F8F5] text-xs px-3 py-2 rounded-xl shadow-xl flex items-center gap-1.5 transition-colors font-mono"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#5CF2B2]" />
              <span>Use GPS</span>
            </button>
          )}
        </div>
      )}

      {/* Floating Map Legend Popup */}
      {showLegend && (
        <div className="absolute bottom-16 right-4 z-40 w-72 bg-[#0C1513]/95 backdrop-blur-2xl border border-[#5CF2B2]/25 p-4 rounded-2xl shadow-2xl text-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between font-heading font-semibold text-[#F4F8F5] pb-2.5 border-b border-[#5CF2B2]/12 mb-3">
            <span>Atmospheric Cartography</span>
            <button onClick={() => setShowLegend(false)} className="text-[#8A9A92] hover:text-[#F4F8F5]">✕</button>
          </div>
          <div className="space-y-3 text-[#F4F8F5]">
            <div className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider">Classification:</div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5CF2B2]" />
                <span>Verified / Remediated Incident</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F6B94B]" />
                <span>Under Review / Elevated Notice</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B65]" />
                <span>High-Priority / Severe Alert</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#5CF2B2]/10 space-y-1.5 text-[11px] font-mono text-[#8A9A92]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-dashed border-[#FF6B65] bg-[#FF6B65]/20" />
                <span>Spatial Hotspot Cluster (&lt;2.5 km)</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-3 h-3 text-[#5CF2B2]" />
                <span>Live Wind Streamline Vectors</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Selected Report Detail Card */}
      {selectedReport && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 bg-[#0C1513]/95 backdrop-blur-2xl border border-[#5CF2B2]/35 p-5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-xs text-[#5CF2B2]">{selectedReport.id}</span>
              <CategoryBadge category={selectedReport.category} size="sm" />
              <StatusBadge status={selectedReport.verificationStatus} />
            </div>
            <button 
              onClick={() => onSelectReport?.(null)}
              className="text-[#8A9A92] hover:text-[#F4F8F5] text-sm p-1"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-3 mb-3">
            <img 
              src={selectedReport.imageUrl} 
              alt="Report thumbnail" 
              className="w-20 h-20 object-cover rounded-xl border border-[#5CF2B2]/20 bg-[#071713] shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#F4F8F5] truncate mb-1">
                {selectedReport.locationLabel}
              </div>
              <p className="text-xs text-[#8A9A92] line-clamp-2 mb-2 leading-relaxed">
                {selectedReport.description}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A9A92]">
                <Calendar className="w-3 h-3" />
                <span className="tabular-nums">{new Date(selectedReport.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>·</span>
                <PriorityBadge priority={selectedReport.priority} />
              </div>
            </div>
          </div>

          {selectedReport.aiAnalysis && (
            <div className="bg-[#071713]/80 border border-[#5CF2B2]/15 p-3 rounded-xl mb-3 text-xs">
              <div className="flex items-center justify-between text-[11px] text-[#8A9A92] mb-1">
                <span className="font-semibold text-[#5CF2B2] flex items-center gap-1 font-heading">
                  <Eye className="w-3 h-3" /> GPT-4o AI Preliminary Observation
                </span>
                <span className="font-mono text-[10px] text-[#A6C7B5] tabular-nums">
                  {Math.round(selectedReport.aiAnalysis.confidence * 100)}% match
                </span>
              </div>
              <p className="text-[#F4F8F5] italic text-[11px] leading-relaxed">
                "{selectedReport.aiAnalysis.executive_summary}"
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-[#8A9A92]">
              Source: {selectedReport.dataSource}
            </span>
            {onViewReportDetails && (
              <button
                onClick={() => onViewReportDetails(selectedReport)}
                className="px-3.5 py-1.5 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] text-xs font-heading font-bold flex items-center gap-1 transition-colors"
              >
                <span>Full Triage</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Active Cluster Detail Card */}
      {activeCluster && (
        <div className="absolute top-16 left-4 md:w-80 z-40 bg-[#0C1513]/95 backdrop-blur-2xl border border-[#5CF2B2]/30 p-4 rounded-2xl shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-[#F6B94B] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Spatial Proximity Cluster
            </span>
            <button onClick={() => setActiveCluster(null)} className="text-[#8A9A92] hover:text-[#F4F8F5]">✕</button>
          </div>
          <div className="text-xs font-heading font-bold text-[#F4F8F5] mb-1">
            {activeCluster.hotspotLabel}
          </div>
          <p className="text-xs text-[#8A9A92] mb-2 leading-relaxed">
            Consists of {activeCluster.reportCount} co-located citizen reports within an estimated impact diameter of {activeCluster.estimatedRadiusMeters}m.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-[#5CF2B2]/10 text-xs font-mono">
            <CategoryBadge category={activeCluster.dominantCategory} size="sm" />
            <span className="text-[#A6C7B5] tabular-nums">{activeCluster.activeReportsCount} unresolved</span>
          </div>
        </div>
      )}
    </div>
  );
}
