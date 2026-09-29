import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Building2, 
  Flame, 
  Calendar,
  ShieldCheck,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { CityRegion, AIExecutiveReport } from '../types';

interface AIExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityRegion;
}

export function AIExecutiveReportModal({
  isOpen,
  onClose,
  city
}: AIExecutiveReportModalProps) {
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');
  const [report, setReport] = useState<AIExecutiveReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await api.generateExecutiveReport(city.id, period);
      setReport(data);
    } catch (err: any) {
      alert('Failed to generate report: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071713]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0C1513] border border-[#5CF2B2]/30 rounded-3xl shadow-2xl shadow-black/80 flex flex-col my-8 max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 px-6 border-b border-[#5CF2B2]/15 flex items-center justify-between bg-[#071713] rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#123C30] border border-[#5CF2B2]/30 flex items-center justify-center text-[#5CF2B2]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-heading font-bold text-[#F4F8F5]">
                  Municipal AI Environmental Briefing Dossier
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#5CF2B2]/15 text-[#5CF2B2] border border-[#5CF2B2]/30 font-bold">
                  GEMINI ASSISTED
                </span>
              </div>
              <p className="text-xs font-mono text-[#8A9A92]">
                Official Regulatory Executive Summary for {city.name}, {city.state}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8A9A92] hover:text-[#FF6B65] hover:bg-[#123C30]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#F4F8F5]">
          
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-[#071713] border border-[#5CF2B2]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-[#8A9A92]">Reporting Period:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPeriod('daily')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    period === 'daily' 
                      ? 'bg-[#5CF2B2] text-[#071713] font-bold' 
                      : 'bg-[#0C1513] text-[#8A9A92] hover:text-[#F4F8F5]'
                  }`}
                >
                  24-Hour Operational Summary
                </button>
                <button
                  onClick={() => setPeriod('weekly')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    period === 'weekly' 
                      ? 'bg-[#5CF2B2] text-[#071713] font-bold' 
                      : 'bg-[#0C1513] text-[#8A9A92] hover:text-[#F4F8F5]'
                  }`}
                >
                  7-Day Executive Audit
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#5CF2B2] to-[#48e3a2] text-[#071713] font-heading font-bold text-xs hover:brightness-105 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#5CF2B2]/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{report ? 'Regenerate Briefing' : 'Generate Briefing'}</span>
                </>
              )}
            </button>
          </div>

          {/* Report Document Container */}
          {report ? (
            <div className="p-8 rounded-3xl bg-[#071713] border border-[#5CF2B2]/25 space-y-6 shadow-2xl print:border-none print:bg-white print:text-black">
              
              {/* Header Letterhead */}
              <div className="flex items-start justify-between pb-6 border-b border-[#5CF2B2]/20">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#5CF2B2] block">
                    AIRLENS AI · STATUTORY AIR AUDIT DOSSIER
                  </span>
                  <h2 className="text-xl font-heading font-bold text-[#F4F8F5] mt-1">
                    {city.name.toUpperCase()} EXECUTIVE ENVIRONMENTAL REPORT
                  </h2>
                  <span className="text-[11px] font-mono text-[#8A9A92]">
                    Generated {new Date(report.generatedAt).toLocaleString()} · Cycle: {report.period.toUpperCase()}
                  </span>
                </div>

                <div className="text-right font-mono text-[11px] text-[#8A9A92]">
                  <span>Ref: AL-GOV-{city.id.toUpperCase()}-{new Date().getFullYear()}</span>
                  <span className="block text-[#5CF2B2] font-bold">STATUS: AUTHORIZED</span>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15">
                  <span className="text-[10px] font-mono text-[#8A9A92] block">Total Incidents</span>
                  <span className="text-xl font-mono font-bold text-[#F4F8F5]">{report.totalIncidents}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15">
                  <span className="text-[10px] font-mono text-[#8A9A92] block">Squad Interventions</span>
                  <span className="text-xl font-mono font-bold text-[#5CF2B2]">{report.resolvedCount}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15">
                  <span className="text-[10px] font-mono text-[#8A9A92] block">Resolution Rate</span>
                  <span className="text-xl font-mono font-bold text-[#5CF2B2]">{report.resolutionRatePct}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15">
                  <span className="text-[10px] font-mono text-[#8A9A92] block">Top Hotspots</span>
                  <span className="text-xl font-mono font-bold text-[#F6B94B]">{report.topHotspots.length} Zones</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#5CF2B2] font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  1. Executive Operational Summary
                </h4>
                <p className="text-xs text-[#A6C7B5] leading-relaxed p-4 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15">
                  {report.executiveSummary}
                </p>
              </div>

              {/* Key Findings */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#5CF2B2] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  2. Key Observational Findings
                </h4>
                <div className="space-y-2">
                  {report.keyFindings.map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0C1513] border border-[#5CF2B2]/10">
                      <span className="font-mono text-[#5CF2B2] font-bold shrink-0">{idx + 1}.</span>
                      <p className="text-xs text-[#F4F8F5] leading-relaxed">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tactical Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#5CF2B2] font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  3. Field Squad Tactical Recommendations
                </h4>
                <div className="space-y-2">
                  {report.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0C1513] border border-[#5CF2B2]/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5CF2B2] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#A6C7B5] leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Directives */}
              <div className="pt-4 border-t border-[#5CF2B2]/15 space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#8A9A92] block">
                  Statutory Directives & Citations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {report.regulatoryCitations.map((cite, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 rounded-xl text-[11px] font-mono bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/25"
                    >
                      {cite}
                    </span>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="pt-4 border-t border-[#5CF2B2]/10 text-[10px] font-mono text-[#8A9A92] text-center">
                This dossier is synthesized using Google Gemini AI grounded in verified citizen evidence and Open-Meteo European/EPA models.
              </div>

            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-3xl bg-[#123C30] border border-[#5CF2B2]/30 flex items-center justify-center text-[#5CF2B2]">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-heading font-semibold text-[#F4F8F5]">
                No Briefing Generated Yet
              </h4>
              <p className="text-xs text-[#8A9A92] max-w-sm mx-auto">
                Select your preferred period above and click "Generate Briefing" to compile a Gemini-synthesized executive dossier for municipal authorities.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-[#5CF2B2]/15 bg-[#071713] rounded-b-3xl flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#8A9A92]">
            AirLens AI Regulatory Intelligence Framework
          </span>

          <div className="flex items-center gap-2">
            {report && (
              <>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl bg-[#123C30] text-[#5CF2B2] hover:bg-[#5CF2B2] hover:text-[#071713] border border-[#5CF2B2]/30 font-medium transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <a
                  href="/api/export-csv"
                  download
                  className="px-3.5 py-2 rounded-xl bg-[#123C30] text-[#A6C7B5] hover:text-[#F4F8F5] border border-[#5CF2B2]/20 font-medium transition-colors flex items-center gap-1.5 text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </a>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0C1513] text-[#F4F8F5] hover:bg-[#123C30] border border-[#5CF2B2]/20 text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
