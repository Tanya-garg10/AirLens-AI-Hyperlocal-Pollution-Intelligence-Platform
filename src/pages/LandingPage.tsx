import React, { useState } from 'react';
import {
  Wind,
  MapPin,
  Leaf,
  Flame,
  ShieldCheck,
  Sparkles,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Eye,
  Activity,
  Layers,
  Shield,
  FileCheck
} from 'lucide-react';
import { WorkspaceTab } from '../components/Sidebar';
import { BrandLogo } from '../components/BrandLogo';
import heroImg from '../assets/images/hero_atmospheric_earth_1790691003311.jpg';

interface LandingPageProps {
  onNavigate: (tab: WorkspaceTab) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="min-h-screen bg-[#071713] text-[#F4F8F5] flex flex-col font-sans selection:bg-[#5CF2B2]/30 selection:text-[#5CF2B2]">
      
      {/* Top Bar Navigation (Clean 3-Zone Contract) */}
      <header className="sticky top-0 z-40 h-20 bg-[#071713]/85 backdrop-blur-xl border-b border-[#5CF2B2]/12 px-6 sm:px-10 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <BrandLogo size="md" showWordmark={true} tagline={true} />
        </div>

        {/* Zone 2: Navigation Links (Clean Text with subtle hover underline) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8A9A92]">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="hover:text-[#5CF2B2] transition-colors"
          >
            Overview
          </button>
          <button 
            onClick={() => onNavigate('hotspots')} 
            className="hover:text-[#5CF2B2] transition-colors"
          >
            Spatial Map
          </button>
          <button 
            onClick={() => onNavigate('analysis')} 
            className="hover:text-[#5CF2B2] transition-colors"
          >
            AI Vision Lab
          </button>
          <button 
            onClick={() => onNavigate('risk')} 
            className="hover:text-[#5CF2B2] transition-colors"
          >
            Risk Intelligence
          </button>
          <button 
            onClick={() => onNavigate('authority')} 
            className="hover:text-[#5CF2B2] transition-colors"
          >
            Authority Center
          </button>
        </nav>

        {/* Zone 3: Primary Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-xs shadow-lg shadow-[#5CF2B2]/20 flex items-center gap-2 transition-all hover:scale-102"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Cinematic Living Atmosphere Hero */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-[#5CF2B2]/12">
        {/* Ambient atmospheric drifting glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-[#123C30] rounded-full blur-[140px] pointer-events-none opacity-40 animate-atmospheric" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-[#5CF2B2]/10 rounded-full blur-[120px] pointer-events-none animate-pulse-living" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Hero Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Unboxed editorial subtitle */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#5CF2B2]">
                <span className="w-2 h-2 rounded-full bg-[#5CF2B2] animate-ping" />
                <span>Hyperlocal Environmental Intelligence</span>
                <span className="text-[#8A9A92]">·</span>
                <span className="text-[#A6C7B5]">Clean Air & Climate Resilience</span>
              </div>

              {/* Exact Signature Headline from Brief */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-white leading-[1.08]">
                See What the Air{' '}
                <span className="bg-gradient-to-r from-[#5CF2B2] via-[#A6C7B5] to-[#82B8E8] bg-clip-text text-transparent">
                  Is Telling Us.
                </span>
              </h1>

              {/* Exact Subtitle from Brief */}
              <p className="text-base sm:text-lg text-[#8A9A92] leading-relaxed max-w-2xl font-normal">
                Hyperlocal pollution intelligence powered by GPT-4o Vision AI, citizen observations, and atmospheric dispersion modeling.
              </p>

              {/* Hero Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-8 py-4 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-sm shadow-xl shadow-[#5CF2B2]/25 flex items-center justify-center gap-2.5 group transition-all duration-200 hover:scale-102"
                >
                  <span>Explore AirLens</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('report')}
                  className="px-8 py-4 rounded-xl bg-[#0C1513] hover:bg-[#123C30] text-[#F4F8F5] border border-[#5CF2B2]/25 font-heading font-semibold text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all duration-200 hover:border-[#5CF2B2]/50"
                >
                  <Flame className="w-4 h-4 text-[#F6B94B]" />
                  <span>Report an Observation</span>
                </button>
              </div>

              {/* Quantitative Adjacency Row (anti-slop tabular metrics) */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#5CF2B2]/12 max-w-lg">
                <div>
                  <div className="font-heading font-extrabold text-2xl text-[#5CF2B2] tracking-tight tabular-nums">2.5 km</div>
                  <div className="text-[11px] text-[#8A9A92] font-mono mt-0.5">Hotspot Radius</div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-2xl text-[#82B8E8] tracking-tight tabular-nums">&lt; 3.0s</div>
                  <div className="text-[11px] text-[#8A9A92] font-mono mt-0.5">GPT-4o Vision Triage</div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-2xl text-[#A6C7B5] tracking-tight tabular-nums">100%</div>
                  <div className="text-[11px] text-[#8A9A92] font-mono mt-0.5">Ethical AI Disclosure</div>
                </div>
              </div>
            </div>

            {/* Right Hero Cinematic Visual Carrier (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-[#5CF2B2]/25 shadow-2xl shadow-[#071713]/90 group">
                <img
                  src={heroImg}
                  alt="Atmospheric city wind streams"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071713] via-[#071713]/40 to-transparent" />

                {/* Floating Telemetry Badge Overlay */}
                <div className="absolute top-4 left-4 p-3.5 rounded-2xl bg-[#0C1513]/90 backdrop-blur-xl border border-[#5CF2B2]/30 space-y-1 shadow-2xl">
                  <span className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider block">
                    Metropolitan Vector
                  </span>
                  <div className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
                    <span className="tabular-nums">AQI 184</span>
                    <span className="text-xs font-mono font-bold text-[#FF6B65]">Unhealthy</span>
                  </div>
                  <div className="text-[11px] text-[#8A9A92] font-mono">
                    Delhi NCR · PM2.5: 142 µg/m³
                  </div>
                </div>

                {/* Hotspot indicator pulse */}
                <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-[#0C1513]/90 backdrop-blur-xl border border-[#5CF2B2]/30 flex items-center gap-2.5 font-mono text-xs shadow-xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B65] animate-ping" />
                  <span className="text-[#F4F8F5]">6 Verified Hotspots Active</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The Problem Narrative */}
      <section className="py-20 bg-[#0C1513]/50 border-b border-[#5CF2B2]/12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono text-[#5CF2B2] uppercase tracking-wider block">
            The Atmospheric Blind Spot
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Fixed ambient stations miss what citizen cameras witness every day.
          </h2>
          <p className="text-sm sm:text-base text-[#8A9A92] leading-relaxed">
            Municipal air monitors are located kilometers apart, averaging regional figures while localized construction plumes, burning refuse verges, and fugitive emissions heavily impact school corridors and neighborhoods. AirLens AI connects citizen visual observations with OpenAI GPT-4o and wind dispersion models to trigger rapid remediation.
          </p>
        </div>
      </section>

      {/* 4 Core Architectural Capabilities */}
      <section className="py-24 border-b border-[#5CF2B2]/12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono text-[#5CF2B2] uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              Built for Atmospheric Precision & Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Capability 1 */}
            <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 hover:border-[#5CF2B2]/40 transition-all duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/25 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-[#F6B94B]" />
              </div>
              <h3 className="font-heading font-bold text-white text-base">Crowdsourced Observation</h3>
              <p className="text-xs text-[#8A9A92] leading-relaxed">
                Citizens submit photos of visible plumes with automatic coordinate geocoding, timestamps, and privacy-protected identity encryption.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 hover:border-[#5CF2B2]/40 transition-all duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/25 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 text-[#5CF2B2]" />
              </div>
              <h3 className="font-heading font-bold text-white text-base">GPT-4o AI Vision</h3>
              <p className="text-xs text-[#8A9A92] leading-relaxed">
                Server-side multimodal vision models parse optical plume geometry, opacity, and particulate suspension within seconds.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 hover:border-[#5CF2B2]/40 transition-all duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/25 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-[#82B8E8]" />
              </div>
              <h3 className="font-heading font-bold text-white text-base">Atmospheric Dispersion</h3>
              <p className="text-xs text-[#8A9A92] leading-relaxed">
                Connects live Open-Meteo wind vectors with spatial report density to calculate downwind drift azimuths and hotspot clusters.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 hover:border-[#5CF2B2]/40 transition-all duration-300 space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/25 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-[#A6C7B5]" />
              </div>
              <h3 className="font-heading font-bold text-white text-base">Authority Rapid Triage</h3>
              <p className="text-xs text-[#8A9A92] leading-relaxed">
                Municipal inspectors receive AI operational briefs, verify evidence, deploy anti-smog units, and log immutable resolution notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Human Editorial Operational Cycle (No mechanical // prefixes) */}
      <section className="py-24 bg-[#0C1513]/30 border-b border-[#5CF2B2]/12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono text-[#5CF2B2] uppercase tracking-wider">
              Operational Cycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              From Observation to Ground Remediation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Citizen Snap',
                desc: 'Resident captures visible particulate emission with location coordinates and description.',
                color: 'text-[#F6B94B]',
              },
              {
                step: '02',
                title: 'AI Verification',
                desc: 'GPT-4o Vision assesses visual opacity and suggests category and limitations.',
                color: 'text-[#5CF2B2]',
              },
              {
                step: '03',
                title: 'Drift Modeling',
                desc: 'Prevailing wind vectors calculate downwind exposure corridors and spatial hotspot groups.',
                color: 'text-[#82B8E8]',
              },
              {
                step: '04',
                title: 'Field Triage',
                desc: 'Municipal ward officer dispatches suppression units and logs statutory compliance audit trails.',
                color: 'text-[#A6C7B5]',
              },
            ].map((st, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-3">
                <div className="font-mono text-2xl font-bold text-[#123C30] flex items-center justify-between">
                  <span>{st.step}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-[#F6B94B]' : idx === 1 ? 'bg-[#5CF2B2]' : idx === 2 ? 'bg-[#82B8E8]' : 'bg-[#A6C7B5]'}`} />
                </div>
                <h4 className="font-heading font-bold text-white text-base">{st.title}</h4>
                <p className="text-xs text-[#8A9A92] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Impact Comparison Simulator */}
      <section className="py-24 border-b border-[#5CF2B2]/12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#5CF2B2] uppercase tracking-wider">
              Interactive Impact Simulation
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Visualizing the Impact of Rapid Intervention
            </h2>
            <p className="text-xs text-[#8A9A92]">
              Drag the horizontal divider to contrast unmonitored stagnation with AirLens-enabled rapid containment.
            </p>
          </div>

          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-[#5CF2B2]/25 shadow-2xl select-none">
            {/* Unmitigated Left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A0F0D] via-[#0C1513] to-[#071713] flex items-center justify-start p-8">
              <div className="max-w-xs space-y-2">
                <div className="text-[11px] font-mono font-bold text-[#FF6B65]">
                  Unmonitored Smog Stagnation
                </div>
                <h3 className="text-xl font-heading font-bold text-white">Persistent Fugitive Plumes</h3>
                <p className="text-xs text-[#8A9A92]">
                  Open waste burning and dry construction piles linger without detection, exposing thousands to high particulate concentrations.
                </p>
                <div className="text-xs font-mono text-[#FF6B65] tabular-nums">PM2.5: 228 µg/m³ · Severe Exposure</div>
              </div>
            </div>

            {/* Mitigated Right */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#123C30] via-[#0C1513] to-[#0E1D19] flex items-center justify-end p-8"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <div className="max-w-xs space-y-2 text-right">
                <div className="text-[11px] font-mono font-bold text-[#5CF2B2]">
                  AirLens Rapid Intervention
                </div>
                <h3 className="text-xl font-heading font-bold text-white">Verified Containment</h3>
                <p className="text-xs text-[#8A9A92]">
                  Within 40 minutes of citizen photo submission, mist cannons are routed and unauthorized burning is halted.
                </p>
                <div className="text-xs font-mono text-[#5CF2B2] tabular-nums">PM2.5: 42 µg/m³ · Air Restored</div>
              </div>
            </div>

            {/* Slider bar */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-[#5CF2B2] shadow-[0_0_15px_#5CF2B2] cursor-ew-resize z-20 flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#5CF2B2] text-[#071713] font-bold text-xs flex items-center justify-center shadow-xl border-2 border-[#071713]">
                ↔
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Responsible AI & Data Transparency Section */}
      <section className="py-20 bg-[#0C1513]/50 border-b border-[#5CF2B2]/12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-8 rounded-3xl bg-[#0C1D18] border border-[#5CF2B2]/20 space-y-4">
            <div className="flex items-center gap-2 text-[#5CF2B2] font-mono text-xs">
              <Cpu className="w-4 h-4" />
              <span>RESPONSIBLE AI CONSTITUTION & BOUNDARIES</span>
            </div>

            <h3 className="text-2xl font-heading font-bold text-white">
              Optical Evidence Only — Zero Simulated Certainty
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#8A9A92] leading-relaxed pt-2">
              <div className="p-4 rounded-2xl bg-[#071713] border border-[#5CF2B2]/15 space-y-2">
                <div className="font-bold text-[#5CF2B2] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> What GPT-4o AI Performs
                </div>
                <p>
                  Identifies visible smoke opacity, optical plume geometry, unpaved earth mover dust clouds, and suggests operational category hypotheses to speed human triage.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#071713] border border-[#FF6B65]/20 space-y-2">
                <div className="font-bold text-[#FF6B65] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> What We Explicitly Prohibit
                </div>
                <p>
                  Never claims an image alone measures exact chemical gas PPM (SOx, NOx, VOCs) or regulatory AQI numbers, which strictly require physical in-situ laboratory sensors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Section */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Ready to Explore Your Atmospheric Environment?
          </h2>
          <p className="text-sm sm:text-base text-[#8A9A92] max-w-xl mx-auto">
            Launch the Environmental Command Center to view real-time data, explore hotspot maps, and test GPT-4o AI vision analysis.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-sm shadow-xl shadow-[#5CF2B2]/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('hotspots')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0C1513] hover:bg-[#123C30] text-[#F4F8F5] border border-[#5CF2B2]/20 font-heading font-semibold text-sm transition-all"
            >
              <span>View Geospatial Hotspots</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="mt-auto py-10 bg-[#071713] border-t border-[#5CF2B2]/12 text-xs text-[#8A9A92]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" showWordmark={true} />

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-[#5CF2B2] transition-colors">Overview</button>
            <button onClick={() => onNavigate('hotspots')} className="hover:text-[#5CF2B2] transition-colors">Map</button>
            <button onClick={() => onNavigate('report')} className="hover:text-[#5CF2B2] transition-colors">Report</button>
            <button onClick={() => onNavigate('authority')} className="hover:text-[#5CF2B2] transition-colors">Authority</button>
          </div>

          <div className="font-mono text-[10px] text-[#8A9A92]/70">
            Powered by OpenAI GPT-4o & Open-Meteo
          </div>
        </div>
      </footer>

    </div>
  );
}
