import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Wind, 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  Send, 
  RefreshCw, 
  History, 
  Building2, 
  Filter, 
  Flame,
  XCircle,
  Eye,
  Check,
  ChevronRight,
  ArrowUpRight,
  Download,
  Shield,
  Truck,
  FileCheck2,
  Lock,
  ThumbsUp,
  Bell,
  Scale,
  Hash,
  Activity
} from 'lucide-react';
import { 
  CityRegion, 
  PollutionReport, 
  VerificationStatus, 
  PriorityLevel,
  DuplicateCandidateGroup
} from '../types';
import { CategoryBadge, StatusBadge, PriorityBadge } from '../components/Badges';
import { UserRole } from '../components/TopBar';
import { AIExecutiveReportModal } from '../components/AIExecutiveReportModal';
import { api } from '../services/api';

interface AuthorityPageProps {
  city: CityRegion;
  reports: PollutionReport[];
  selectedReport: PollutionReport | null;
  onSelectReport: (report: PollutionReport | null) => void;
  onUpdateReport: (updated: PollutionReport) => void;
  userRole?: UserRole;
  onChangeUserRole?: (role: UserRole) => void;
}

export function AuthorityPage({
  city,
  reports,
  selectedReport,
  onSelectReport,
  onUpdateReport,
  userRole = 'officer',
  onChangeUserRole,
}: AuthorityPageProps) {
  const [tabFilter, setTabFilter] = useState<'pending' | 'priority' | 'assigned' | 'resolved' | 'duplicates' | 'all'>('pending');
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [briefingText, setBriefingText] = useState<string | null>(null);
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [resolutionInput, setResolutionInput] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isExecutiveReportOpen, setIsExecutiveReportOpen] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateCandidateGroup[]>([]);
  const [mergingId, setMergingId] = useState<string | null>(null);

  // Load duplicates on mount or when city/reports change
  React.useEffect(() => {
    api.getDuplicates(city.id).then(setDuplicateGroups).catch(console.warn);
  }, [city.id, reports]);

  const handleMergeDuplicate = async (primaryId: string, dupIds: string[]) => {
    setMergingId(primaryId);
    try {
      const res = await api.mergeReports({
        primaryReportId: primaryId,
        duplicateReportIds: dupIds,
        mergeNotes: 'Consolidated co-located report via Duplicate Intelligence.',
        operatorName: userRole === 'inspector' ? 'Field Inspector' : 'Municipal Lead'
      });
      onUpdateReport(res.primaryReport);
      onSelectReport(res.primaryReport);
      const updatedDups = await api.getDuplicates(city.id);
      setDuplicateGroups(updatedDups);
    } catch (err: any) {
      alert('Failed to merge reports: ' + err.message);
    } finally {
      setMergingId(null);
    }
  };

  // Inspector specific state
  const [inspectorChecklist, setInspectorChecklist] = useState({
    activeOnArrival: true,
    sourceIdentified: true,
    containmentApplied: false,
  });
  const [deployedEquipment, setDeployedEquipment] = useState<string[]>(['Anti-Smog Water Cannon']);
  const [challanNumber, setChallanNumber] = useState('CH-2026-9041');
  const [challanAmount, setChallanAmount] = useState('10000');
  const [violatorEntity, setViolatorEntity] = useState('Commercial Property Occupier');

  // Officer specific state
  const [slaTargetMinutes, setSlaTargetMinutes] = useState(45);
  const [statutoryNoticeRef, setStatutoryNoticeRef] = useState('MCD/ENF/2026/0491');
  const [selectedRadioSquad, setSelectedRadioSquad] = useState('Unit 4A: Mobile Anti-Smog Cannon (South Zone)');

  // PCB Lead specific state
  const [consentToOperateId, setConsentToOperateId] = useState('CTO-DPCC-IND-2026-8812');
  const [regulatoryActSection, setRegulatoryActSection] = useState('Air Act 1981 - Section 21 / 31A');
  const [regulatoryOrderType, setRegulatoryOrderType] = useState<'notice' | 'fine' | 'disconnection' | 'closure'>('notice');
  const [digitalSignOffHash, setDigitalSignOffHash] = useState<string | null>(null);

  // Citizen specific state
  const [citizenCorroborated, setCitizenCorroborated] = useState(false);
  const [citizenSubscribedAlerts, setCitizenSubscribedAlerts] = useState(false);

  const DEPARTMENTS = [
    'Unit 4A: Mobile Anti-Smog Cannon (South Zone)',
    'Unit 2B: Solid Waste Vigilance Squad (Mandi House)',
    'Unit 1C: Construction Dust Enforcement Wing',
    'Unit 5D: Rapid Fire & Smoke Suppression Squad',
    'Zonal Air Quality Compliance Unit',
  ];

  const cityReports = reports.filter((r) => r.cityId === city.id);
  const activeReport = selectedReport || (cityReports.length > 0 ? cityReports[0] : null);

  const filteredQueue = cityReports.filter((r) => {
    if (tabFilter === 'pending') return r.verificationStatus === 'Submitted' || r.verificationStatus === 'Under Review';
    if (tabFilter === 'priority') return (r.priority === 'High' || r.priority === 'Critical') && r.responseStatus !== 'Resolved';
    if (tabFilter === 'assigned') return r.verificationStatus === 'Assigned' || r.verificationStatus === 'In Progress';
    if (tabFilter === 'resolved') return r.verificationStatus === 'Resolved';
    return true;
  });

  const handleGenerateBriefing = async () => {
    if (!activeReport) return;
    setIsBriefingLoading(true);
    try {
      const res = await api.generateBriefing(activeReport.id, activeReport);
      setBriefingText(res.briefing);
    } catch (err: any) {
      console.warn('Briefing error:', err);
      setBriefingText('Briefing could not be loaded: ' + err.message);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: VerificationStatus) => {
    if (!activeReport) return;
    setUpdatingStatus(true);
    try {
      const updated = await api.updateReport(activeReport.id, {
        verificationStatus: newStatus,
        responseStatus: newStatus,
        operatorName: 
          userRole === 'inspector' ? 'Inspector K. Sengupta (Field Squad 4)' :
          userRole === 'pcb_lead' ? 'Dr. R. Sharma (State PCB Analyst)' :
          'Ward Officer (Municipal Dispatch)',
      });
      onUpdateReport(updated);
      onSelectReport(updated);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (newPriority: PriorityLevel) => {
    if (!activeReport) return;
    try {
      const updated = await api.updateReport(activeReport.id, {
        priority: newPriority,
        operatorName: 'Chief Dispatcher',
      });
      onUpdateReport(updated);
      onSelectReport(updated);
    } catch (err: any) {
      alert('Failed to update priority: ' + err.message);
    }
  };

  const handleAssignDepartment = async (dept: string) => {
    if (!activeReport) return;
    try {
      const updated = await api.updateReport(activeReport.id, {
        assignedDepartment: dept,
        verificationStatus: 'Assigned',
        responseStatus: 'Assigned',
        operatorName: 'Operations Lead',
      });
      onUpdateReport(updated);
      onSelectReport(updated);
    } catch (err: any) {
      alert('Failed to assign department: ' + err.message);
    }
  };

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReport || !internalNoteInput.trim()) return;

    try {
      const authorRoleLabel = 
        userRole === 'inspector' ? 'Field Squad 4 Inspector' :
        userRole === 'pcb_lead' ? 'State PCB Regulatory Lead' :
        'Ward Municipal Officer';

      const newNote = {
        id: `note-${Date.now()}`,
        author: authorRoleLabel,
        text: internalNoteInput.trim(),
        timestamp: new Date().toISOString(),
      };
      const updatedNotes = [...(activeReport.internalNotes || []), newNote];
      const updated = await api.updateReport(activeReport.id, {
        internalNotes: updatedNotes,
      });
      onUpdateReport(updated);
      onSelectReport(updated);
      setInternalNoteInput('');
    } catch (err: any) {
      alert('Failed to add note: ' + err.message);
    }
  };

  const handleResolveIncident = async () => {
    if (!activeReport) return;
    const defaultResolution = 
      userRole === 'inspector'
        ? `Anti-smog cannon deployed; fine of ₹${challanAmount} issued under Challan #${challanNumber}. Ground verified clean.`
        : userRole === 'pcb_lead'
        ? `Statutory enforcement order executed under ${regulatoryActSection}. Consent ID ${consentToOperateId} audited.`
        : 'Remediation completed and verified on ground by municipal squad.';

    const note = resolutionInput.trim() || defaultResolution;
    try {
      const updated = await api.updateReport(activeReport.id, {
        verificationStatus: 'Resolved',
        responseStatus: 'Resolved',
        resolutionNotes: note,
        operatorName: userRole === 'inspector' ? 'Squad Lead (Field Squad 4)' : 'Ward Health Officer',
      });
      onUpdateReport(updated);
      onSelectReport(updated);
      setResolutionInput('');
    } catch (err: any) {
      alert('Failed to resolve incident: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Report ID', 'Category', 'Status', 'Priority', 'Location', 'Latitude', 'Longitude', 'Submitted At', 'Assigned Dept'];
    const rows = cityReports.map((r) => [
      r.id,
      r.category,
      r.verificationStatus,
      r.priority,
      `"${r.locationLabel.replace(/"/g, '""')}"`,
      r.latitude,
      r.longitude,
      r.submittedAt,
      `"${(r.assignedDepartment || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `airlens_${userRole}_audit_${city.id}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Dynamic Persona Authorization Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg ${
        userRole === 'citizen'
          ? 'bg-[#0E241E] border-[#5CF2B2]/30 text-[#A6C7B5]'
          : userRole === 'inspector'
          ? 'bg-[#2A200B]/80 border-[#F6B94B]/40 text-[#F6B94B]'
          : userRole === 'pcb_lead'
          ? 'bg-[#121A2A]/80 border-[#60A5FA]/40 text-[#93C5FD]'
          : 'bg-[#0C1513] border-[#5CF2B2]/30 text-[#5CF2B2]'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#071713] border border-current/25 shrink-0">
            {userRole === 'citizen' && <Eye className="w-4 h-4 text-[#5CF2B2]" />}
            {userRole === 'inspector' && <Truck className="w-4 h-4 text-[#F6B94B]" />}
            {userRole === 'officer' && <ShieldAlert className="w-4 h-4 text-[#5CF2B2]" />}
            {userRole === 'pcb_lead' && <Scale className="w-4 h-4 text-[#60A5FA]" />}
          </div>
          <div>
            <div className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <span>
                {userRole === 'citizen' && 'Citizen Transparency & Public Verification View'}
                {userRole === 'inspector' && 'Field Rapid Squad Console · Ground Inspection & Containment'}
                {userRole === 'officer' && 'Ward Municipal Triage Center · Squad Dispatch & Statutory Directives'}
                {userRole === 'pcb_lead' && 'State Pollution Control Board · Regulatory Compliance & Stack Audits'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071713] border border-current/30 uppercase tracking-wider">
                Persona: {userRole.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {userRole === 'citizen' && 'Public read-only oversight. Real-time municipal triage tracking and community corroboration.'}
              {userRole === 'inspector' && 'Equipped with ground verification checklists, on-site anti-smog equipment dispatch, and penalty challan logging.'}
              {userRole === 'officer' && 'Authorized to dispatch municipal enforcement squads, enforce SLA targets, and generate GPT-4o executive briefs.'}
              {userRole === 'pcb_lead' && 'Statutory authority under Air Act 1981. Audit Consent to Operate IDs, continuous sensors, and issue closure orders.'}
            </p>
          </div>
        </div>

        {/* Quick Role Switcher */}
        {onChangeUserRole && (
          <div className="flex items-center gap-1.5 shrink-0 bg-[#071713] p-1 rounded-xl border border-current/20 text-xs font-mono">
            <span className="text-[10px] text-[#8A9A92] px-2 hidden xl:inline">Switch Persona:</span>
            {[
              { id: 'citizen', label: 'Citizen' },
              { id: 'inspector', label: 'Inspector' },
              { id: 'officer', label: 'Ward Lead' },
              { id: 'pcb_lead', label: 'State PCB' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => onChangeUserRole(p.id as UserRole)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  userRole === p.id
                    ? 'bg-[#123C30] text-[#5CF2B2] font-bold border border-[#5CF2B2]/30'
                    : 'text-[#8A9A92] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Triage Incident Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-3 shadow-xl">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#5CF2B2] font-bold">
                {userRole === 'citizen' ? 'Public Incident Stream' : 'Operational Triage Queue'} ({tabFilter === 'duplicates' ? duplicateGroups.length : filteredQueue.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExecutiveReportOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#5CF2B2] to-[#48e3a2] text-[#071713] font-heading font-bold text-[11px] hover:brightness-105 transition-all flex items-center gap-1 shadow-md shadow-[#5CF2B2]/20 cursor-pointer"
                  title="Generate Municipal AI Dossier"
                >
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>AI Dossier</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="text-[11px] font-mono text-[#8A9A92] hover:text-[#5CF2B2] flex items-center gap-1 px-2 py-1 rounded-lg border border-[#5CF2B2]/20 hover:border-[#5CF2B2]/40 transition-colors"
                  title="Download CSV"
                >
                  <Download className="w-3 h-3" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-[#071713] p-1 rounded-xl border border-[#5CF2B2]/15 text-xs font-mono overflow-x-auto">
              {[
                { id: 'pending', label: 'Pending' },
                { id: 'priority', label: 'Priority' },
                { id: 'assigned', label: 'Assigned' },
                { id: 'resolved', label: 'Resolved' },
                { id: 'duplicates', label: `Duplicates (${duplicateGroups.length})` },
                { id: 'all', label: 'All' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTabFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    tabFilter === tab.id ? 'bg-[#123C30] text-[#5CF2B2] font-bold' : 'text-[#8A9A92] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Incident List OR Duplicate Groups */}
            <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
              {tabFilter === 'duplicates' ? (
                duplicateGroups.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#8A9A92] font-mono">
                    <CheckCircle2 className="w-8 h-8 text-[#5CF2B2] mx-auto mb-2 opacity-60" />
                    No duplicate clusters detected in active observation window.
                  </div>
                ) : (
                  duplicateGroups.map((group) => (
                    <div
                      key={group.id}
                      className="p-4 rounded-2xl bg-[#071713] border border-[#5CF2B2]/30 space-y-3 shadow-lg"
                    >
                      {/* Anomaly Surge Banner if present */}
                      {group.anomalyFlag && (
                        <div className="p-2 rounded-xl bg-[#FF6B65]/15 border border-[#FF6B65]/30 text-[11px] font-mono text-[#FF6B65] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{group.anomalyFlag}</span>
                        </div>
                      )}

                      {/* Primary Report Card */}
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#5CF2B2]/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#5CF2B2]/20 text-[#5CF2B2]">
                              PRIMARY
                            </span>
                            <span className="font-mono text-xs font-bold text-[#F4F8F5]">{group.primaryReport.id}</span>
                          </div>
                          <p className="text-xs text-[#F4F8F5] font-semibold mt-1">
                            {group.primaryReport.locationLabel}
                          </p>
                          <p className="text-[11px] text-[#8A9A92] line-clamp-1">
                            {group.primaryReport.description}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#123C30] text-[#5CF2B2] uppercase">
                          {group.primaryReport.category.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Candidates List */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-[#8A9A92] uppercase block">
                          Potential Duplicate Candidates:
                        </span>
                        {group.candidates.map((cand) => (
                          <div 
                            key={cand.report.id}
                            className="p-3 rounded-xl bg-[#0C1513] border border-[#5CF2B2]/15 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-[#F4F8F5]">{cand.report.id}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F6B94B]/20 text-[#F6B94B]">
                                {Math.round(cand.similarityScore * 100)}% SIMILARITY
                              </span>
                            </div>
                            <p className="text-[11px] text-[#A6C7B5]">
                              {cand.distanceMeters}m apart · {cand.timeDeltaHours} hrs difference
                            </p>
                            <div className="flex flex-wrap gap-1 text-[10px] font-mono text-[#8A9A92]">
                              {cand.matchReasons.map((reason, rIdx) => (
                                <span key={rIdx} className="bg-[#123C30]/50 px-1.5 py-0.5 rounded">
                                  ✓ {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Human in the loop Merge Action */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#8A9A92]">
                          Requires human reviewer confirmation
                        </span>
                        <button
                          onClick={() => handleMergeDuplicate(group.primaryReport.id, group.candidates.map(c => c.report.id))}
                          disabled={mergingId === group.primaryReport.id}
                          className="px-3 py-1.5 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{mergingId === group.primaryReport.id ? 'Merging...' : 'Merge & Consolidate'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : filteredQueue.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#8A9A92] font-mono">
                  No incidents in current filter queue.
                </div>
              ) : (
                filteredQueue.map((rep) => {
                  const isSelected = activeReport?.id === rep.id;
                  return (
                    <div
                      key={rep.id}
                      onClick={() => onSelectReport(rep)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#123C30]/80 border-[#5CF2B2] shadow-lg shadow-[#071713]'
                          : 'bg-[#071713]/80 border-[#5CF2B2]/12 hover:border-[#5CF2B2]/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={rep.imageUrl}
                          alt={rep.id}
                          className="w-14 h-14 rounded-xl object-cover border border-[#5CF2B2]/20 bg-[#0C1513] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-mono text-xs font-bold text-[#5CF2B2]">{rep.id}</span>
                            <StatusBadge status={rep.verificationStatus} />
                          </div>
                          <h4 className="text-xs font-bold text-white truncate mb-0.5">
                            {rep.locationLabel}
                          </h4>
                          <p className="text-[11px] text-[#8A9A92] line-clamp-1 mb-1.5">
                            {rep.description}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A9A92]">
                            <CategoryBadge category={rep.category} size="sm" />
                            <span>·</span>
                            <PriorityBadge priority={rep.priority} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Role-Specific Action & Inspection Console (7 cols) */}
        {activeReport ? (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-5 shadow-xl">
              
              {/* Incident Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#5CF2B2]/12">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-sm font-bold text-[#5CF2B2]">{activeReport.id}</span>
                    <CategoryBadge category={activeReport.category} size="sm" />
                    <StatusBadge status={activeReport.verificationStatus} />
                    <PriorityBadge priority={activeReport.priority} />
                  </div>
                  <h2 className="text-base font-heading font-extrabold text-white">
                    {activeReport.locationLabel}
                  </h2>
                  <div className="text-[11px] font-mono text-[#8A9A92]">
                    <span className="tabular-nums">Logged: {new Date(activeReport.submittedAt).toLocaleString()}</span>
                    <span className="mx-1.5">·</span>
                    <span className="tabular-nums">GPS: {activeReport.latitude.toFixed(4)}, {activeReport.longitude.toFixed(4)}</span>
                  </div>
                </div>

                {/* Priority buttons (enabled for Officer & Inspector, read-only for Citizen) */}
                {userRole !== 'citizen' ? (
                  <div className="flex items-center gap-1.5 bg-[#071713] p-1 rounded-xl border border-[#5CF2B2]/15">
                    <span className="text-[10px] font-mono text-[#8A9A92] px-2">Priority:</span>
                    {(['Low', 'Medium', 'High', 'Critical'] as PriorityLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => handlePriorityChange(lvl)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                          activeReport.priority === lvl ? 'bg-[#123C30] text-[#5CF2B2] font-bold' : 'text-[#8A9A92] hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-mono text-[#8A9A92]">
                    Priority: <strong className="text-white">{activeReport.priority}</strong>
                  </div>
                )}
              </div>

              {/* Photographic Evidence Canvas & Description */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <img
                    src={activeReport.imageUrl}
                    alt="Inspection Evidence"
                    className="w-full h-44 rounded-2xl object-cover border border-[#5CF2B2]/25 bg-[#071713] shadow-md"
                  />
                  <div className="text-[10px] font-mono text-[#8A9A92] mt-1.5 text-center">
                    Original Citizen Upload · Verified Optical Proof
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3 text-xs">
                  <div>
                    <span className="font-mono text-[#8A9A92] uppercase text-[10px] block mb-1">
                      Eyewitness Statement:
                    </span>
                    <p className="text-white bg-[#071713] p-3 rounded-xl border border-[#5CF2B2]/15 leading-relaxed">
                      {activeReport.description}
                    </p>
                  </div>

                  {activeReport.aiAnalysis && (
                    <div className="p-3 rounded-xl bg-[#071713] border border-[#5CF2B2]/15 space-y-1">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-[#5CF2B2] font-bold flex items-center gap-1">
                          <Eye className="w-3 h-3" /> GPT-4o AI Vision Assessment
                        </span>
                        <span className="text-[#A6C7B5] tabular-nums">
                          {Math.round(activeReport.aiAnalysis.confidence * 100)}% match
                        </span>
                      </div>
                      <p className="text-[#F4F8F5] italic text-[11px]">
                        "{activeReport.aiAnalysis.executive_summary}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* PERSONA 1: CITIZEN VIEW (Transparency & Corroboration) */}
              {/* ---------------------------------------------------- */}
              {userRole === 'citizen' && (
                <div className="p-4 rounded-2xl bg-[#071713] border border-[#5CF2B2]/20 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#5CF2B2]/10">
                    <span className="text-xs font-heading font-bold text-[#5CF2B2] flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-[#5CF2B2]" />
                      <span>Citizen Public Tracking Portal</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#A6C7B5]">
                      Assigned: {activeReport.assignedDepartment || 'Under Municipal Review'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-1">
                      <div className="font-semibold text-white">Community Corroboration</div>
                      <p className="text-[11px] text-[#8A9A92]">
                        Did you also witness this smoke or dust emission in this sector?
                      </p>
                      <button
                        onClick={() => setCitizenCorroborated(true)}
                        disabled={citizenCorroborated}
                        className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                          citizenCorroborated
                            ? 'bg-[#123C30] text-[#5CF2B2] font-bold'
                            : 'bg-[#071713] hover:bg-[#123C30] text-white border border-[#5CF2B2]/20'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{citizenCorroborated ? 'Witness Corroborated (+1 Logged)' : 'I Also Saw This (+1)'}</span>
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0C1513] border border-[#5CF2B2]/15 space-y-1">
                      <div className="font-semibold text-white">Resolution SMS / WhatsApp Alerts</div>
                      <p className="text-[11px] text-[#8A9A92]">
                        Receive a notification when the municipal mist cannon extinguishes this plume.
                      </p>
                      <button
                        onClick={() => setCitizenSubscribedAlerts(!citizenSubscribedAlerts)}
                        className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                          citizenSubscribedAlerts
                            ? 'bg-[#123C30] text-[#5CF2B2] font-bold'
                            : 'bg-[#071713] hover:bg-[#123C30] text-white border border-[#5CF2B2]/20'
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>{citizenSubscribedAlerts ? 'Subscribed to Remediation Alerts' : 'Notify Me Upon Closure'}</span>
                      </button>
                    </div>
                  </div>

                  {activeReport.resolutionNotes && (
                    <div className="p-3.5 rounded-xl bg-[#123C30]/50 border border-[#5CF2B2]/30 text-xs space-y-1">
                      <div className="font-bold text-[#5CF2B2] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Official Remediation Report:
                      </div>
                      <p className="text-white">{activeReport.resolutionNotes}</p>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-[#0C1513] border border-[#5CF2B2]/10 text-[11px] text-[#8A9A92] flex items-center justify-between">
                    <span>Municipal enforcement & squad radio dispatch controls require municipal credentials.</span>
                    {onChangeUserRole && (
                      <button
                        onClick={() => onChangeUserRole('officer')}
                        className="text-[#5CF2B2] font-bold hover:underline shrink-0 ml-2"
                      >
                        Switch to Ward Officer View →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* PERSONA 2: INSPECTOR VIEW (Ground Checklists & Fines) */}
              {/* ---------------------------------------------------- */}
              {userRole === 'inspector' && (
                <div className="p-5 rounded-2xl bg-[#071713] border border-[#F6B94B]/30 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F6B94B]/15">
                    <span className="text-xs font-heading font-bold text-[#F6B94B] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#F6B94B]" />
                      <span>Field Rapid Squad Inspection Controls (Squad 4)</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#8A9A92]">
                      GPS Range: ~1.2 km from unit patrol
                    </span>
                  </div>

                  {/* Ground Verification Checklist */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider block">
                      Ground Arrival Checklist:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <label className="p-2.5 rounded-xl bg-[#0C1513] border border-[#F6B94B]/20 flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="checkbox"
                          checked={inspectorChecklist.activeOnArrival}
                          onChange={(e) => setInspectorChecklist({ ...inspectorChecklist, activeOnArrival: e.target.checked })}
                          className="rounded text-[#F6B94B] focus:ring-0"
                        />
                        <span>Plume Active on Arrival</span>
                      </label>
                      <label className="p-2.5 rounded-xl bg-[#0C1513] border border-[#F6B94B]/20 flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="checkbox"
                          checked={inspectorChecklist.sourceIdentified}
                          onChange={(e) => setInspectorChecklist({ ...inspectorChecklist, sourceIdentified: e.target.checked })}
                          className="rounded text-[#F6B94B] focus:ring-0"
                        />
                        <span>Source Identified</span>
                      </label>
                      <label className="p-2.5 rounded-xl bg-[#0C1513] border border-[#F6B94B]/20 flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="checkbox"
                          checked={inspectorChecklist.containmentApplied}
                          onChange={(e) => setInspectorChecklist({ ...inspectorChecklist, containmentApplied: e.target.checked })}
                          className="rounded text-[#F6B94B] focus:ring-0"
                        />
                        <span>Misting / Foam Deployed</span>
                      </label>
                    </div>
                  </div>

                  {/* Equipment Deployed & Penalty Challan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-[#8A9A92] uppercase block">
                        Equipment Deployed on Ground:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                        {[
                          'Anti-Smog Water Cannon',
                          'Mist Sprinkler Tanker',
                          'Mechanical Sweeper',
                          'Tarpaulin Sheeting Mandate',
                        ].map((eq) => {
                          const active = deployedEquipment.includes(eq);
                          return (
                            <button
                              key={eq}
                              type="button"
                              onClick={() => {
                                setDeployedEquipment(
                                  active ? deployedEquipment.filter((x) => x !== eq) : [...deployedEquipment, eq]
                                );
                              }}
                              className={`p-2 rounded-xl text-left border transition-all ${
                                active
                                  ? 'bg-[#2A200B] text-[#F6B94B] border-[#F6B94B]/50 font-bold'
                                  : 'bg-[#0C1513] text-[#8A9A92] border-[#F6B94B]/15 hover:text-white'
                              }`}
                            >
                              {eq}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 bg-[#0C1513] p-3 rounded-xl border border-[#F6B94B]/20">
                      <label className="font-mono text-[10px] text-[#8A9A92] uppercase block">
                        On-Site Penalty Challan (Municipal By-Laws):
                      </label>
                      <div className="grid grid-cols-2 gap-2 font-mono">
                        <div>
                          <span className="text-[10px] text-[#8A9A92] block">Challan Receipt #</span>
                          <input
                            type="text"
                            value={challanNumber}
                            onChange={(e) => setChallanNumber(e.target.value)}
                            className="w-full bg-[#071713] border border-[#F6B94B]/30 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8A9A92] block">Fine Amount (₹)</span>
                          <input
                            type="number"
                            value={challanAmount}
                            onChange={(e) => setChallanAmount(e.target.value)}
                            className="w-full bg-[#071713] border border-[#F6B94B]/30 rounded-lg px-2 py-1 text-xs text-white font-bold"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8A9A92] block">Violator Entity / Property Owner</span>
                        <input
                          type="text"
                          value={violatorEntity}
                          onChange={(e) => setViolatorEntity(e.target.value)}
                          className="w-full bg-[#071713] border border-[#F6B94B]/30 rounded-lg px-2 py-1 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fast Action Buttons for Field Inspector */}
                  <div className="pt-2 border-t border-[#F6B94B]/15 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange('In Progress')}
                        className="px-3 py-1.5 rounded-xl bg-[#0C1513] hover:bg-[#123C30] border border-[#F6B94B]/30 text-[#F6B94B] text-xs font-mono font-bold transition-colors"
                      >
                        Set Status: In Progress
                      </button>
                    </div>

                    <button
                      onClick={handleResolveIncident}
                      className="px-5 py-2.5 rounded-xl bg-[#F6B94B] hover:bg-[#FCD34D] text-[#071713] font-heading font-extrabold text-xs shadow-lg shadow-[#F6B94B]/20 flex items-center gap-1.5 transition-all hover:scale-102"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Ground Remediation & Fine Log</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* PERSONA 3: WARD OFFICER (Dispatch, SLA, & Directives) */}
              {/* ---------------------------------------------------- */}
              {userRole === 'officer' && (
                <div className="p-5 rounded-2xl bg-[#071713] border border-[#5CF2B2]/20 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#5CF2B2]/10">
                    <span className="text-xs font-heading font-bold text-[#5CF2B2] flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-[#5CF2B2]" />
                      <span>Municipal Ward Triage & Dispatch (Ward 42 Command)</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#F6B94B]">
                      Response SLA Target: &lt; {slaTargetMinutes} Minutes
                    </span>
                  </div>

                  {/* Squad Dispatch Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#8A9A92] uppercase tracking-wider block">
                      Assign Rapid Suppression Squad & Radio Channel:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {DEPARTMENTS.map((dept) => {
                        const isSelected = activeReport.assignedDepartment === dept || selectedRadioSquad === dept;
                        return (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => {
                              setSelectedRadioSquad(dept);
                              handleAssignDepartment(dept);
                            }}
                            className={`p-2.5 rounded-xl text-left border transition-all ${
                              isSelected
                                ? 'bg-[#123C30] text-[#5CF2B2] border-[#5CF2B2] font-semibold'
                                : 'bg-[#0C1513] text-[#8A9A92] border-[#5CF2B2]/15 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{dept}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#5CF2B2] shrink-0" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Statutory Ward Directives */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#0C1513] rounded-xl border border-[#5CF2B2]/15 space-y-1">
                      <span className="text-[10px] font-mono text-[#8A9A92] uppercase block">
                        Statutory Ward Notice (Solid Waste Rules 2016):
                      </span>
                      <input
                        type="text"
                        value={statutoryNoticeRef}
                        onChange={(e) => setStatutoryNoticeRef(e.target.value)}
                        placeholder="Notice Ref Number"
                        className="w-full bg-[#071713] border border-[#5CF2B2]/20 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                      />
                      <span className="text-[10px] text-[#8A9A92] block">Statutory notice dispatched to property record.</span>
                    </div>

                    <div className="p-3 bg-[#0C1513] rounded-xl border border-[#5CF2B2]/15 space-y-1">
                      <span className="text-[10px] font-mono text-[#8A9A92] uppercase block">
                        SLA Escalation Timer:
                      </span>
                      <div className="flex items-center gap-2">
                        {[30, 45, 60, 120].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setSlaTargetMinutes(mins)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                              slaTargetMinutes === mins
                                ? 'bg-[#123C30] text-[#5CF2B2] font-bold border border-[#5CF2B2]/40'
                                : 'bg-[#071713] text-[#8A9A92] border border-[#5CF2B2]/10'
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-[#A6C7B5] block">Automatic escalation to Zonal Commissioner if overdue.</span>
                    </div>
                  </div>

                  {/* Gemini Executive Briefing */}
                  <div className="p-3.5 rounded-xl bg-[#0C1513] border border-[#5CF2B2]/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#5CF2B2]">
                        <Sparkles className="w-4 h-4 text-[#5CF2B2]" />
                        <span>GPT-4o Automated Ward Executive Briefing</span>
                      </div>
                      <button
                        onClick={handleGenerateBriefing}
                        disabled={isBriefingLoading}
                        className="px-3 py-1.5 rounded-xl bg-[#123C30] hover:bg-[#1A4C3D] text-[#5CF2B2] text-xs font-mono font-bold border border-[#5CF2B2]/30 flex items-center gap-1.5 transition-colors"
                      >
                        {isBriefingLoading ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Synthesizing...</span>
                          </>
                        ) : (
                          <>
                            <span>Generate Executive Memo</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>

                    {briefingText ? (
                      <div className="text-xs text-white leading-relaxed whitespace-pre-line p-3 rounded-xl bg-[#071713] border border-[#5CF2B2]/15 animate-in fade-in">
                        {briefingText}
                      </div>
                    ) : (
                      <p className="text-xs text-[#8A9A92]">
                        Click above to synthesize an official executive summary with downwind exposure analysis for the Ward Councilor.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* PERSONA 4: STATE PCB LEAD (Regulatory Laws & CEMS) */}
              {/* ---------------------------------------------------- */}
              {userRole === 'pcb_lead' && (
                <div className="p-5 rounded-2xl bg-[#071713] border border-[#60A5FA]/30 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#60A5FA]/15">
                    <span className="text-xs font-heading font-bold text-[#93C5FD] flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-[#60A5FA]" />
                      <span>State Pollution Control Board Regulatory Compliance</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#8A9A92]">
                      Statute: Air Act 1981 / NGT GRAP IV
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#0C1513] rounded-xl border border-[#60A5FA]/20 space-y-1">
                      <span className="text-[10px] font-mono text-[#8A9A92] uppercase block">
                        Facility Consent to Operate (CTO) ID:
                      </span>
                      <input
                        type="text"
                        value={consentToOperateId}
                        onChange={(e) => setConsentToOperateId(e.target.value)}
                        className="w-full bg-[#071713] border border-[#60A5FA]/30 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                      />
                      <span className="text-[10px] text-[#93C5FD] font-mono">Classification: RED CATEGORY INDUSTRIAL STACK</span>
                    </div>

                    <div className="p-3 bg-[#0C1513] rounded-xl border border-[#60A5FA]/20 space-y-1">
                      <span className="text-[10px] font-mono text-[#8A9A92] uppercase block">
                        Statutory Enforcement Act:
                      </span>
                      <input
                        type="text"
                        value={regulatoryActSection}
                        onChange={(e) => setRegulatoryActSection(e.target.value)}
                        className="w-full bg-[#071713] border border-[#60A5FA]/30 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                      />
                      <span className="text-[10px] text-[#F6B94B] font-mono">Powers under Section 31A (Closure Directions)</span>
                    </div>
                  </div>

                  {/* Regulatory Order Selector */}
                  <div className="space-y-1.5 text-xs">
                    <label className="text-[10px] font-mono text-[#8A9A92] uppercase tracking-wider block">
                      Issue Board Regulatory Order:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                      {[
                        { id: 'notice', label: 'Show-Cause Notice' },
                        { id: 'fine', label: 'Env. Compensation' },
                        { id: 'disconnection', label: 'Power Cut Order' },
                        { id: 'closure', label: 'Section 31A Closure' },
                      ].map((ord) => (
                        <button
                          key={ord.id}
                          type="button"
                          onClick={() => setRegulatoryOrderType(ord.id as any)}
                          className={`p-2 rounded-xl text-center border transition-all ${
                            regulatoryOrderType === ord.id
                              ? 'bg-[#1E293B] text-[#93C5FD] border-[#60A5FA] font-bold'
                              : 'bg-[#0C1513] text-[#8A9A92] border-[#60A5FA]/15 hover:text-white'
                          }`}
                        >
                          {ord.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Digital Sign-off Hash */}
                  <div className="p-3 bg-[#0C1513] rounded-xl border border-[#60A5FA]/20 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">Cryptographic Regulatory Sign-Off</div>
                      <div className="text-[10px] text-[#8A9A92] font-mono">
                        {digitalSignOffHash ? `SHA-256 Seal: ${digitalSignOffHash}` : 'Unsigned statutory draft'}
                      </div>
                    </div>

                    <button
                      onClick={() => setDigitalSignOffHash(`SEAL-${Date.now().toString(16).toUpperCase()}-SPCB`)}
                      className="px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-[#93C5FD] font-mono text-xs font-bold border border-[#60A5FA]/30 transition-colors"
                    >
                      {digitalSignOffHash ? 'Seal Verified' : 'Affix Digital Seal'}
                    </button>
                  </div>
                </div>
              )}

              {/* Status Advancement Controls (Common for Officer, Inspector, PCB Lead) */}
              {userRole !== 'citizen' && (
                <div className="space-y-2 pt-2 border-t border-[#5CF2B2]/10">
                  <span className="text-xs font-mono text-[#8A9A92] uppercase tracking-wider block">
                    Advance Official Case Status:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(['Under Review', 'Verified', 'Assigned', 'In Progress', 'Resolved'] as VerificationStatus[]).map((st) => (
                      <button
                        key={st}
                        disabled={updatingStatus}
                        onClick={() => handleStatusChange(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                          activeReport.verificationStatus === st
                            ? 'bg-[#5CF2B2] text-[#071713] font-bold shadow-md shadow-[#5CF2B2]/20'
                            : 'bg-[#071713] text-[#8A9A92] hover:text-white border border-[#5CF2B2]/15'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Field Notes Log (Inspector, Officer, PCB Lead) */}
              {userRole !== 'citizen' && (
                <div className="space-y-3 pt-2 border-t border-[#5CF2B2]/10">
                  <span className="text-xs font-mono text-[#8A9A92] uppercase tracking-wider block">
                    Internal Case Logs & Audit Trail:
                  </span>

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {!activeReport.internalNotes || activeReport.internalNotes.length === 0 ? (
                      <div className="text-xs text-[#8A9A92] font-mono italic">No internal instructions logged yet.</div>
                    ) : (
                      activeReport.internalNotes.map((note) => (
                        <div key={note.id} className="p-2.5 rounded-xl bg-[#071713] border border-[#5CF2B2]/10 text-xs">
                          <div className="flex justify-between text-[10px] font-mono text-[#8A9A92] mb-1">
                            <span className="text-[#5CF2B2] font-bold">{note.author}</span>
                            <span className="tabular-nums">{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-white">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddInternalNote} className="flex gap-2">
                    <input
                      type="text"
                      value={internalNoteInput}
                      onChange={(e) => setInternalNoteInput(e.target.value)}
                      placeholder={`Log official note as ${userRole === 'inspector' ? 'Squad Inspector' : userRole === 'pcb_lead' ? 'State PCB Lead' : 'Ward Officer'}...`}
                      className="flex-1 bg-[#071713] border border-[#5CF2B2]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5CF2B2]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[#123C30] hover:bg-[#1A4C3D] text-[#5CF2B2] text-xs font-mono font-bold transition-colors"
                    >
                      Log
                    </button>
                  </form>
                </div>
              )}

              {/* Case Remediation Sign-Off */}
              {userRole !== 'citizen' && (
                activeReport.verificationStatus !== 'Resolved' ? (
                  <div className="p-4 rounded-2xl bg-[#123C30]/40 border border-[#5CF2B2]/30 space-y-2.5">
                    <span className="text-xs font-heading font-bold text-[#5CF2B2] block">
                      Verify Remediation & Close Case
                    </span>
                    <input
                      type="text"
                      value={resolutionInput}
                      onChange={(e) => setResolutionInput(e.target.value)}
                      placeholder="e.g. Anti-smog gun operated; burning extinguished and challan issued."
                      className="w-full bg-[#071713] border border-[#5CF2B2]/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5CF2B2]"
                    />
                    <button
                      onClick={handleResolveIncident}
                      className="w-full py-2.5 rounded-xl bg-[#5CF2B2] hover:bg-[#A6C7B5] text-[#071713] font-heading font-bold text-xs shadow-lg shadow-[#5CF2B2]/20 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Official Resolution</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#123C30] border border-[#5CF2B2]/40 text-xs space-y-1">
                    <div className="font-heading font-bold text-[#5CF2B2] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Case Remediated & Closed
                    </div>
                    <p className="text-[#A6C7B5]">
                      Resolution note: {activeReport.resolutionNotes || 'Remediation completed by field squad.'}
                    </p>
                  </div>
                )
              )}

            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 p-12 text-center text-xs text-[#8A9A92] font-mono bg-[#0C1513] rounded-3xl border border-[#5CF2B2]/15">
            Select an incident from the queue to view details and execute persona actions.
          </div>
        )}

      </div>

      {/* AI Executive Report Modal */}
      <AIExecutiveReportModal
        isOpen={isExecutiveReportOpen}
        onClose={() => setIsExecutiveReportOpen(false)}
        city={city}
      />

    </div>
  );
}
