import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  MapPin,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Flame,
  RefreshCw,
  ExternalLink,
  Layers,
  Check,
  Mic,
  Volume2,
  Square,
  ZapOff
} from 'lucide-react';
import { 
  CityRegion, 
  ReportCategory, 
  AIAnalysisResult, 
  PollutionReport 
} from '../types';
import { SAMPLE_POLLUTION_PHOTOS } from '../data/sampleImages';
import { CATEGORY_CONFIG, CategoryBadge } from '../components/Badges';
import { InteractiveMap } from '../components/InteractiveMap';
import { api } from '../services/api';
import { WorkspaceTab } from '../components/Sidebar';
import { UserRole } from '../components/TopBar';

interface ReportPageProps {
  city: CityRegion;
  onReportSubmitted: (newReport: PollutionReport) => void;
  onNavigate: (tab: WorkspaceTab) => void;
  initialPrefill?: {
    image?: string;
    category?: ReportCategory;
    description?: string;
  } | null;
  userRole?: UserRole;
}

export function ReportPage({ city, onReportSubmitted, onNavigate, initialPrefill, userRole = 'citizen' }: ReportPageProps) {
  // Step State (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(initialPrefill ? 2 : 1);

  // Form State
  const [category, setCategory] = useState<ReportCategory>(initialPrefill?.category || 'waste_burning');
  const [imagePreview, setImagePreview] = useState<string | null>(initialPrefill?.image || null);
  const [latitude, setLatitude] = useState<number>(city.latitude + 0.012);
  const [longitude, setLongitude] = useState<number>(city.longitude + 0.008);
  const [locationLabel, setLocationLabel] = useState(`${city.name} Observation Point`);
  const [description, setDescription] = useState(initialPrefill?.description || '');
  const [observedAt, setObservedAt] = useState(new Date().toISOString().slice(0, 16));
  const [contactName, setContactName] = useState(
    userRole === 'inspector' ? 'Squad 4 Patrol Inspector' :
    userRole === 'officer' ? 'Ward 42 Intake Officer' :
    userRole === 'pcb_lead' ? 'State PCB Surveillance Officer' : ''
  );
  const [contactEmail, setContactEmail] = useState('');

  // Persona-specific fields
  const [smellIrritation, setSmellIrritation] = useState<string[]>(['Pungent / Acrid burning smell']);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [inspectorSquadId, setInspectorSquadId] = useState('PATROL-UNIT-04');
  const [inspectorInitialAction, setInspectorInitialAction] = useState('Challan Issued on Spot');
  const [wardNumber, setWardNumber] = useState('Ward 42');
  const [violatorProperty, setViolatorProperty] = useState('');
  const [pcbConsentId, setPcbConsentId] = useState('CTO-DPCC-IND-2026-8812');
  const [stackHeightMeters, setStackHeightMeters] = useState('25');

  // Camera Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openCamera = useCallback(async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setCameraError(err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access in your browser settings.'
        : 'Camera not available on this device. Please upload a file instead.');
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  }, []);

  const snapPhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setImagePreview(dataUrl);
    setAiAnalysis(null);
    closeCamera();
  }, [closeCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, []);

  // AI & Submission States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<PollutionReport | null>(null);

  // Voice Reporting State
  const [isRecording, setIsRecording] = useState(false);
  const [speechLang, setSpeechLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const handleToggleVoice = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. You can select sample voice phrases below or type manually.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = speechLang;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setDescription(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        setSpeechError(`Voice input error: ${event.error || 'Microphone error'}. You can type manually.`);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsRecording(false);
      setSpeechError('Microphone initialization failed: ' + err.message);
    }
  };

  const handleSpeakInstructions = () => {
    if ('speechSynthesis' in window) {
      const text = speechLang === 'hi-IN' 
        ? 'कृपया अपने आस-पास दिखने वाले धुएँ, धूल या कचरा जलाने की घटना का वर्णन करें।' 
        : 'Please describe the smoke, dust, or open burning observed in your neighborhood.';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 1, title: 'Category', desc: 'Select Physical Type' },
    { number: 2, title: 'Evidence', desc: 'Upload Observation' },
    { number: 3, title: 'Location', desc: 'Pin Coordinates' },
    { number: 4, title: 'Context', desc: 'Field Details' },
    { number: 5, title: 'Verification', desc: 'AI Triage & Register' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      alert('File size exceeds 12MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setAiAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_POLLUTION_PHOTOS[0]) => {
    setImagePreview(sample.dataUrl);
    setCategory(sample.category as ReportCategory);
    setDescription(sample.description);
    setLocationLabel(`${sample.locationHint}, ${city.name}`);
    setAiAnalysis(null);
  };

  const handleRunAiTriage = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await api.analyzeImage({
        imageBase64: imagePreview,
        categoryHint: category,
        userDescription: description,
        locationContext: locationLabel,
      });
      setAiAnalysis(res);
      if (res.possible_category) {
        setCategory(res.possible_category);
      }
    } catch (err: any) {
      setAnalysisError(err.message || 'AI visual triage unavailable. You can still register the report manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!imagePreview) {
      alert('Please upload or select an observation photograph.');
      setCurrentStep(2);
      return;
    }
    if (!description.trim()) {
      alert('Please provide a brief description.');
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    try {
      const report = await api.createReport({
        category,
        imageUrl: imagePreview,
        latitude,
        longitude,
        locationLabel,
        description,
        cityId: city.id,
        contactName: contactName || undefined,
        contactEmail: contactEmail || undefined,
        aiAnalysis: aiAnalysis || undefined,
      });

      setSubmittedReport(report);
      onReportSubmitted(report);
    } catch (err: any) {
      alert('Submission failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#5CF2B2]/12">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5CF2B2] mb-1">
            <Flame className="w-3.5 h-3.5 text-[#F6B94B]" />
            <span>Citizen Atmospheric Vigilance</span>
            <span className="text-[#8A9A92]">·</span>
            <span className="text-[#A6C7B5]">{city.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            Report Visible Pollution
          </h1>
          <p className="text-xs text-[#8A9A92] mt-1">
            Document open burning, unpaved dust plumes, or industrial stack smoke. Your photo helps municipal inspectors locate and remediate localized exposure.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 rounded-xl bg-[#0C1513] hover:bg-[#123C30] text-[#8A9A92] hover:text-[#F4F8F5] text-xs font-mono border border-[#5CF2B2]/15 transition-colors self-start sm:self-auto"
        >
          Return to Overview
        </button>
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="grid grid-cols-5 gap-2 p-2 bg-[#0C1513] rounded-2xl border border-[#5CF2B2]/15 text-center">
        {steps.map((st) => (
          <button
            key={st.number}
            onClick={() => setCurrentStep(st.number)}
            className={`py-2 px-1 rounded-xl transition-all ${
              currentStep === st.number
                ? 'bg-[#123C30] text-[#5CF2B2] font-semibold border border-[#5CF2B2]/30 shadow-sm'
                : currentStep > st.number
                ? 'text-[#A6C7B5] hover:bg-[#071713]'
                : 'text-[#8A9A92]/60 hover:text-[#8A9A92]'
            }`}
          >
            <div className="text-[10px] font-mono uppercase tracking-wider block">
              Step {st.number}
            </div>
            <div className="text-xs font-heading font-bold truncate">
              {st.title}
            </div>
          </button>
        ))}
      </div>

      {/* STEP 1: Select Category */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-6 shadow-xl animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-heading font-bold text-white">01. Select Pollution Category</h2>
            <p className="text-xs text-[#8A9A92]">Identify the physical nature of the particulate emission.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(CATEGORY_CONFIG) as ReportCategory[]).map((cat) => {
              const conf = CATEGORY_CONFIG[cat];
              const Icon = conf.icon;
              const isSelected = category === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#123C30] border-[#5CF2B2] shadow-lg shadow-[#5CF2B2]/15 scale-102'
                      : 'bg-[#071713] border-[#5CF2B2]/15 hover:border-[#5CF2B2]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2.5 rounded-xl ${conf.bg} ${conf.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#5CF2B2]" />}
                  </div>
                  <div className="font-heading font-bold text-sm text-white">{conf.label}</div>
                  <div className="text-[11px] text-[#8A9A92] mt-1">
                    {cat === 'waste_burning' && 'Dry garbage, plastic, municipal refuse'}
                    {cat === 'dust' && 'Unpaved road verges, demolition silt, dry transit'}
                    {cat === 'construction_activity' && 'Uncovered aggregate piles, site earthmoving'}
                    {cat === 'industrial_emissions' && 'Factory boiler chimneys, diesel gensets'}
                    {cat === 'smoke' && 'General biomass, localized furnace smoke'}
                    {cat === 'other' && 'Unclassified optical haze or unusual emission'}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#5CF2B2]/12">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-xs shadow-lg shadow-[#5CF2B2]/20 flex items-center gap-2 transition-all hover:scale-102"
            >
              <span>Continue to Photographic Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Upload Evidence */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-6 shadow-xl animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-heading font-bold text-white">02. Upload Photographic Evidence</h2>
            <p className="text-xs text-[#8A9A92]">Provide an image of the plume. You can upload a file, snap a photo, or choose a curated sample for testing.</p>
          </div>

          {/* Hidden inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* Image Preview & Upload Dropzone */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7">
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-[#5CF2B2]/30 bg-[#071713] aspect-video group shadow-inner">
                  <img src={imagePreview} alt="Observation preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setAiAnalysis(null);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-[#071713]/80 hover:bg-[#FF6B65] text-white transition-colors backdrop-blur-md"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#5CF2B2]/25 hover:border-[#5CF2B2] rounded-2xl p-8 text-center bg-[#071713]/60 cursor-pointer transition-all aspect-video flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#123C30] text-[#5CF2B2] flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-heading font-semibold text-white block">
                      Click to Browse File or Drag Photo Here
                    </span>
                    <span className="text-[11px] text-[#8A9A92]">JPEG, PNG, WEBP up to 12MB</span>
                  </div>
                </div>
              )}

              {/* Mobile Camera Option */}
              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#071713] hover:bg-[#123C30] border border-[#5CF2B2]/20 text-xs text-white font-mono flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#5CF2B2]" />
                  <span>Choose File</span>
                </button>
                <button
                  type="button"
                  onClick={openCamera}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#071713] hover:bg-[#123C30] border border-[#5CF2B2]/20 text-xs text-white font-mono flex items-center justify-center gap-2 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-[#5CF2B2]" />
                  <span>Capture Camera</span>
                </button>
              </div>
            </div>

            {/* Curated Sample Plumes for immediate testing */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs font-mono text-[#5CF2B2] uppercase tracking-wider block font-bold">
                1-Click Testing Presets:
              </span>
              <p className="text-[11px] text-[#8A9A92]">
                Select pre-curated verified emission samples for instant demonstration:
              </p>

              <div className="space-y-2">
                {SAMPLE_POLLUTION_PHOTOS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="w-full p-2.5 rounded-xl bg-[#071713] hover:bg-[#123C30] border border-[#5CF2B2]/15 hover:border-[#5CF2B2]/40 flex items-center gap-3 text-left transition-all"
                  >
                    <img
                      src={sample.dataUrl}
                      alt={sample.title}
                      className="w-12 h-12 rounded-lg object-cover border border-[#5CF2B2]/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{sample.title}</div>
                      <div className="text-[10px] text-[#8A9A92] truncate">{sample.locationHint}</div>
                      <CategoryBadge category={sample.category as ReportCategory} size="sm" className="mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#5CF2B2]/12">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl bg-[#071713] hover:bg-[#123C30] text-[#8A9A92] text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={!imagePreview}
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] disabled:opacity-50 text-[#071713] font-heading font-bold text-xs shadow-lg shadow-[#5CF2B2]/20 flex items-center gap-2 transition-all hover:scale-102"
            >
              <span>Continue to Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Location Coordinates */}
      {currentStep === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1D18] border border-[#5CF2B2]/20 space-y-6 shadow-xl animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-heading font-bold text-white">03. Geocode Location Coordinates</h2>
            <p className="text-xs text-[#8A9A92]">Pinpoint the observation on the interactive map or verify GPS coordinates.</p>
          </div>

          {/* Interactive Map Picker */}
          <div className="rounded-2xl overflow-hidden border border-[#5CF2B2]/25">
            <InteractiveMap
              city={city}
              reports={[]}
              clusters={[]}
              selectableLocation={true}
              selectedCoordinates={{ lat: latitude, lng: longitude }}
              onSelectCoordinates={(lat, lng, hint) => {
                setLatitude(lat);
                setLongitude(lng);
                if (hint) setLocationLabel(hint);
              }}
              heightClass="h-[380px]"
            />
          </div>

          {/* Coordinate Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-[#8A9A92] uppercase tracking-wider mb-1">
                Location Landmark / Street Description
              </label>
              <input
                type="text"
                value={locationLabel}
                onChange={(e) => setLocationLabel(e.target.value)}
                className="w-full bg-[#071713] border border-[#5CF2B2]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5CF2B2]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8A9A92] uppercase tracking-wider mb-1">
                Latitude / Longitude
              </label>
              <div className="px-3 py-2 rounded-xl bg-[#071713] border border-[#5CF2B2]/15 text-xs font-mono text-[#5CF2B2] truncate tabular-nums">
                {latitude.toFixed(5)}, {longitude.toFixed(5)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#5CF2B2]/12">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl bg-[#071713] hover:bg-[#123C30] text-[#8A9A92] text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-xs shadow-lg shadow-[#5CF2B2]/20 flex items-center gap-2 transition-all hover:scale-102"
            >
              <span>Continue to Eyewitness Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Eyewitness Details */}
      {currentStep === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1D18] border border-[#5CF2B2]/20 space-y-6 shadow-xl animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-heading font-bold text-white">04. Observation Details & Eyewitness Notes</h2>
            <p className="text-xs text-[#8A9A92]">Provide observations regarding plume intensity, nearby human exposure, and observation time.</p>
          </div>

          <div className="space-y-4">
            {/* Multilingual Voice Reporting Widget */}
            <div className="p-4 rounded-2xl bg-[#071713] border border-[#5CF2B2]/20 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5CF2B2] font-bold flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-[#5CF2B2]" />
                    Multilingual Voice-to-Text Input
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#5CF2B2]/20 text-[#5CF2B2]">
                    HINDI & ENGLISH
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#0C1513] p-1 rounded-xl border border-[#5CF2B2]/20 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setSpeechLang('hi-IN')}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        speechLang === 'hi-IN' ? 'bg-[#5CF2B2] text-[#071713] font-bold' : 'text-[#8A9A92]'
                      }`}
                    >
                      हिन्दी
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeechLang('en-IN')}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        speechLang === 'en-IN' ? 'bg-[#5CF2B2] text-[#071713] font-bold' : 'text-[#8A9A92]'
                      }`}
                    >
                      English
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSpeakInstructions}
                    className="p-1.5 rounded-xl bg-[#0C1513] text-[#8A9A92] hover:text-[#5CF2B2] border border-[#5CF2B2]/20"
                    title="Audio instructions playback"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Voice Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#5CF2B2]/10">
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                    isRecording 
                      ? 'bg-[#FF6B65] text-white animate-pulse' 
                      : 'bg-[#123C30] hover:bg-[#5CF2B2] text-[#5CF2B2] hover:text-[#071713] border border-[#5CF2B2]/30'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Recording ({speechLang === 'hi-IN' ? 'सुन रहे हैं...' : 'Listening...'})</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>{speechLang === 'hi-IN' ? 'बोलकर रिपोर्ट दर्ज करें' : 'Record Voice Observation'}</span>
                    </>
                  )}
                </button>

                {/* Quick Sample Voice Phrases */}
                <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto">
                  <span className="text-[#8A9A92] font-mono text-[10px]">Quick:</span>
                  <button
                    type="button"
                    onClick={() => setDescription(prev => prev ? prev + ' ' + 'यहाँ कचरा जलाया जा रहा है और काला धुआँ उठ रहा है।' : 'यहाँ कचरा जलाया जा रहा है और काला धुआँ उठ रहा है।')}
                    className="px-2 py-0.5 rounded bg-[#0C1513] text-[#A6C7B5] hover:text-[#5CF2B2] border border-[#5CF2B2]/15 text-[10px]"
                  >
                    + कचरा जलाना
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescription(prev => prev ? prev + ' ' + 'सड़क पर भारी धूल उड़ रही है जिससे साँस लेने में तकलीफ़ है।' : 'सड़क पर भारी धूल उड़ रही है जिससे साँस लेने में तकलीफ़ है।')}
                    className="px-2 py-0.5 rounded bg-[#0C1513] text-[#A6C7B5] hover:text-[#5CF2B2] border border-[#5CF2B2]/15 text-[10px]"
                  >
                    + निर्माण धूल
                  </button>
                </div>
              </div>

              {speechError && (
                <p className="text-[11px] text-[#F6B94B] pt-1">
                  {speechError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8A9A92] uppercase tracking-wider mb-1">
                Detailed Eyewitness Description (Voice Transcribed or Typed) *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={speechLang === 'hi-IN' ? 'यहाँ बोलें या लिखें: जैसे कि खुले में प्लास्टिक और कचरा जलाया जा रहा है, जिससे आँखों में जलन हो रही है...' : 'e.g. Thick black smoke rising from open burning of packaging waste behind warehouse. Acrid smell spreading toward school.'}
                className="w-full bg-[#071713] border border-[#5CF2B2]/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#5CF2B2] leading-relaxed"
              />
            </div>

            {/* Persona Specific Custom Fields */}
            {userRole === 'citizen' && (
              <div className="p-4 rounded-2xl bg-[#071713] border border-[#5CF2B2]/20 space-y-3">
                <span className="text-xs font-mono text-[#5CF2B2] uppercase tracking-wider block font-bold">
                  Citizen Sensory & Health Observation (Optional)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  {[
                    'Pungent / Acrid burning smell',
                    'Eye stinging / Watering',
                    'Throat scratchiness',
                    'Low visibility / Smog layer',
                  ].map((s) => {
                    const active = smellIrritation.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSmellIrritation(
                            active ? smellIrritation.filter((x) => x !== s) : [...smellIrritation, s]
                          );
                        }}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          active
                            ? 'bg-[#123C30] text-[#5CF2B2] border-[#5CF2B2]/40 font-bold'
                            : 'bg-[#0C1513] text-[#8A9A92] border-[#5CF2B2]/10 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-[#8A9A92]">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => {
                      setIsAnonymous(e.target.checked);
                      if (e.target.checked) {
                        setContactName('Anonymous Resident');
                      }
                    }}
                    className="rounded text-[#5CF2B2] focus:ring-0"
                  />
                  <span>Submit report anonymously (hide contact name from public maps)</span>
                </label>
              </div>
            )}

            {userRole === 'inspector' && (
              <div className="p-4 rounded-2xl bg-[#071713] border border-[#F6B94B]/30 space-y-3">
                <span className="text-xs font-mono text-[#F6B94B] uppercase tracking-wider block font-bold">
                  Field Squad Patrol Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] text-[#8A9A92] uppercase mb-1">Squad Call Sign</label>
                    <input
                      type="text"
                      value={inspectorSquadId}
                      onChange={(e) => setInspectorSquadId(e.target.value)}
                      className="w-full bg-[#0C1513] border border-[#F6B94B]/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#8A9A92] uppercase mb-1">Immediate Field Action</label>
                    <input
                      type="text"
                      value={inspectorInitialAction}
                      onChange={(e) => setInspectorInitialAction(e.target.value)}
                      className="w-full bg-[#0C1513] border border-[#F6B94B]/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {userRole === 'officer' && (
              <div className="p-4 rounded-2xl bg-[#071713] border border-[#5CF2B2]/30 space-y-3">
                <span className="text-xs font-mono text-[#5CF2B2] uppercase tracking-wider block font-bold">
                  Municipal Ward Administration Intake
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] text-[#8A9A92] uppercase mb-1">Ward Number / Jurisdiction</label>
                    <input
                      type="text"
                      value={wardNumber}
                      onChange={(e) => setWardNumber(e.target.value)}
                      className="w-full bg-[#0C1513] border border-[#5CF2B2]/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#8A9A92] uppercase mb-1">Property Occupier / Site Developer</label>
                    <input
                      type="text"
                      value={violatorProperty}
                      onChange={(e) => setViolatorProperty(e.target.value)}
                      placeholder="e.g. Metro Construction Lot 4"
                      className="w-full bg-[#0C1513] border border-[#5CF2B2]/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {userRole === 'pcb_lead' && (
              <div className="p-4 rounded-2xl bg-[#071713] border border-[#60A5FA]/30 space-y-3">
                <span className="text-xs font-mono text-[#93C5FD] uppercase tracking-wider block font-bold">
                  State PCB Regulatory Consent Record
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] text-[#8A9A92] uppercase mb-1">Consent to Operate (CTO) ID</label>
                    <input
                      type="text"
                      value={pcbConsentId}
                      onChange={(e) => setPcbConsentId(e.target.value)}
                      className="w-full bg-[#0C1513] border border-[#60A5FA]/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#8A9A92] uppercase mb-1">Chimney Stack Height (m)</label>
                    <input
                      type="number"
                      value={stackHeightMeters}
                      onChange={(e) => setStackHeightMeters(e.target.value)}
                      className="w-full bg-[#0C1513] border border-[#60A5FA]/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#8A9A92] uppercase tracking-wider mb-1">
                  Time of Observation
                </label>
                <input
                  type="datetime-local"
                  value={observedAt}
                  onChange={(e) => setObservedAt(e.target.value)}
                  className="w-full bg-[#071713] border border-[#5CF2B2]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5CF2B2] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8A9A92] uppercase tracking-wider mb-1">
                  Observer Name (Optional)
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Anonymous or Full Name"
                  className="w-full bg-[#071713] border border-[#5CF2B2]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5CF2B2]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8A9A92] uppercase tracking-wider mb-1">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="For triage status updates"
                  className="w-full bg-[#071713] border border-[#5CF2B2]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5CF2B2]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#5CF2B2]/12">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl bg-[#071713] hover:bg-[#123C30] text-[#8A9A92] text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={!description.trim()}
              onClick={() => {
                setCurrentStep(5);
                handleRunAiTriage();
              }}
              className="px-6 py-3 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] disabled:opacity-50 text-[#071713] font-heading font-bold text-xs shadow-lg shadow-[#5CF2B2]/20 flex items-center gap-2 transition-all hover:scale-102"
            >
              <span>Run GPT-4o Vision Triage & Review</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Gemini AI Review & Register */}
      {currentStep === 5 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1D18] border border-[#5CF2B2]/20 space-y-6 shadow-xl animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-heading font-bold text-white">05. GPT-4o Vision Review & Final Submission</h2>
            <p className="text-xs text-[#8A9A92]">GPT-4o preliminary analysis checks optical plume characteristics before registering into the municipal queue.</p>
          </div>

          {/* Side-by-Side Review Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 space-y-3">
              <div className="rounded-2xl overflow-hidden border border-[#5CF2B2]/30 bg-[#071713] aspect-video">
                {imagePreview && (
                  <img src={imagePreview} alt="Report target" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-3 rounded-xl bg-[#071713] border border-[#5CF2B2]/15 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8A9A92]">Selected Type:</span>
                  <CategoryBadge category={category} size="sm" />
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A9A92]">Coordinates:</span>
                  <span className="text-[#5CF2B2] tabular-nums">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* AI Review Output */}
            <div className="md:col-span-7 p-5 rounded-2xl bg-[#071713] border border-[#5CF2B2]/20 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#5CF2B2]/10">
                <span className="text-xs font-heading font-bold text-[#5CF2B2] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#5CF2B2]" />
                  <span>GPT-4o AI Visual Triage</span>
                </span>
                {isAnalyzing ? (
                  <span className="text-[10px] font-mono text-[#F6B94B] flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing pixels...
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRunAiTriage}
                    className="text-[10px] font-mono text-[#5CF2B2] hover:underline"
                  >
                    Re-analyze
                  </button>
                )}
              </div>

              {aiAnalysis ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider block mb-0.5">
                      Model Summary
                    </span>
                    <p className="text-white italic leading-relaxed">
                      "{aiAnalysis.executive_summary}"
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider block mb-1">
                      Observed Visual Indicators
                    </span>
                    <ul className="space-y-1 text-[#8A9A92]">
                      {aiAnalysis.observed_visual_indicators.map((ind, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#5CF2B2]">•</span>
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-[#5CF2B2]/10 text-[10px] text-[#8A9A92]/80 italic">
                    {aiAnalysis.image_limitations}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#8A9A92] italic py-6">
                  {analysisError || 'Ready for visual triage.'}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#5CF2B2]/12">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl bg-[#071713] hover:bg-[#123C30] text-[#8A9A92] text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-8 py-3.5 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] disabled:opacity-50 text-[#071713] font-heading font-extrabold text-sm shadow-xl shadow-[#5CF2B2]/25 flex items-center gap-2 transition-all hover:scale-102"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to Municipal Queue...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Register Incident</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Success Modal */}
      {submittedReport && (
        <div className="fixed inset-0 z-50 bg-[#071713]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0C1513] border border-[#5CF2B2]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#123C30] text-[#5CF2B2] border border-[#5CF2B2]/30 flex items-center justify-center mx-auto shadow-lg shadow-[#5CF2B2]/20">
              <CheckCircle2 className="w-8 h-8 text-[#5CF2B2]" />
            </div>

            <h3 className="text-xl font-heading font-extrabold text-white">Observation Registered</h3>
            <p className="text-xs text-[#8A9A92] leading-relaxed">
              Your observation has been indexed and routed to the {city.name} Municipal Triage Cell.
            </p>

            <div className="p-4 bg-[#071713] rounded-2xl border border-[#5CF2B2]/15 text-left space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#8A9A92]">Report ID:</span>
                <span className="font-bold text-[#5CF2B2]">{submittedReport.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A9A92]">Category:</span>
                <span className="text-white capitalize">{submittedReport.category.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A9A92]">Verification Status:</span>
                <span className="text-[#F6B94B]">{submittedReport.verificationStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => onNavigate('hotspots')}
                className="py-3 rounded-xl bg-[#071713] hover:bg-[#123C30] text-[#F4F8F5] text-xs font-mono border border-[#5CF2B2]/20 transition-colors"
              >
                View on Map
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="py-3 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] text-xs font-heading font-bold shadow-lg shadow-[#5CF2B2]/20 transition-all hover:scale-102"
              >
                Command Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for camera snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Capture Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0C1513] rounded-3xl border border-[#5CF2B2]/30 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#5CF2B2]/15">
              <div className="flex items-center gap-2 text-sm font-heading font-bold text-white">
                <Camera className="w-4 h-4 text-[#5CF2B2]" />
                <span>Live Camera Capture</span>
              </div>
              <button
                onClick={closeCamera}
                className="p-1.5 rounded-xl text-[#8A9A92] hover:text-[#FF6B65] hover:bg-[#123C30]/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video / Error */}
            <div className="relative bg-black aspect-video">
              {cameraError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <ZapOff className="w-10 h-10 text-[#FF6B65]" />
                  <p className="text-xs text-[#8A9A92] leading-relaxed">{cameraError}</p>
                  <button
                    onClick={closeCamera}
                    className="px-4 py-2 rounded-xl bg-[#071713] border border-[#5CF2B2]/20 text-xs text-[#F4F8F5] font-mono"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Snap Button */}
            {!cameraError && (
              <div className="flex items-center justify-center gap-4 px-5 py-5">
                <button
                  onClick={closeCamera}
                  className="px-5 py-2.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/15 text-xs text-[#8A9A92] font-mono hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={snapPhoto}
                  className="px-8 py-3 rounded-2xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-sm shadow-xl shadow-[#5CF2B2]/25 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Photo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
