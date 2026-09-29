/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, WorkspaceTab } from './components/Sidebar';
import { TopBar, UserRole } from './components/TopBar';
import { NotificationDrawer } from './components/NotificationDrawer';
import { SettingsModal } from './components/SettingsModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportPage } from './pages/ReportPage';
import { AnalysisLabPage } from './pages/AnalysisLabPage';
import { HotspotsPage } from './pages/HotspotsPage';
import { RiskIntelligencePage } from './pages/RiskIntelligencePage';
import { AuthorityPage } from './pages/AuthorityPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SpreadSimulatorPage } from './pages/SpreadSimulatorPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { CommunityAirWatchPage } from './pages/CommunityAirWatchPage';
import { AirLensCopilot } from './components/AirLensCopilot';
import { 
  CityRegion, 
  PollutionReport, 
  HotspotCluster, 
  WeatherData, 
  AirQualityData, 
  InAppNotification,
  ReportCategory 
} from './types';
import { SUPPORTED_CITIES, DEFAULT_CITY } from './data/cities';
import { INITIAL_REPORTS, INITIAL_NOTIFICATIONS } from './data/seedData';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<WorkspaceTab>('landing');
  const [selectedCity, setSelectedCity] = useState<CityRegion>(DEFAULT_CITY);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Pre-fill state when transitioning from AI Analysis Lab to Report page
  const [reportPrefill, setReportPrefill] = useState<{
    image?: string;
    category?: ReportCategory;
    description?: string;
  } | null>(null);

  // Data state
  const [reports, setReports] = useState<PollutionReport[]>(INITIAL_REPORTS);
  const [clusters, setClusters] = useState<HotspotCluster[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [selectedReport, setSelectedReport] = useState<PollutionReport | null>(null);

  // Sync theme with HTML root class
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkTheme) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDarkTheme]);

  // Load telemetry data whenever target metropolitan city changes
  const loadCityData = async (city: CityRegion) => {
    try {
      const [reportsData, clustersData, weatherData, aqData, notifsData] = await Promise.allSettled([
        api.getReports({ cityId: city.id }),
        api.getIncidents(city.id),
        api.getWeather(city.latitude, city.longitude),
        api.getAirQuality(city.latitude, city.longitude, city.id),
        api.getNotifications(),
      ]);

      if (reportsData.status === 'fulfilled') setReports(reportsData.value);
      if (clustersData.status === 'fulfilled') setClusters(clustersData.value);
      if (weatherData.status === 'fulfilled') setWeather(weatherData.value);
      if (aqData.status === 'fulfilled') setAirQuality(aqData.value);
      if (notifsData.status === 'fulfilled') setNotifications(notifsData.value);
    } catch (err) {
      console.warn('[AirLens AI] Background telemetry sync notice:', err);
    }
  };

  useEffect(() => {
    loadCityData(selectedCity);
  }, [selectedCity.id]);

  const handleToggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const handleSelectCity = (newCity: CityRegion) => {
    setSelectedCity(newCity);
    setSelectedReport(null);
  };

  const handleResetDemo = async () => {
    try {
      await api.resetDemoData();
      await loadCityData(selectedCity);
    } catch (err) {
      console.error('Demo reset error:', err);
    }
  };

  const handleReportSubmitted = (newReport: PollutionReport) => {
    setReports((prev) => [newReport, ...prev]);
    api.getIncidents(selectedCity.id).then(setClusters).catch(console.warn);
    api.getNotifications().then(setNotifications).catch(console.warn);
  };

  const handleUpdateReport = (updated: PollutionReport) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    api.getIncidents(selectedCity.id).then(setClusters).catch(console.warn);
    api.getNotifications().then(setNotifications).catch(console.warn);
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await api.markNotificationsRead();
      setNotifications(res.notifications);
    } catch (err) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans antialiased selection:bg-[#65F0B5]/30 selection:text-[#65F0B5] transition-colors duration-300">
      
      {/* If on public Landing page, show full cinematic landing view */}
      {currentTab === 'landing' ? (
        <LandingPage onNavigate={setCurrentTab} />
      ) : (
        /* Operations Workspace Layout with Sidebar & TopBar */
        <div className="flex-1 flex">
          {/* Vertical Sidebar (Desktop) */}
          <div className="hidden lg:block">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              unreadCount={unreadNotifCount}
              onOpenNotifications={() => setIsNotificationOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              selectedCity={selectedCity}
            />
          </div>

          {/* Main Content Workspace Column */}
          <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}>
            {/* Top Bar Navigation */}
            <TopBar
              selectedCity={selectedCity}
              onSelectCity={handleSelectCity}
              weather={weather}
              airQuality={airQuality}
              unreadCount={unreadNotifCount}
              onOpenNotifications={() => setIsNotificationOpen(true)}
              onOpenReport={() => setCurrentTab('report')}
              isDarkTheme={isDarkTheme}
              onToggleTheme={handleToggleTheme}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              searchQuery={globalSearchQuery}
              onSearchChange={setGlobalSearchQuery}
              userRole={userRole}
              onChangeUserRole={setUserRole}
              onResetDemo={handleResetDemo}
            />

            {/* Workspace Page Routing */}
            <main className="flex-1 pb-16">
              {currentTab === 'dashboard' && (
                <DashboardPage
                  city={selectedCity}
                  reports={reports}
                  clusters={clusters}
                  weather={weather}
                  airQuality={airQuality}
                  onNavigate={setCurrentTab}
                  onSelectReport={(rep) => {
                    setSelectedReport(rep);
                    setCurrentTab('authority');
                  }}
                  onOpenReportModal={() => setCurrentTab('report')}
                  userRole={userRole}
                  onChangeUserRole={setUserRole}
                />
              )}

              {currentTab === 'digitaltwin' && (
                <DigitalTwinPage
                  city={selectedCity}
                  reports={reports}
                  clusters={clusters}
                  weather={weather}
                  airQuality={airQuality}
                  onNavigateToReport={(rep) => {
                    setSelectedReport(rep);
                    setCurrentTab('authority');
                  }}
                  onOpenReportModal={() => setCurrentTab('report')}
                />
              )}

              {currentTab === 'simulator' && (
                <SpreadSimulatorPage
                  city={selectedCity}
                  reports={reports}
                  clusters={clusters}
                  weather={weather}
                  onNavigateToReport={() => setCurrentTab('report')}
                />
              )}

              {currentTab === 'community' && (
                <CommunityAirWatchPage
                  city={selectedCity}
                  onOpenReportModal={() => setCurrentTab('report')}
                  onSelectReportId={(repId) => {
                    const rep = reports.find((r) => r.id === repId);
                    if (rep) {
                      setSelectedReport(rep);
                      setCurrentTab('authority');
                    }
                  }}
                />
              )}

              {currentTab === 'hotspots' && (
                <HotspotsPage
                  city={selectedCity}
                  reports={reports}
                  clusters={clusters}
                  weather={weather}
                  selectedReport={selectedReport}
                  onSelectReport={setSelectedReport}
                  onNavigate={setCurrentTab}
                  onOpenReportModal={() => setCurrentTab('report')}
                />
              )}

              {currentTab === 'report' && (
                <ReportPage
                  city={selectedCity}
                  onReportSubmitted={handleReportSubmitted}
                  onNavigate={setCurrentTab}
                  initialPrefill={reportPrefill}
                  userRole={userRole}
                />
              )}

              {currentTab === 'analysis' && (
                <AnalysisLabPage
                  onNavigateToReport={({ image, category, description }) => {
                    setReportPrefill({ image, category, description });
                    setCurrentTab('report');
                  }}
                  onNavigate={setCurrentTab}
                />
              )}

              {currentTab === 'risk' && (
                <RiskIntelligencePage
                  city={selectedCity}
                  weather={weather}
                  airQuality={airQuality}
                />
              )}

              {currentTab === 'authority' && (
                <AuthorityPage
                  city={selectedCity}
                  reports={reports}
                  selectedReport={selectedReport}
                  onSelectReport={setSelectedReport}
                  onUpdateReport={handleUpdateReport}
                  userRole={userRole}
                  onChangeUserRole={setUserRole}
                />
              )}

              {currentTab === 'analytics' && (
                <AnalyticsPage
                  city={selectedCity}
                  reports={reports}
                  clusters={clusters}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onSelectReportId={(repId) => {
          const rep = reports.find((r) => r.id === repId);
          if (rep) {
            setSelectedReport(rep);
            setCurrentTab('authority');
          }
        }}
      />

      {/* Workspace Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        isDarkTheme={isDarkTheme}
        onToggleTheme={handleToggleTheme}
        userRole={userRole}
        onChangeUserRole={setUserRole}
        onResetDemo={handleResetDemo}
      />

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[#07120F]/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[85vw] h-full bg-[#0C1D18] border-r border-[#65F0B5]/20 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#65F0B5]/12">
                <span className="font-heading font-bold text-white">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#91A39A]">✕</button>
              </div>

              <div className="space-y-1">
                {[
                  { id: 'landing', label: 'Public Home' },
                  { id: 'dashboard', label: 'Overview' },
                  { id: 'hotspots', label: 'Explore Map' },
                  { id: 'report', label: 'Report Pollution' },
                  { id: 'analysis', label: 'AI Insights' },
                  { id: 'risk', label: 'Risk Intelligence' },
                  { id: 'authority', label: 'Authority Center' },
                  { id: 'analytics', label: 'Analytics' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id as WorkspaceTab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-heading font-medium transition-colors ${
                      currentTab === item.id ? 'bg-[#12372C] text-[#65F0B5] font-bold' : 'text-[#91A39A] hover:bg-[#07120F]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#65F0B5]/12 text-[10px] font-mono text-[#91A39A]">
              AirLens AI Next-Gen Platform
            </div>
          </div>
        </div>
      )}

      {/* Global AirLens AI Copilot */}
      <AirLensCopilot
        city={selectedCity}
        isOpen={isCopilotOpen}
        onToggle={() => setIsCopilotOpen(!isCopilotOpen)}
        onNavigateToTab={setCurrentTab}
        onSelectReportId={(repId) => {
          const rep = reports.find((r) => r.id === repId);
          if (rep) {
            setSelectedReport(rep);
            setCurrentTab('authority');
          }
        }}
      />

    </div>
  );
}
