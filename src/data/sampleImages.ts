// Pre-curated sample pollution observation photos (SVG/data-URIs or optimized web images)
// for immediate 1-click testing in the Citizen Reporting form and AI Analysis Lab.

export interface SamplePollutionPhoto {
  id: string;
  title: string;
  category: string;
  description: string;
  locationHint: string;
  dataUrl: string;
}

export const SAMPLE_POLLUTION_PHOTOS: SamplePollutionPhoto[] = [
  {
    id: 'sample-smoke-1',
    title: 'Biomass & Garbage Fire Smoke',
    category: 'waste_burning',
    description: 'Dense gray-white particulate plume rising from illegal vacant-plot municipal waste burning.',
    locationHint: 'Sector 62, Near Highway Verge',
    dataUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-dust-1',
    title: 'Metro Construction Excavation Dust',
    category: 'construction_activity',
    description: 'Uncovered dry soil piles and vehicular movement generating heavy particulate dust plume.',
    locationHint: 'Ring Road Metro Extension Pillar 42',
    dataUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-industrial-1',
    title: 'Visible Factory Chimney Plume',
    category: 'industrial_emissions',
    description: 'Continuous opaque dark particulate smoke from manufacturing stack without visible wet scrubber.',
    locationHint: 'Mayapuri Industrial Area Phase II',
    dataUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-dust-road-1',
    title: 'Unpaved Road Silt & Traffic Resuspension',
    category: 'dust',
    description: 'Heavy road dust cloud kicked up by commercial trucks on unpaved service lane.',
    locationHint: 'Bypass Service Corridor, Ward 14',
    dataUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&auto=format&fit=crop&q=80',
  }
];
