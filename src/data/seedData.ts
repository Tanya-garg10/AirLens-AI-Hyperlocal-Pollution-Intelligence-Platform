import { PollutionReport, InAppNotification } from '../types';

export const INITIAL_REPORTS: PollutionReport[] = [
  {
    id: 'AL-2026-9041',
    category: 'waste_burning',
    description: 'Continuous open burning of solid dry waste and cardboard packing crates behind wholesale warehouse. Acrid smell and low-hanging white-grey smoke drifting across residential apartments.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    latitude: 28.6280,
    longitude: 77.2180,
    locationLabel: 'Connaught Place Outer Ring / Mandi House Corridor',
    cityId: 'delhi-ncr',
    observedAt: '2026-09-29T07:15:00Z',
    submittedAt: '2026-09-29T07:22:00Z',
    verificationStatus: 'Verified',
    priority: 'High',
    responseStatus: 'In Progress',
    assignedDepartment: 'Municipal Corporation Waste Enforcement Wing',
    assignedOfficer: 'Officer R. Sharma (Ward 72)',
    dataSource: 'Citizen Submission',
    updatedAt: '2026-09-29T08:10:00Z',
    contactName: 'Aarav Patel',
    contactEmail: 'aarav.p@example.org',
    aiAnalysis: {
      observed_visual_indicators: [
        'Visible white-grey smoke plume originating from ground level',
        'Residual charred biomass / municipal refuse piles visible',
        'Low vertical dispersion indicating ground inversion boundary'
      ],
      possible_category: 'waste_burning',
      visible_smoke_or_dust: true,
      confidence: 0.92,
      image_limitations: 'Image captures surface plume only; cannot measure particulate size or exact volatile organic compounds.',
      recommended_follow_up: 'Dispatch rapid municipal fire-suppression team and issue compliance notice under municipal solid waste bylaws.',
      executive_summary: 'Ground-level biomass burning with visible smoke drift towards downwind residential structures.',
      estimated_spread_risk: 'Elevated',
      is_simulated: false
    },
    internalNotes: [
      {
        id: 'note-1',
        author: 'Dispatcher Verma',
        text: 'Report cross-verified with Anand Vihar sensor spike at 07:30. Assigned to Rapid Sanitation Squad.',
        timestamp: '2026-09-29T07:45:00Z'
      }
    ],
    auditTrail: [
      {
        fromStatus: 'Submitted',
        toStatus: 'Under Review',
        changedBy: 'AI Automated Triage',
        timestamp: '2026-09-29T07:23:00Z'
      },
      {
        fromStatus: 'Under Review',
        toStatus: 'Verified',
        changedBy: 'Inspector K. Sengupta',
        timestamp: '2026-09-29T07:40:00Z',
        note: 'Confirmed illegal municipal open burning.'
      },
      {
        fromStatus: 'Verified',
        toStatus: 'In Progress',
        changedBy: 'Officer R. Sharma',
        timestamp: '2026-09-29T08:10:00Z',
        note: 'Team en-route with water tender.'
      }
    ]
  },
  {
    id: 'AL-2026-9042',
    category: 'construction_activity',
    description: 'Massive unshielded excavation works at commercial foundation site without green acoustic/dust nets or operational mist cannons. Heavy fugitive dust blowing onto arterial roadway.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    latitude: 28.6390,
    longitude: 77.2290,
    locationLabel: 'Barakhamba Road Commercial Redevelopment',
    cityId: 'delhi-ncr',
    observedAt: '2026-09-29T08:30:00Z',
    submittedAt: '2026-09-29T08:45:00Z',
    verificationStatus: 'Assigned',
    priority: 'High',
    responseStatus: 'Assigned',
    assignedDepartment: 'Dust Pollution Control & Construction Monitoring Cell',
    assignedOfficer: 'Eng. P. Nair',
    dataSource: 'Citizen Submission',
    updatedAt: '2026-09-29T09:00:00Z',
    aiAnalysis: {
      observed_visual_indicators: [
        'Dense suspended dust cloud above unpaved earth mover',
        'Absence of anti-smog water sprinklers in active digging zone',
        'Visible soil carry-over onto public roadway'
      ],
      possible_category: 'construction_activity',
      visible_smoke_or_dust: true,
      confidence: 0.88,
      image_limitations: 'Sun glare on camera sensor; boundary fencing partially obscures lower excavation depth.',
      recommended_follow_up: 'Inspect site dust mitigation plan, require immediate deployment of anti-smog gun and perimeter sheeting.',
      executive_summary: 'Major fugitive dust emissions from commercial construction with zero visible misting suppression.',
      estimated_spread_risk: 'Elevated'
    },
    internalNotes: [
      {
        id: 'note-2',
        author: 'Supervisor Joshi',
        text: 'Third complaint for this contractor this month. Flagged for strict statutory inspection.',
        timestamp: '2026-09-29T09:05:00Z'
      }
    ]
  },
  {
    id: 'AL-2026-9043',
    category: 'industrial_emissions',
    description: 'Black continuous smoke billowing from chimney of metal casting facility. Dark plume visible from elevated metro station for over 45 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop&q=80',
    latitude: 28.6180,
    longitude: 77.1950,
    locationLabel: 'Kirti Nagar Industrial Fringe / Mayapuri Approach',
    cityId: 'delhi-ncr',
    observedAt: '2026-09-29T06:00:00Z',
    submittedAt: '2026-09-29T06:20:00Z',
    verificationStatus: 'Under Review',
    priority: 'Critical',
    responseStatus: 'Under Review',
    assignedDepartment: 'State Pollution Control Board Industrial Surveillance',
    dataSource: 'Citizen Submission',
    updatedAt: '2026-09-29T06:35:00Z',
    aiAnalysis: {
      observed_visual_indicators: [
        'High-density dark opacity smoke from industrial point source',
        'Persistent horizontal plume column exceeding 150m downwind',
        'Indicator of incomplete fuel combustion or lack of bag-filter maintenance'
      ],
      possible_category: 'industrial_emissions',
      visible_smoke_or_dust: true,
      confidence: 0.94,
      image_limitations: 'Optical distance estimate from observation point is approximately 400m; internal stack gases cannot be quantified without stack monitoring probe.',
      recommended_follow_up: 'Dispatch PCB surveillance officer for immediate stack opacity check and fuel inspection.',
      executive_summary: 'Continuous dark smoke plume indicative of unscrubbed industrial combustion.',
      estimated_spread_risk: 'Elevated'
    }
  },
  {
    id: 'AL-2026-9044',
    category: 'dust',
    description: 'Heavy resuspension of silt and dry road dust caused by unwashed tipper trucks leaving bypass corridor. Visibility on right lane reduced significantly.',
    imageUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&auto=format&fit=crop&q=80',
    latitude: 28.6010,
    longitude: 77.2340,
    locationLabel: 'Ring Road Lodhi / Pragati Maidan Underpass Ramp',
    cityId: 'delhi-ncr',
    observedAt: '2026-09-29T09:10:00Z',
    submittedAt: '2026-09-29T09:15:00Z',
    verificationStatus: 'Submitted',
    priority: 'Medium',
    responseStatus: 'Submitted',
    dataSource: 'Citizen Submission',
    updatedAt: '2026-09-29T09:15:00Z',
    aiAnalysis: {
      observed_visual_indicators: [
        'Dry vehicular wheel wake dust cloud',
        'Accumulated silt layer on road shoulder',
        'Horizontal road-level particulate spread'
      ],
      possible_category: 'dust',
      visible_smoke_or_dust: true,
      confidence: 0.81,
      image_limitations: 'Moving vehicle perspective; slight motion blur on wheel perimeter.',
      recommended_follow_up: 'Route mechanical road sweeping truck and water washing vehicle to stretch.',
      executive_summary: 'Road silt resuspension triggered by heavy commercial vehicle transit.',
      estimated_spread_risk: 'Moderate'
    }
  },
  {
    id: 'AL-2026-9045',
    category: 'smoke',
    description: 'Temporary diesel generator backup set at wedding lawn releasing heavy grey soot during testing before evening event.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    latitude: 28.6410,
    longitude: 77.2020,
    locationLabel: 'Karol Bagh Community Lawn Enclosure',
    cityId: 'delhi-ncr',
    observedAt: '2026-09-29T05:30:00Z',
    submittedAt: '2026-09-29T05:40:00Z',
    verificationStatus: 'Resolved',
    priority: 'Low',
    responseStatus: 'Resolved',
    assignedDepartment: 'Zonal Air Quality Compliance Unit',
    assignedOfficer: 'Officer S. Tyagi',
    dataSource: 'Field Inspector',
    updatedAt: '2026-09-29T08:00:00Z',
    resolutionNotes: 'Operator instructed to switch off malfunctioning generator and replace fuel injector. Generator certified re-tested without visible smoke.',
    auditTrail: [
      {
        fromStatus: 'Submitted',
        toStatus: 'Verified',
        changedBy: 'Zonal Dispatch',
        timestamp: '2026-09-29T06:00:00Z'
      },
      {
        fromStatus: 'Verified',
        toStatus: 'Resolved',
        changedBy: 'Officer S. Tyagi',
        timestamp: '2026-09-29T08:00:00Z',
        note: 'Mechanical repair verified.'
      }
    ]
  },
  // Bengaluru Sample Reports
  {
    id: 'AL-2026-8801',
    category: 'construction_activity',
    description: 'Outer Ring Road tech park flyover construction site. Open dumping of fine cement and sand bags with constant wind dispersion across traffic junction.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    latitude: 12.9352,
    longitude: 77.6245,
    locationLabel: 'Silk Board Junction / Bellandur Flyover Ramp',
    cityId: 'bengaluru',
    observedAt: '2026-09-29T08:00:00Z',
    submittedAt: '2026-09-29T08:20:00Z',
    verificationStatus: 'Verified',
    priority: 'High',
    responseStatus: 'In Progress',
    assignedDepartment: 'BBMP Dust Mitigation Taskforce',
    assignedOfficer: 'Eng. K. Gowda',
    dataSource: 'Citizen Submission',
    updatedAt: '2026-09-29T09:00:00Z'
  },
  {
    id: 'AL-2026-8802',
    category: 'waste_burning',
    description: 'Horticultural dry leaf and plastic bag burning along lake perimeter fence. Thick white smoke entering lakeside walking track.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    latitude: 12.9240,
    longitude: 77.6710,
    locationLabel: 'Bellandur Lake North Bund Walkway',
    cityId: 'bengaluru',
    observedAt: '2026-09-29T07:00:00Z',
    submittedAt: '2026-09-29T07:15:00Z',
    verificationStatus: 'Under Review',
    priority: 'Medium',
    responseStatus: 'Under Review',
    dataSource: 'Citizen Submission',
    updatedAt: '2026-09-29T07:30:00Z'
  },
  // Mumbai Sample Reports
  {
    id: 'AL-2026-7601',
    category: 'construction_activity',
    description: 'Coastal Road connector drilling with heavy pulverized rock dust. No water damping applied to excavation face.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    latitude: 19.0176,
    longitude: 72.8258,
    locationLabel: 'Worli Seaface / Coastal Freeway Interface',
    cityId: 'mumbai',
    observedAt: '2026-09-29T08:15:00Z',
    submittedAt: '2026-09-29T08:35:00Z',
    verificationStatus: 'Verified',
    priority: 'High',
    responseStatus: 'Assigned',
    assignedDepartment: 'BMC Environmental Vigilance Cell',
    dataSource: 'Citizen Submission',
    updatedAt: '2026-09-29T08:50:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Hotspot Cluster Detected',
    message: 'Potential high-density particulate cluster identified near Mandi House & Connaught Place (3 linked reports).',
    type: 'hotspot',
    read: false,
    createdAt: '2026-09-29T08:45:00Z'
  },
  {
    id: 'notif-2',
    title: 'Report Verified by Authority',
    message: 'Report AL-2026-9041 (Waste Burning) has been officially verified and dispatched to Rapid Sanitation Squad.',
    type: 'verification',
    read: false,
    createdAt: '2026-09-29T07:40:00Z',
    linkedReportId: 'AL-2026-9041'
  },
  {
    id: 'notif-3',
    title: 'Incident Resolved',
    message: 'Generator exhaust compliance issue at Karol Bagh (AL-2026-9045) marked resolved after mechanical re-test.',
    type: 'resolution',
    read: true,
    createdAt: '2026-09-29T08:00:00Z',
    linkedReportId: 'AL-2026-9045'
  }
];
