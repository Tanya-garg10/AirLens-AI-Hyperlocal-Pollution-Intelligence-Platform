import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, 
  Compass, 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Radio,
  Sliders,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { api } from '../services/api';
import { 
  CityRegion, 
  PollutionReport, 
  HotspotCluster, 
  WeatherData, 
  SpreadSimulation 
} from '../types';

interface SpreadSimulatorPageProps {
  city: CityRegion;
  reports: PollutionReport[];
  clusters: HotspotCluster[];
  weather: WeatherData | null;
  onNavigateToReport?: () => void;
}

export function SpreadSimulatorPage({
  city,
  reports,
  clusters,
  weather,
  onNavigateToReport
}: SpreadSimulatorPageProps) {
  // Simulator parameters
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [windSpeed, setWindSpeed] = useState<number>(weather?.windSpeed || 12);
  const [windDirection, setWindDirection] = useState<number>(weather?.windDirection || 310);
  const [timeHours, setTimeHours] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simulationData, setSimulationData] = useState<SpreadSimulation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertSent, setAlertSent] = useState<boolean>(false);

  // Animation interval for time scrubbing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeHours(prev => {
          if (prev >= 6) {
            setIsPlaying(false);
            return 6;
          }
          return Number((prev + 0.5).toFixed(1));
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync simulation calculation from API whenever params change
  useEffect(() => {
    const fetchSimulation = async () => {
      setIsLoading(true);
      try {
        const res = await api.getSpreadSimulation({
          reportId: selectedReportId,
          windSpeed,
          windDirection,
          timeHours,
          cityId: city.id
        });
        setSimulationData(res);
      } catch (err) {
        console.warn('Simulation fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimulation();
  }, [selectedReportId, windSpeed, windDirection, timeHours, city.id]);

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  // Calculate drift angle (blowing downwind = windDirection + 180)
  const driftAzimuth = (windDirection + 180) % 360;

  // Use live weather values
  const handleUseLiveWeather = () => {
    if (weather) {
      setWindSpeed(weather.windSpeed);
      setWindDirection(weather.windDirection);
    }
  };

  const handleSimulateAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 4000);
  };

  // Convert compass degrees to directional label
  const getDirectionName = (deg: number) => {
    const compassSectors = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(deg / 22.5) % 16;
    return compassSectors[idx];
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#5CF2B2]/15">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#5CF2B2]/15 text-[#5CF2B2] border border-[#5CF2B2]/30 uppercase tracking-wider">
              Atmospheric Transport Model
            </span>
            <span className="text-xs font-mono text-[#8A9A92]">· Kinematic Gaussian Footprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-[#F4F8F5]">
            AI Pollution Spread Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#8A9A92] mt-1 max-w-2xl">
            Simulate the directional downwind movement of visible particulate and smoke plumes based on surface wind vectors and terrain roughness.
          </p>
        </div>

        {/* Responsible AI Disclaimer Badge */}
        <div className="p-3 rounded-2xl bg-[#0C1513] border border-[#F6B94B]/30 max-w-md">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#F6B94B] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#A6C7B5] leading-relaxed">
              <strong className="text-[#F6B94B]">Illustrative Decision Model:</strong> This kinematic simulation provides indicative trajectory estimates and is not an authorized regulatory atmospheric dispersion forecast.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls + Visual Map + Exposure Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Interactive Simulation Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Source Selection Card */}
          <div className="p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#5CF2B2]/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A9A92] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#5CF2B2]" />
                1. Plume Origin Source
              </span>
              <span className="text-[10px] font-mono text-[#5CF2B2]">
                {reports.length} Incidents
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#F4F8F5] block">
                Target Citizen Report / Cluster
              </label>
              <select
                value={selectedReportId}
                onChange={(e) => setSelectedReportId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/30 text-xs text-[#F4F8F5] focus:outline-none focus:border-[#5CF2B2]"
              >
                {reports.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.id} — {rep.category.replace('_', ' ')} ({rep.locationLabel.split('/')[0]})
                  </option>
                ))}
              </select>
            </div>

            {activeReport && (
              <div className="p-3 rounded-2xl bg-[#071713]/80 border border-[#5CF2B2]/15 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-mono text-[#8A9A92]">Category:</span>
                  <span className="text-[#5CF2B2] font-semibold uppercase">{activeReport.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-mono text-[#8A9A92]">Location:</span>
                  <span className="text-[#F4F8F5] truncate max-w-[180px]">{activeReport.locationLabel}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-mono text-[#8A9A92]">Priority:</span>
                  <span className={`font-mono font-bold ${activeReport.priority === 'Critical' ? 'text-[#FF6B65]' : activeReport.priority === 'High' ? 'text-[#F6B94B]' : 'text-[#5CF2B2]'}`}>
                    {activeReport.priority}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Meteorological Vector Controls */}
          <div className="p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#5CF2B2]/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A9A92] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#5CF2B2]" />
                2. Atmospheric Wind Vectors
              </span>
              {weather?.isLive && (
                <button
                  onClick={handleUseLiveWeather}
                  className="text-[10px] font-mono text-[#5CF2B2] hover:underline flex items-center gap-1 cursor-pointer"
                  title="Sync with live Open-Meteo readings"
                >
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  Use Live Weather
                </button>
              )}
            </div>

            {/* Wind Direction Slider & Compass Dial */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F4F8F5]">Wind Direction (From):</span>
                <span className="font-mono font-bold text-[#5CF2B2]">
                  {windDirection}° ({getDirectionName(windDirection)})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={windDirection}
                onChange={(e) => setWindDirection(Number(e.target.value))}
                className="w-full accent-[#5CF2B2] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8A9A92]">
                <span>N (0°)</span>
                <span>E (90°)</span>
                <span>S (180°)</span>
                <span>W (270°)</span>
                <span>N (360°)</span>
              </div>
            </div>

            {/* Wind Speed Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F4F8F5]">Wind Velocity:</span>
                <span className="font-mono font-bold text-[#5CF2B2]">{windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="2"
                max="45"
                step="1"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full accent-[#5CF2B2] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8A9A92]">
                <span>Calm (2)</span>
                <span>Moderate (15)</span>
                <span>High Vent (35+)</span>
              </div>
            </div>

            {/* Calculated Drift Vector */}
            <div className="p-3 rounded-2xl bg-[#071713] border border-[#5CF2B2]/15 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#8A9A92] block">DOWNWIND TRAJECTORY</span>
                <span className="font-heading font-bold text-[#F4F8F5]">
                  Blows Towards {driftAzimuth}° ({getDirectionName(driftAzimuth)})
                </span>
              </div>
              <div 
                className="w-8 h-8 rounded-full bg-[#123C30] border border-[#5CF2B2]/30 flex items-center justify-center text-[#5CF2B2] transition-transform duration-300"
                style={{ transform: `rotate(${driftAzimuth}deg)` }}
              >
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Time Scrubber Controls */}
          <div className="p-5 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#5CF2B2]/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A9A92] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#5CF2B2]" />
                3. Temporal Dispersion Timeline
              </span>
              <span className="text-[10px] font-mono text-[#5CF2B2] font-bold">
                +{timeHours}h Projection
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-xl bg-[#5CF2B2] text-[#071713] font-bold hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
                title={isPlaying ? 'Pause simulation' : 'Play timeline'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => { setTimeHours(1); setIsPlaying(false); }}
                className="p-2.5 rounded-xl bg-[#123C30] text-[#A6C7B5] hover:text-[#5CF2B2] border border-[#5CF2B2]/20 transition-all cursor-pointer"
                title="Reset to 1 hour"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex-1">
                <input
                  type="range"
                  min="0.5"
                  max="6"
                  step="0.5"
                  value={timeHours}
                  onChange={(e) => { setTimeHours(Number(e.target.value)); setIsPlaying(false); }}
                  className="w-full accent-[#5CF2B2] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#8A9A92]">
              <span>+30m</span>
              <span>+2h</span>
              <span>+4h</span>
              <span>+6h</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Simulation Canvas & Downwind Impact Analysis (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Visual Simulation Display Box */}
          <div className="relative rounded-3xl bg-[#071713] border border-[#5CF2B2]/25 overflow-hidden shadow-2xl min-h-[460px] flex flex-col justify-between p-6">
            
            {/* Background Grid & Contour Pattern */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#5CF2B2 1px, transparent 1px), linear-gradient(to right, #123C30 1px, transparent 1px), linear-gradient(to bottom, #123C30 1px, transparent 1px)',
                backgroundSize: '24px 24px, 72px 72px, 72px 72px'
              }}
            />

            {/* Top Overlay Stats Strip */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-[#0C1513]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#5CF2B2]/20 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B65] animate-ping" />
                  <span className="font-heading font-semibold text-[#F4F8F5]">{activeReport?.id || 'AL-2026-ORIGIN'}</span>
                </div>
                <span className="text-[#8A9A92]">|</span>
                <span className="font-mono text-[#5CF2B2]">
                  Plume: {simulationData?.plumeLengthKm || 4.2} km
                </span>
                <span className="text-[#8A9A92]">|</span>
                <span className="font-mono text-[#F4F8F5]">
                  Width: {simulationData?.plumeWidthKm || 1.8} km
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/30">
                  {simulationData?.dispersionRating || 'Moderate Dispersal'}
                </span>
              </div>
            </div>

            {/* Central Animated Vector Simulation Canvas (SVG) */}
            <div className="relative z-10 my-auto w-full h-[320px] flex items-center justify-center">
              <svg 
                viewBox="-200 -150 400 300" 
                className="w-full h-full max-h-[320px] overflow-visible select-none"
              >
                <defs>
                  {/* Plume Gradient */}
                  <linearGradient id="plumeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF6B65" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#F6B94B" stopOpacity="0.55" />
                    <stop offset="75%" stopColor="#5CF2B2" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#5CF2B2" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Marker Glow */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Concentric Distance Rings */}
                <circle cx="0" cy="0" r="40" fill="none" stroke="#5CF2B2" strokeOpacity="0.1" strokeDasharray="3 3" />
                <text x="42" y="3" fill="#8A9A92" fontSize="7" fontFamily="monospace">1.5 km</text>
                
                <circle cx="0" cy="0" r="90" fill="none" stroke="#5CF2B2" strokeOpacity="0.1" strokeDasharray="3 3" />
                <text x="92" y="3" fill="#8A9A92" fontSize="7" fontFamily="monospace">3.5 km</text>

                <circle cx="0" cy="0" r="150" fill="none" stroke="#5CF2B2" strokeOpacity="0.08" strokeDasharray="3 3" />
                <text x="152" y="3" fill="#8A9A92" fontSize="7" fontFamily="monospace">6.0 km</text>

                {/* Rotating Group following drift azimuth */}
                <g transform={`rotate(${driftAzimuth})`}>
                  {/* Dynamic Dispersion Plume Cone */}
                  <path
                    d={`M 0 0 L ${Math.min(180, (simulationData?.plumeLengthKm || 4) * 28)} -${Math.min(70, (simulationData?.plumeWidthKm || 1.8) * 18)} Q ${Math.min(190, (simulationData?.plumeLengthKm || 4) * 30)} 0 ${Math.min(180, (simulationData?.plumeLengthKm || 4) * 28)} ${Math.min(70, (simulationData?.plumeWidthKm || 1.8) * 18)} Z`}
                    fill="url(#plumeGrad)"
                    className="transition-all duration-500 ease-out"
                  />

                  {/* Wind Vector Streamlines */}
                  {[0, 15, -15, 30, -30].map((offsetY, i) => (
                    <line
                      key={i}
                      x1="10"
                      y1={offsetY}
                      x2={Math.min(160, (simulationData?.plumeLengthKm || 4) * 25)}
                      y2={offsetY * 1.4}
                      stroke="#5CF2B2"
                      strokeWidth="1.2"
                      strokeDasharray="6 4"
                      strokeOpacity="0.6"
                      className="animate-pulse"
                      style={{ animationDuration: `${2.5 - Math.min(1.8, windSpeed / 20)}s` }}
                    />
                  ))}

                  {/* Downwind Impact Ring 1 */}
                  <circle
                    cx={Math.min(130, (simulationData?.plumeLengthKm || 4) * 18)}
                    cy="0"
                    r={Math.min(30, (simulationData?.plumeWidthKm || 1.5) * 10)}
                    fill="#FF6B65"
                    fillOpacity="0.15"
                    stroke="#FF6B65"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </g>

                {/* Origin Marker (Centered at 0, 0) */}
                <circle cx="0" cy="0" r="10" fill="#0C1513" stroke="#FF6B65" strokeWidth="2" filter="url(#glow)" />
                <circle cx="0" cy="0" r="4" fill="#FF6B65" className="animate-ping" />
                <circle cx="0" cy="0" r="3" fill="#F4F8F5" />
                <text x="0" y="-14" fill="#F4F8F5" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  ORIGIN
                </text>
              </svg>
            </div>

            {/* Bottom Trajectory Legend */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#5CF2B2]/15 text-xs text-[#8A9A92]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF6B65]" />
                  <span>High Concentration (Core Zone)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#F6B94B]" />
                  <span>Moderate Drift (Advisory Zone)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#5CF2B2]/40" />
                  <span>Diluted Outer Boundary</span>
                </div>
              </div>

              <button
                onClick={handleSimulateAlert}
                className="px-3.5 py-1.5 rounded-xl bg-[#123C30] hover:bg-[#5CF2B2] text-[#5CF2B2] hover:text-[#071713] border border-[#5CF2B2]/30 font-medium transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
              >
                {alertSent ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5CF2B2]" />
                    <span>Advisory Broadcasted (Simulation)</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Broadcast Downwind Advisory</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Downwind Affected Communities & Arrival Times Table */}
          <div className="p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#5CF2B2]/10">
              <div>
                <h3 className="text-sm font-heading font-bold text-[#F4F8F5]">
                  Downwind Impacted Communities & Arrival Timeline (ETA)
                </h3>
                <p className="text-xs text-[#8A9A92]">
                  Calculated based on {windSpeed} km/h wind velocity along azimuth {driftAzimuth}°
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#5CF2B2]/15 text-[#5CF2B2] border border-[#5CF2B2]/25">
                3 ZONES ESTIMATED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(simulationData?.affectedZones || []).map((zone, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#071713] border border-[#5CF2B2]/15 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        zone.severity === 'High' ? 'bg-[#FF6B65]/20 text-[#FF6B65] border border-[#FF6B65]/30' :
                        zone.severity === 'Moderate' ? 'bg-[#F6B94B]/20 text-[#F6B94B] border border-[#F6B94B]/30' :
                        'bg-[#5CF2B2]/20 text-[#5CF2B2] border border-[#5CF2B2]/30'
                      }`}>
                        {zone.severity.toUpperCase()} RISK
                      </span>
                      <span className="text-[11px] font-mono text-[#5CF2B2] font-bold">
                        ETA: ~{zone.etaMinutes} min
                      </span>
                    </div>

                    <h4 className="text-xs font-heading font-semibold text-[#F4F8F5]">
                      {zone.name}
                    </h4>
                    <p className="text-[11px] text-[#8A9A92] mt-1">
                      Distance: {zone.distanceKm} km from emission source
                    </p>
                  </div>

                  <p className="text-[10px] text-[#A6C7B5] pt-2 border-t border-[#5CF2B2]/10 leading-relaxed italic">
                    "{zone.advisory}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
