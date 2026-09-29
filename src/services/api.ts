import { 
  PollutionReport, 
  HotspotCluster, 
  WeatherData, 
  AirQualityData, 
  RiskIntelligenceReport, 
  InAppNotification,
  AIAnalysisResult,
  DuplicateCandidateGroup,
  SpreadSimulation,
  NeighbourhoodScore,
  AIExecutiveReport
} from '../types';

export const api = {
  async getReports(params?: { cityId?: string; category?: string; status?: string; priority?: string; search?: string }): Promise<PollutionReport[]> {
    const query = new URLSearchParams();
    if (params?.cityId) query.set('cityId', params.cityId);
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.priority) query.set('priority', params.priority);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`/api/reports?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async createReport(reportData: Partial<PollutionReport>): Promise<PollutionReport> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Submission failed' }));
      throw new Error(err.error || 'Failed to submit report');
    }
    return res.json();
  },

  async updateReport(id: string, updates: Record<string, any>): Promise<PollutionReport> {
    const res = await fetch(`/api/reports/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update report');
    return res.json();
  },

  async analyzeImage(payload: {
    imageBase64: string;
    categoryHint?: string;
    userDescription?: string;
    locationContext?: string;
  }): Promise<AIAnalysisResult> {
    const res = await fetch('/api/ai/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
      throw new Error(err.error || 'Failed to analyze image');
    }
    return res.json();
  },

  async generateBriefing(reportId: string, incidentData: Partial<PollutionReport>): Promise<{ briefing: string; is_simulated: boolean }> {
    const res = await fetch('/api/ai/briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, incidentData }),
    });
    if (!res.ok) throw new Error('Failed to generate operational briefing');
    return res.json();
  },

  async getIncidents(cityId?: string): Promise<HotspotCluster[]> {
    const query = cityId ? `?cityId=${cityId}` : '';
    const res = await fetch(`/api/incidents${query}`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async getWeather(lat: number, lng: number): Promise<WeatherData> {
    const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
    if (!res.ok) throw new Error('Failed to fetch weather');
    return res.json();
  },

  async getAirQuality(lat: number, lng: number, cityId?: string): Promise<AirQualityData> {
    const query = `?lat=${lat}&lng=${lng}${cityId ? `&cityId=${cityId}` : ''}`;
    const res = await fetch(`/api/air-quality${query}`);
    if (!res.ok) throw new Error('Failed to fetch air quality');
    return res.json();
  },

  async getRiskIntelligence(cityId: string): Promise<RiskIntelligenceReport> {
    const res = await fetch(`/api/risk-intelligence?cityId=${cityId}`);
    if (!res.ok) throw new Error('Failed to fetch risk intelligence');
    return res.json();
  },

  async getNotifications(): Promise<InAppNotification[]> {
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationsRead(id?: string): Promise<{ success: boolean; notifications: InAppNotification[] }> {
    const res = await fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Failed to mark notifications read');
    return res.json();
  },

  async resetDemoData(): Promise<void> {
    const res = await fetch('/api/demo/reset', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo data');
  },

  async askCopilot(query: string, cityId?: string, history?: any[]): Promise<{ response: string; groundedReports?: string[]; is_simulated?: boolean }> {
    const res = await fetch('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, cityId, history }),
    });
    if (!res.ok) throw new Error('Copilot inquiry failed');
    return res.json();
  },

  async getDuplicates(cityId?: string): Promise<DuplicateCandidateGroup[]> {
    const query = cityId ? `?cityId=${cityId}` : '';
    const res = await fetch(`/api/ai/duplicates${query}`);
    if (!res.ok) throw new Error('Failed to fetch duplicate clusters');
    return res.json();
  },

  async mergeReports(payload: {
    primaryReportId: string;
    duplicateReportIds: string[];
    mergeNotes?: string;
    operatorName?: string;
  }): Promise<{ success: boolean; primaryReport: PollutionReport }> {
    const res = await fetch('/api/reports/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to merge reports');
    return res.json();
  },

  async getCommunityFeed(cityId?: string): Promise<any[]> {
    const query = cityId ? `?cityId=${cityId}` : '';
    const res = await fetch(`/api/community/feed${query}`);
    if (!res.ok) throw new Error('Failed to fetch community feed');
    return res.json();
  },

  async confirmCommunityReport(reportId: string): Promise<{ success: boolean; count: number; reportId: string }> {
    const res = await fetch('/api/community/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId }),
    });
    if (!res.ok) throw new Error('Failed to confirm report observation');
    return res.json();
  },

  async getSpreadSimulation(params: {
    reportId?: string;
    clusterId?: string;
    windSpeed?: number;
    windDirection?: number;
    timeHours?: number;
    cityId?: string;
  }): Promise<SpreadSimulation> {
    const res = await fetch('/api/ai/simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to compute dispersion simulation');
    return res.json();
  },

  async getNeighbourhoodScores(cityId?: string): Promise<NeighbourhoodScore[]> {
    const query = cityId ? `?cityId=${cityId}` : '';
    const res = await fetch(`/api/neighbourhood-scores${query}`);
    if (!res.ok) throw new Error('Failed to fetch neighbourhood scores');
    return res.json();
  },

  async generateExecutiveReport(cityId: string, period: 'daily' | 'weekly' = 'daily'): Promise<AIExecutiveReport> {
    const res = await fetch('/api/ai/executive-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityId, period }),
    });
    if (!res.ok) throw new Error('Failed to generate executive report');
    return res.json();
  }
};
