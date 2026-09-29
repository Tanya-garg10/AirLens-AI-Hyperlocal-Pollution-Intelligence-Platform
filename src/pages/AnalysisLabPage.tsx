import React, { useState, useRef } from 'react';
import { 
  Cpu, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Zap,
  Radio
} from 'lucide-react';
import { SAMPLE_POLLUTION_PHOTOS } from '../data/sampleImages';
import { CATEGORY_CONFIG, CategoryBadge } from '../components/Badges';
import { ReportCategory, AIAnalysisResult } from '../types';
import { api } from '../services/api';
import { WorkspaceTab } from '../components/Sidebar';

interface AnalysisLabPageProps {
  onNavigateToReport: (prefillData: { image: string; category: ReportCategory; description: string }) => void;
  onNavigate: (tab: WorkspaceTab) => void;
}

export function AnalysisLabPage({ onNavigateToReport }: AnalysisLabPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_POLLUTION_PHOTOS[0].dataUrl);
  const [categoryHint, setCategoryHint] = useState<ReportCategory>('waste_burning');
  const [userNotes, setUserNotes] = useState('Biomass open burning along roadside verge with visible dense white-gray smoke column.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_POLLUTION_PHOTOS[0]) => {
    setSelectedImage(sample.dataUrl);
    setCategoryHint(sample.category as ReportCategory);
    setUserNotes(sample.description);
    setAnalysisResult(null);
  };

  const runAnalysis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await api.analyzeImage({
        imageBase64: selectedImage,
        categoryHint,
        userDescription: userNotes,
      });
      setAnalysisResult(res);
      if (res.possible_category) {
        setCategoryHint(res.possible_category);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Model fallback activated.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#5CF2B2]/12">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5CF2B2] mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Multimodal Vision Diagnostics</span>
            <span className="text-[#8A9A92]">·</span>
            <span className="text-[#A6C7B5]">Google Gemini 3.8 Flash</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            AI Vision Analysis Lab
          </h1>
          <p className="text-xs text-[#8A9A92] mt-1 max-w-2xl leading-relaxed">
            Interrogate photographic observations with Gemini AI. Evaluates visible optical opacity, suspended particulate geometry, and explicit scientific boundary limitations.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#0C1513] border border-[#5CF2B2]/20 text-xs font-mono text-[#5CF2B2] flex items-center gap-2 self-start sm:self-auto">
          <Zap className="w-3.5 h-3.5" />
          <span>Server-Side Model Proxy Active</span>
        </div>
      </div>

      {/* Two-Column Investigation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Canvas & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-sm text-white">Target Evidence Canvas</h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-mono text-[#5CF2B2] hover:underline"
              >
                Upload File
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Large Image Canvas with scanning effect while analyzing */}
            <div className="relative rounded-2xl overflow-hidden border border-[#5CF2B2]/25 bg-[#071713] aspect-video flex items-center justify-center group shadow-inner">
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Analysis target" className="w-full h-full object-cover" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-[#5CF2B2]/10 backdrop-blur-[2px] pointer-events-none">
                      <div className="w-full h-1 bg-[#5CF2B2] shadow-[0_0_15px_#5CF2B2] animate-scanline" />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-[#8A9A92] font-mono p-6 text-center">
                  No photographic target loaded
                </div>
              )}
            </div>

            {/* Test Sample Grid */}
            <div>
              <span className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider block mb-2">
                Curated Test Plumes:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_POLLUTION_PHOTOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSample(s)}
                    className="rounded-xl overflow-hidden border border-[#5CF2B2]/15 hover:border-[#5CF2B2] aspect-square transition-all"
                    title={s.title}
                  >
                    <img src={s.dataUrl} alt={s.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Hypotheses Controls */}
            <div className="space-y-3 pt-3 border-t border-[#5CF2B2]/10">
              <div>
                <label className="block text-xs font-mono text-[#8A9A92] uppercase tracking-wider mb-1">
                  Category Hypothesis
                </label>
                <select
                  value={categoryHint}
                  onChange={(e) => setCategoryHint(e.target.value as ReportCategory)}
                  className="w-full bg-[#071713] border border-[#5CF2B2]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5CF2B2] font-mono"
                >
                  {(Object.keys(CATEGORY_CONFIG) as ReportCategory[]).map((cat) => (
                    <option key={cat} value={cat}>{CATEGORY_CONFIG[cat].label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8A9A92] uppercase tracking-wider mb-1">
                  Contextual Field Notes
                </label>
                <textarea
                  rows={2}
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full bg-[#071713] border border-[#5CF2B2]/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#5CF2B2] leading-relaxed"
                />
              </div>

              <button
                onClick={runAnalysis}
                disabled={isAnalyzing || !selectedImage}
                className="w-full py-3.5 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] disabled:opacity-50 text-[#071713] font-heading font-extrabold text-xs shadow-xl shadow-[#5CF2B2]/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini Vision Triage Running...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Gemini AI Visual Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Contextual Hardware Sensor Station Asset */}
          <div className="p-4 rounded-2xl bg-[#0C1513] border border-[#5CF2B2]/15 flex items-center gap-4">
            <img
              src="/src/assets/images/vision_lab_sensor_field_1790691036316.jpg"
              alt="Environmental monitoring node"
              className="w-16 h-16 rounded-xl object-cover border border-[#5CF2B2]/25 shrink-0"
            />
            <div className="text-xs">
              <div className="font-heading font-bold text-white mb-0.5">Complementary In-Situ Sensing</div>
              <p className="text-[11px] text-[#8A9A92] leading-tight">
                AI visual triage flags localized particulate plumes for verification against nearby reference monitoring stations.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Structured AI Analysis Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#5CF2B2]/12">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5CF2B2]" />
                <h2 className="font-heading font-bold text-sm text-white">Gemini 3.8 Flash Diagnostics</h2>
              </div>
              {analysisResult && (
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                  analysisResult.is_simulated
                    ? 'bg-[#F6B94B]/15 text-[#F6B94B] border border-[#F6B94B]/30'
                    : 'bg-[#5CF2B2]/15 text-[#5CF2B2] border border-[#5CF2B2]/30'
                }`}>
                  {analysisResult.is_simulated ? 'Fallback Simulation Heuristics' : 'Live Multimodal Inference'}
                </span>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-[#FF6B65]/15 border border-[#FF6B65]/30 text-xs text-[#FF6B65] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!analysisResult && !isAnalyzing && (
              <div className="py-24 text-center space-y-3 text-[#8A9A92]">
                <Cpu className="w-12 h-12 text-[#123C30] mx-auto" />
                <p className="text-xs max-w-xs mx-auto">
                  Click <strong className="text-white">Run Gemini AI Visual Analysis</strong> to inspect visible physical indicators, particulate geometry, and plume opacity.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="py-24 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#5CF2B2] animate-spin mx-auto" />
                <div className="font-heading font-bold text-sm text-white">
                  Interrogating Pixel Matrices with Google Gemini...
                </div>
                <p className="text-xs text-[#8A9A92] max-w-sm mx-auto">
                  Extracting edge diffusion, light refraction signatures, and optical opacity boundaries.
                </p>
              </div>
            )}

            {analysisResult && !isAnalyzing && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Executive Summary */}
                <div className="p-4 rounded-xl bg-[#071713] border border-[#5CF2B2]/15 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8A9A92]">Executive Visual Assessment</span>
                    <span className="text-[#5CF2B2] font-bold tabular-nums">
                      Confidence: {Math.round(analysisResult.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-[#F4F8F5] italic leading-relaxed">
                    "{analysisResult.executive_summary}"
                  </p>
                </div>

                {/* Structured Fields Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#071713] border border-[#5CF2B2]/15">
                    <span className="text-[10px] font-mono text-[#8A9A92] block mb-1">Inferred Category</span>
                    <CategoryBadge category={analysisResult.possible_category} size="sm" />
                  </div>

                  <div className="p-3 rounded-xl bg-[#071713] border border-[#5CF2B2]/15">
                    <span className="text-[10px] font-mono text-[#8A9A92] block mb-1">Visible Plume</span>
                    <span className="text-xs font-bold text-[#5CF2B2] font-mono">
                      {analysisResult.visible_smoke_or_dust ? 'CONFIRMED' : 'NONE DETECTED'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#071713] border border-[#5CF2B2]/15">
                    <span className="text-[10px] font-mono text-[#8A9A92] block mb-1">Spread Risk</span>
                    <span className={`text-xs font-bold font-mono ${
                      analysisResult.estimated_spread_risk === 'Elevated' ? 'text-[#FF6B65]' :
                      analysisResult.estimated_spread_risk === 'Moderate' ? 'text-[#F6B94B]' : 'text-[#5CF2B2]'
                    }`}>
                      {analysisResult.estimated_spread_risk}
                    </span>
                  </div>
                </div>

                {/* Physical Indicators List */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#8A9A92] uppercase tracking-wider block">
                    Observed Physical Indicators:
                  </span>
                  <div className="space-y-1.5">
                    {analysisResult.observed_visual_indicators.map((ind, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/10 text-xs text-[#8A9A92] flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5CF2B2] shrink-0 mt-0.5" />
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Field Action */}
                <div className="p-3.5 rounded-xl bg-[#123C30]/40 border border-[#5CF2B2]/20 text-xs space-y-1">
                  <span className="font-heading font-bold text-[#5CF2B2] block">Recommended Operational Action:</span>
                  <p className="text-[#8A9A92] leading-relaxed">
                    {analysisResult.recommended_follow_up}
                  </p>
                </div>

                {/* Limitations Notice */}
                <div className="p-3.5 rounded-xl bg-[#2A200B]/50 border border-[#F6B94B]/25 text-xs text-[#F6B94B] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold font-heading">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Scientific Boundary Disclaimer:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#F6B94B]/90">
                    {analysisResult.image_limitations}
                  </p>
                </div>

                {/* Action to create official report */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      onNavigateToReport({
                        image: selectedImage!,
                        category: analysisResult.possible_category,
                        description: analysisResult.executive_summary,
                      });
                    }}
                    className="px-6 py-3 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-xs shadow-lg shadow-[#5CF2B2]/20 flex items-center gap-2 transition-all hover:scale-102"
                  >
                    <span>Create Official Report with this Triage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
