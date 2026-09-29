import { CityRegion } from '../types';

export const SUPPORTED_CITIES: CityRegion[] = [
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'National Capital Region',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090,
    zoom: 12,
    defaultStation: 'Anand Vihar / IGI Airport Station (DPCC)',
    wardCount: 250,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 12,
    defaultStation: 'Silk Board / BTM Layout Station (KSPCB)',
    wardCount: 198,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
    zoom: 12,
    defaultStation: 'Bandra Kurla Complex Station (MPCB)',
    wardCount: 227,
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
    zoom: 12,
    defaultStation: 'Victoria Memorial / Rabindra Bharati (WBPCB)',
    wardCount: 144,
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    latitude: 17.3850,
    longitude: 78.4867,
    zoom: 12,
    defaultStation: 'Sanathnagar / Zoo Park Station (TSPCB)',
    wardCount: 150,
  }
];

export const DEFAULT_CITY = SUPPORTED_CITIES[0];
