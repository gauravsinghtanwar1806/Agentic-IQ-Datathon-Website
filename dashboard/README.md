# 📊 Fintrix Dashboard

The interactive frontend dashboard for Fintrix AI, providing a comprehensive view of the payments ecosystem, merchant intelligence, dispute analytics, and risk indicators. Built for the TransOrg AgentIQ Datathon.

## Tech Stack
- **Framework:** React + Vite
- **Visualizations:** Recharts, Plotly, Leaflet, React Simple Maps
- **Data Parsing:** Papa Parse
- **Icons:** Lucide React

## Key Features
- **Overview:** Transaction activity, key KPIs, and risk indicators.
- **City Risk Map:** Geographic view of transactions and risk across India.
- **Disputes & Chargebacks:** Analyzes chargeback patterns, severity, and resolution statuses.
- **Merchant Intelligence:** Tracks merchant performance, categories, and anomaly detection.
- **Data Quality & KYC:** Brings together KYC status, risk segments, and identity anomalies.
- **Fintrix AI:** Interactive chat interface communicating directly with the Fintrix AI backend for conversational insights.

## Quickstart

### 1. Install Dependencies
```bash
cd dashboard
npm install
```

### 2. Configure Environment
Create a `.env` file in the `dashboard` directory based on `.env.example`:
```env
VITE_FINTRIX_API_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

## Data Integration
The dashboard loads cleaned and processed CSV files directly into a shared React `DataContext` using Papa Parse, ensuring fast, client-side filtering and charting without needing a heavy database for the analytical views. The Fintrix AI chat interface connects to the FastAPI backend.
