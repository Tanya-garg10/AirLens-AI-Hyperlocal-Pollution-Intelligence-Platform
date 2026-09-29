export type ReportCategory = 
  | 'smoke'
  | 'dust'
  | 'waste_burning'
  | 'construction_activity'
  | 'industrial_emissions'
  | 'other';

export type VerificationStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type RiskLevel = 'Low' | 'Moderate' | 'Elevated' | 'Critical';

export interface AIAnalysisResult {
  observed_visual_indicators: string[];
  possible_category: ReportCategory;
  visible_smoke_or_dust: boolean;
  confidence: number;
  image_limitations: string;
  recommended_follow_up: string;
  executive_summary: string;
  estimated_spread_risk: 'Low' | 'Moderate' | 'Elevated';
  is_simulated?: boolean;
}

export interface InternalNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface StatusAuditEntry {
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  timestamp: string;
  note?: string;
}

export interface PollutionReport {
  id: string;
  userId?: string;
  category: ReportCategory;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  locationLabel: string;
  cityId: string;
  observedAt: string;
  submittedAt: string;
  verificationStatus: VerificationStatus;
  priority: PriorityLevel;
  responseStatus: string;
  assignedDepartment?: string;
  assignedOfficer?: string;
  aiAnalysis?: AIAnalysisResult;
  dataSource: 'Citizen Submission' | 'Simulated Demo' | 'Field Inspector';
  updatedAt: string;
  contactName?: string;
  contactEmail?: string;
  internalNotes?: InternalNote[];
  resolutionNotes?: string;
  auditTrail?: StatusAuditEntry[];
  // Advanced features additions
  communityConfirmations?: number;
  mergedReportIds?: string[];
  isMerged?: boolean;
  mergedIntoId?: string;
  duplicateScore?: number;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  groundedReports?: string[];
  suggestedActions?: { label: string; tab?: string; actionType?: string }[];
  isSimulated?: boolean;
}

export interface DuplicateCandidateGroup {
  id: string;
  primaryReport: PollutionReport;
  candidates: {
    report: PollutionReport;
    similarityScore: number;
    distanceMeters: number;
    timeDeltaHours: number;
    matchReasons: string[];
  }[];
  anomalyFlag?: string;
}

export interface SpreadSimulationZone {
  name: string;
  distanceKm: number;
  etaMinutes: number;
  severity: 'High' | 'Moderate' | 'Low';
  advisory: string;
}

export interface SpreadSimulation {
  originReportId?: string;
  originLabel: string;
  latitude: number;
  longitude: number;
  windSpeed: number;
  windDirection: number;
  timeHours: number;
  driftAzimuth: number;
  plumeLengthKm: number;
  plumeWidthKm: number;
  affectedZones: SpreadSimulationZone[];
  dispersionRating: string;
  disclaimer: string;
}

export interface NeighbourhoodScore {
  wardId: string;
  name: string;
  score: number; // 0-100 Clean Air Score (higher = better quality, fewer active incidents)
  stressLevel: 'Optimal' | 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  reportDensity: number;
  verifiedIncidents: number;
  primarySource: string;
  dataCoveragePct: number;
  trend: 'improving' | 'stable' | 'deteriorating';
  methodology: string;
  lastUpdated: string;
}

export interface SmartAlertRule {
  id: string;
  label: string;
  enabled: boolean;
  category?: ReportCategory | 'all';
  maxDistanceKm?: number;
  aqiThreshold?: number;
  notifyHotspots: boolean;
}

export interface AIExecutiveReport {
  generatedAt: string;
  city: string;
  period: 'daily' | 'weekly';
  executiveSummary: string;
  keyFindings: string[];
  totalIncidents: number;
  resolvedCount: number;
  resolutionRatePct: number;
  topHotspots: { name: string; count: number; dominantCategory: string }[];
  recommendations: string[];
  regulatoryCitations: string[];
  isSimulated?: boolean;
}

export interface HotspotCluster {
  id: string;
  hotspotLabel: string;
  latitude: number;
  longitude: number;
  cityId: string;
  reportCount: number;
  linkedReportIds: string[];
  dominantCategory: ReportCategory;
  riskLevel: RiskLevel;
  verificationStatus: string;
  estimatedRadiusMeters: number;
  activeReportsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherData {
  temperature: number;
  relativeHumidity: number;
  windSpeed: number; // km/h
  windDirection: number; // degrees 0-360
  weatherCode: number;
  weatherDescription: string;
  isLive: boolean;
  source: string;
  lastUpdated: string;
}

export interface AirQualityData {
  pm25: number;
  pm10: number;
  aqi: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  dominantPollutant: string;
  monitoringStation: string;
  source: string;
  isLive: boolean;
  lastUpdated: string;
  hourlyTrends?: { time: string; pm25: number; pm10: number; aqi: number }[];
}

export interface CityRegion {
  id: string;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  zoom: number;
  defaultStation: string;
  wardCount: number;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'report' | 'verification' | 'assignment' | 'hotspot' | 'resolution';
  read: boolean;
  createdAt: string;
  linkedReportId?: string;
}

export interface RiskIntelligenceReport {
  cityId: string;
  overallRiskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  factors: {
    name: string;
    weight: number;
    contribution: number;
    impact: 'Low' | 'Moderate' | 'High';
    explanation: string;
  }[];
  windDispersion: {
    directionText: string;
    speedKmh: number;
    dispersionRating: 'Stagnant (High Trapping)' | 'Moderate Dispersion' | 'Strong Ventilation';
    projectedDriftAzimuth: number;
  };
  downwindAreas: {
    name: string;
    distanceKm: number;
    estimatedArrivalTimeMinutes: number;
    advisory: string;
  }[];
  hourlyForecast: {
    hour: string;
    predictedRisk: RiskLevel;
    confidence: string;
  }[];
  modelDisclaimer: string;
}
