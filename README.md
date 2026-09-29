# AirLens AI — Hyperlocal Pollution Intelligence Platform

> **"See the Invisible. Predict the Impact. Act Before It Spreads."**
> 
> *Submission for Build with AI: Code for Communities Hackathon — Track 2: Clean Air & Climate Resilience*

## 1. Executive Summary & Vision

Air quality in metropolitan areas is often measured only by widely dispersed government continuous ambient monitoring stations (CAAQMS). While valuable for citywide averages, these stations cannot capture localized, episodic emissions—such as unpaved construction dust clouds, unauthorized municipal waste burning, or localized industrial plume releases.

**AirLens AI** bridges citizen environmental vigilance with rapid municipal action. Citizens capture smartphone photos of visible smoke, dust, or burning. Google Gemini AI performs structured, preliminary computer vision triage. Meteorological dispersion vectors forecast short-term downwind exposure corridors, and authority dispatchers review verified evidence with clear statutory audit trails.

## 2. Key Capabilities & Features

### A. Citizen Pollution Reporting Flow
- **Multi-source photo upload:** Device file picker, mobile camera capture, drag-and-drop, or 1-click test with pre-curated realistic sample incident photos.
- **Categorization:** Smoke Plume, Road / Silt Dust, Waste Burning, Construction Activity, Industrial Emissions, Other.
- **Geospatial Pin Drop:** Interactive map coordinate selection or one-click browser GPS positioning.
- **Gemini Preliminary Vision Triage:** Rapid visual analysis before submission that confirms plume presence, confidence score, and suggests category corrections.
- **Encrypted Citizen Privacy:** Contact details are strictly restricted to municipal dispatchers and omitted from public maps.

### B. Google Gemini 3.8 Flash Multimodal AI
- **Strict Responsible AI Boundary:** AI strictly analyzes *visible optical indicators* (plume opacity, particulate geometry, ground carryover). It **never** claims to calculate chemical PPM concentrations (e.g., SOx/NOx) or certified AQI values from photos alone.
- **Structured JSON Schema:** Evaluates confidence, visible smoke or dust presence, recommended field actions, and limitations.
- **Operational Briefing Generator:** Transforms incident reports into tactical summaries for municipal squads and Pollution Control Board (PCB) officers.
- **Graceful Simulation Fallback:** If API keys are absent or rate limits are reached, an intelligent deterministic engine ensures full hackathon demo reliability without broken UI states.

### C. Hyperlocal Hotspot Clustering
- **2.5 km Spatial Clustering Algorithm:** Groups co-located citizen reports into potential hotspot zones with severity rings and cluster density metrics.
- **Wind Dispersion Vector Overlay:** Visualizes prevailing wind direction and velocity from Open-Meteo, showing where particulate plumes drift in real time.
- **Multi-layer Geospatial Canvas:** Pan, zoom, recenter, filter by status or priority, and toggle between interactive map and list views.

### D. Pollution Risk Intelligence Engine
- **Transparent Multi-Factor Model:** Calculates composite risk scores (0–100) using 4 transparent factors: report density (35%), wind boundary stagnation (30%), cluster co-location (20%), and baseline PM2.5 (15%).
- **Projected Downwind Exposure Corridors:** Pinpoints sensitive downwind neighborhoods and schools in the drift trajectory with estimated arrival times.
- **Short-Term Exposure Timeline:** Forecasts +2h, +4h, and +6h risk levels based on diurnal inversion trends.

### E. Authority Response Center
- **Incident Triage Queue:** Filter by Pending Review, Priority Alerts, Active Assignments, and Remediated incidents.
- **Verification Controls:** Formally change status to Verified, Under Review, or Rejected.
- **Agency Assignment:** Assign responsible bodies (Municipal Waste Enforcement, Dust Monitoring Cell, PCB Industrial Taskforce).
- **Audit Trail & Internal Notes:** Real-time agency log with operator timestamps and resolution evidence records.

### F. Reports & Analytics
- **Longitudinal Trend Graphs:** 24h particulate profiles (PM2.5 vs PM10) using Recharts.
- **Category Proportions:** Interactive donut charts illustrating incident distributions.
- **CSV Data Export:** One-click download of the complete incident dataset for statutory reporting.

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Motion.
- **Backend & Middleware:** Node.js, Express, tsx.
- **AI Services:** `@google/genai` TypeScript SDK (calling `gemini-3.8-flash` on server-side).
- **Meteorological & Air Quality APIs:** Open-Meteo Live Forecast API & Open-Meteo European/US EPA Air Quality Model.

## 4. Setup & Running Locally

### Prerequisites
- Node.js (version 20 or higher recommended)
- npm or pnpm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Launch development full-stack server (runs on port 3000)
npm run dev
```

### Windows PowerShell
```powershell
npm install
npm run dev
```

### macOS / Linux
```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## 5. Environment Variables Guide

Copy `.env.example` to `.env`:

```env
# GEMINI_API_KEY: Optional for live Google Gemini 3.8 Flash model calls.
# If omitted, AirLens AI runs in full demo mode with intelligent fallback heuristics.
GEMINI_API_KEY="your-gemini-api-key"

# Port (default 3000)
PORT=3000
```

## 6. Responsible AI & Ethical Boundaries

1. **Visible Indicators Only:** Gemini analyzes photographic patterns (optical opacity, plume geometry, unshielded piles).
2. **No False Sensor Claims:** The platform never claims a smartphone photo replaces calibrated PM2.5 laser photometers or gas chromatography.
3. **Citizen Privacy Protected:** Personal contact info is strictly walled from public map views.
4. **Transparent Risk Reasoning:** Every calculated risk score explains the exact weights and meteorological inputs behind it.
