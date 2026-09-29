import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  MapPin, 
  Wind, 
  Eye, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Radio, 
  Sparkles, 
  Activity, 
  Maximize2, 
  Compass, 
  Building2, 
  Thermometer, 
  Droplets,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { 
  CityRegion, 
  PollutionReport, 
  HotspotCluster, 
  WeatherData, 
  AirQualityData, 
  NeighbourhoodScore 
} from '../types';
import { api } from '../services/api';

interface DigitalTwinPageProps {
  city: CityRegion;
  reports: PollutionReport[];
  clusters: HotspotCluster[];
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  onNavigateToReport?: (report: PollutionReport) => void;
  onOpenReportModal?: () => void;
}

export function DigitalTwinPage({
  city,
  reports,
  clusters,
  weather,
  airQuality,
  onNavigateToReport,
  onOpenReportModal
}: DigitalTwinPageProps) {
  // Layer toggles
  const [showSensors, setShowSensors] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showWindVectors, setShowWindVectors] = useState<boolean>(true);
  const [showWards, setShowWards] = useState<boolean>(true);
  const [perspective3D, setPerspective3D] = useState<boolean>(true);

  // Time-travel scrubber (24-hour history)
  const timeSteps = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'NOW'];
  const [timeIndex, setTimeIndex] = useState<number>(6); // Default to 'NOW'
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Ward & Neighbourhood Scores
  const [scores, setScores] = useState<NeighbourhoodScore[]>([]);
  const [selectedWard, setSelectedWard] = useState<NeighbourhoodScore | null>(null);

  useEffect(() => {
    api.getNeighbourhoodScores(city.id).then(data => {
      setScores(data);
      if (data.length > 0) setSelectedWard(data[0]);
    }).catch(console.warn);
  }, [city.id]);

  // Animation player for 24h evolution
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeIndex(prev => (prev + 1) % timeSteps.length);
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#5CF2B2]/15">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#5CF2B2]/15 text-[#5CF2B2] border border-[#5CF2B2]/30 uppercase tracking-wider">
              Urban Environmental Simulation
            </span>
            <span className="text-xs font-mono text-[#8A9A92]">· Multi-Sensor Telemetry Overlays</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-[#F4F8F5]">
            {city.name} Environmental Digital Twin
          </h1>
          <p className="text-xs sm:text-sm text-[#8A9A92] mt-1 max-w-2xl">
            A unified multi-layer geospatial twin integrating citizen photographic observations, micro-monitoring sensor arrays, Open-Meteo wind currents, and ward stress indices.
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-3 bg-[#0C1513] p-3 rounded-2xl border border-[#5CF2B2]/20">
          <div className="w-2.5 h-2.5 rounded-full bg-[#5CF2B2] animate-ping" />
          <div>
            <span className="text-[10px] font-mono text-[#8A9A92] uppercase block">Twin Synchronisation</span>
            <span className="text-xs font-heading font-bold text-[#F4F8F5]">Live Telemetry Active</span>
          </div>
        </div>
      </div>

      {/* Main Digital Twin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Center/Left: Interactive Twin Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Layer Control Bar */}
          <div className="p-3 bg-[#0C1513] border border-[#5CF2B2]/20 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-[#8A9A92] mr-1">Layers:</span>
              <button
                onClick={() => setShowSensors(!showSensors)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  showSensors ? 'bg-[#5CF2B2]/20 text-[#5CF2B2] border border-[#5CF2B2]/40' : 'bg-[#071713] text-[#8A9A92] border border-transparent'
                }`}
              >
                Micro-Sensors
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  showHeatmap ? 'bg-[#5CF2B2]/20 text-[#5CF2B2] border border-[#5CF2B2]/40' : 'bg-[#071713] text-[#8A9A92] border border-transparent'
                }`}
              >
                Plume Heatmap
              </button>
              <button
                onClick={() => setShowWindVectors(!showWindVectors)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  showWindVectors ? 'bg-[#5CF2B2]/20 text-[#5CF2B2] border border-[#5CF2B2]/40' : 'bg-[#071713] text-[#8A9A92] border border-transparent'
                }`}
              >
                Wind Currents
              </button>
              <button
                onClick={() => setShowWards(!showWards)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  showWards ? 'bg-[#5CF2B2]/20 text-[#5CF2B2] border border-[#5CF2B2]/40' : 'bg-[#071713] text-[#8A9A92] border border-transparent'
                }`}
              >
                Ward Bounds
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPerspective3D(!perspective3D)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                  perspective3D ? 'bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/30' : 'bg-[#071713] text-[#8A9A92]'
                }`}
              >
                {perspective3D ? '2.5D Isometric Tilt' : '2D Topo Ortho'}
              </button>
            </div>
          </div>

          {/* Interactive Digital Twin Viewport */}
          <div className="relative rounded-3xl bg-[#071713] border border-[#5CF2B2]/25 overflow-hidden shadow-2xl min-h-[480px] p-6 flex flex-col justify-between">
            
            {/* 3D Grid Perspective Plane */}
            <div 
              className={`absolute inset-0 transition-transform duration-700 ease-out pointer-events-none ${
                perspective3D ? 'scale-110 [transform:rotateX(30deg)_rotateZ(-5deg)]' : ''
              }`}
              style={{
                backgroundImage: 'radial-gradient(#5CF2B2 1.5px, transparent 1.5px), linear-gradient(to right, #123C30 1px, transparent 1px), linear-gradient(to bottom, #123C30 1px, transparent 1px)',
                backgroundSize: '36px 36px, 108px 108px, 108px 108px',
                opacity: 0.35
              }}
            />

            {/* Top Twin Telemetry Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-[#0C1513]/90 backdrop-blur-md p-3 rounded-2xl border border-[#5CF2B2]/20 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-[#F4F8F5]">
                  {city.name} Twin Layer Model
                </span>
                <span className="text-[#8A9A92]">·</span>
                <span className="font-mono text-[#5CF2B2]">
                  {reports.length} Reports Loaded
                </span>
                <span className="text-[#8A9A92]">·</span>
                <span className="font-mono text-[#F6B94B]">
                  {clusters.length} Hotspot Zones
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-[#8A9A92]">
                <Clock className="w-3.5 h-3.5 text-[#5CF2B2]" />
                <span>Cycle: {timeSteps[timeIndex]}</span>
              </div>
            </div>

            {/* Central Procedural City Canvas */}
            <div className="relative z-10 my-auto w-full h-[320px] flex items-center justify-center">
              <svg 
                viewBox="0 0 600 320" 
                className={`w-full h-full max-h-[320px] select-none transition-transform duration-700 ${
                  perspective3D ? '[transform:perspective(800px)_rotateX(25deg)]' : ''
                }`}
              >
                {/* Simulated Ward Polygons */}
                {showWards && (
                  <g opacity="0.35">
                    <polygon points="40,40 180,30 220,130 90,160" fill="#123C30" stroke="#5CF2B2" strokeWidth="1" strokeDasharray="3 3" />
                    <polygon points="190,30 360,20 390,140 230,135" fill="#0C1513" stroke="#5CF2B2" strokeWidth="1" strokeDasharray="3 3" />
                    <polygon points="370,25 550,45 520,170 400,145" fill="#123C30" stroke="#5CF2B2" strokeWidth="1" strokeDasharray="3 3" />
                    <polygon points="80,170 230,145 260,280 110,290" fill="#0C1513" stroke="#5CF2B2" strokeWidth="1" strokeDasharray="3 3" />
                    <polygon points="240,145 410,150 430,290 270,285" fill="#123C30" stroke="#5CF2B2" strokeWidth="1" strokeDasharray="3 3" />
                    <polygon points="420,155 530,175 490,295 440,290" fill="#0C1513" stroke="#5CF2B2" strokeWidth="1" strokeDasharray="3 3" />
                  </g>
                )}

                {/* Heatmap Plumes */}
                {showHeatmap && (
                  <g>
                    <ellipse cx="210" cy="120" rx="75" ry="40" fill="#FF6B65" fillOpacity="0.25" className="animate-pulse" />
                    <ellipse cx="210" cy="120" rx="40" ry="22" fill="#FF6B65" fillOpacity="0.4" />
                    <ellipse cx="380" cy="160" rx="90" ry="50" fill="#F6B94B" fillOpacity="0.2" />
                    <ellipse cx="380" cy="160" rx="45" ry="25" fill="#F6B94B" fillOpacity="0.35" />
                  </g>
                )}

                {/* Animated Wind Particle Streamlines */}
                {showWindVectors && (
                  <g stroke="#5CF2B2" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="8 6">
                    <line x1="60" y1="60" x2="260" y2="150" className="animate-pulse" />
                    <line x1="140" y1="40" x2="340" y2="130" className="animate-pulse [animation-delay:0.3s]" />
                    <line x1="220" y1="80" x2="420" y2="170" className="animate-pulse [animation-delay:0.6s]" />
                    <line x1="100" y1="180" x2="300" y2="270" className="animate-pulse [animation-delay:0.2s]" />
                    <line x1="260" y1="160" x2="460" y2="250" className="animate-pulse [animation-delay:0.5s]" />
                  </g>
                )}

                {/* Micro-Sensor Stations Layer */}
                {showSensors && (
                  <g>
                    {[
                      { x: 120, y: 80, id: 'MS-01', pm25: 142 },
                      { x: 280, y: 70, id: 'MS-02', pm25: 198 },
                      { x: 440, y: 90, id: 'MS-03', pm25: 110 },
                      { x: 160, y: 220, id: 'MS-04', pm25: 85 },
                      { x: 330, y: 210, id: 'MS-05', pm25: 176 },
                      { x: 480, y: 230, id: 'MS-06', pm25: 92 },
                    ].map((sensor) => (
                      <g key={sensor.id} className="cursor-pointer group">
                        <circle cx={sensor.x} cy={sensor.y} r="5" fill="#5CF2B2" fillOpacity="0.9" />
                        <circle cx={sensor.x} cy={sensor.y} r="10" stroke="#5CF2B2" strokeWidth="0.8" fill="none" className="animate-ping" />
                        <text x={sensor.x} y={sensor.y - 9} fill="#5CF2B2" fontSize="8" fontFamily="monospace" textAnchor="middle">
                          {sensor.id}: {sensor.pm25}μg
                        </text>
                      </g>
                    ))}
                  </g>
                )}

                {/* Citizen Incident Nodes */}
                {reports.slice(0, 5).map((rep, idx) => {
                  const posX = 160 + (idx * 75);
                  const posY = 110 + ((idx % 3) * 45);
                  return (
                    <g 
                      key={rep.id} 
                      className="cursor-pointer"
                      onClick={() => onNavigateToReport?.(rep)}
                    >
                      <circle cx={posX} cy={posY} r="8" fill="#0C1513" stroke="#FF6B65" strokeWidth="2" />
                      <circle cx={posX} cy={posY} r="3" fill="#FF6B65" />
                      <text x={posX} y={posY + 16} fill="#F4F8F5" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                        {rep.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom 24-Hour Timeline Scrubber */}
            <div className="relative z-10 bg-[#0C1513]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#5CF2B2]/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-[#5CF2B2] text-[#071713] font-bold hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer"
                  title={isPlaying ? 'Pause 24h cycle' : 'Play 24h evolution'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>
                <button
                  onClick={() => setTimeIndex(6)}
                  className="p-2 rounded-xl bg-[#123C30] text-[#A6C7B5] hover:text-[#5CF2B2] border border-[#5CF2B2]/20 transition-all cursor-pointer"
                  title="Reset to Live Now"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono text-[#F4F8F5]">24h Atmospheric Playback:</span>
              </div>

              {/* Time Step Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {timeSteps.map((step, idx) => (
                  <button
                    key={step}
                    onClick={() => { setTimeIndex(idx); setIsPlaying(false); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      timeIndex === idx 
                        ? 'bg-[#5CF2B2] text-[#071713] font-bold shadow-md' 
                        : 'bg-[#071713] text-[#8A9A92] hover:text-[#F4F8F5] border border-[#5CF2B2]/10'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ward / Neighbourhood Intelligence Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#5CF2B2]/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A9A92] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#5CF2B2]" />
                Neighbourhood Inspector
              </span>
              <span className="text-[10px] font-mono text-[#5CF2B2]">
                {scores.length} Monitored Wards
              </span>
            </div>

            {/* Ward List Selector */}
            <div className="space-y-2">
              {scores.map((ward) => {
                const isSelected = selectedWard?.wardId === ward.wardId;
                return (
                  <button
                    key={ward.wardId}
                    onClick={() => setSelectedWard(ward)}
                    className={`w-full text-left p-3 rounded-2xl transition-all border ${
                      isSelected 
                        ? 'bg-[#123C30] border-[#5CF2B2]/40 shadow-lg' 
                        : 'bg-[#071713] border-[#5CF2B2]/10 hover:border-[#5CF2B2]/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-heading font-semibold text-[#F4F8F5] truncate max-w-[180px]">
                        {ward.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        ward.stressLevel === 'Optimal' ? 'bg-[#5CF2B2]/20 text-[#5CF2B2]' :
                        ward.stressLevel === 'Mild' ? 'bg-[#5CF2B2]/20 text-[#5CF2B2]' :
                        ward.stressLevel === 'Moderate' ? 'bg-[#F6B94B]/20 text-[#F6B94B]' :
                        'bg-[#FF6B65]/20 text-[#FF6B65]'
                      }`}>
                        Score {ward.score}/100
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#8A9A92] mt-1.5">
                      <span>{ward.reportDensity} reports active</span>
                      <span className="capitalize">{ward.trend}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Ward Deep Dive Card */}
            {selectedWard && (
              <div className="pt-4 border-t border-[#5CF2B2]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-[#F4F8F5]">
                    {selectedWard.name} Analytics
                  </span>
                  <span className="text-[10px] font-mono text-[#5CF2B2]">
                    Coverage: {selectedWard.dataCoveragePct}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/10">
                    <span className="text-[10px] font-mono text-[#8A9A92] block">Primary Source</span>
                    <span className="text-[#F4F8F5] font-semibold">{selectedWard.primarySource}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/10">
                    <span className="text-[10px] font-mono text-[#8A9A92] block">Verified Incidents</span>
                    <span className="text-[#5CF2B2] font-semibold">{selectedWard.verifiedIncidents} verified</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#A6C7B5] leading-relaxed italic p-2.5 rounded-xl bg-[#071713]/60 border border-[#5CF2B2]/10">
                  "{selectedWard.methodology}"
                </p>

                <button
                  onClick={onOpenReportModal}
                  className="w-full py-2.5 rounded-xl bg-[#5CF2B2] text-[#071713] font-heading font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Report Observation In This Ward</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
