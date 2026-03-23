import { useState } from 'react';
import GeoAnalytics from './governance/GeoAnalytics';
import OfficerPerformance from './governance/OfficerPerformance';
import FraudDetection from './governance/FraudDetection';
import PublicTrust from './governance/PublicTrust';
import DigitalTwin from './governance/DigitalTwin';
import Predictions from './governance/Predictions';

const TABS = [
  { id: 'geo',      label: '🌐 Geo Analytics',     icon: '🗺️' },
  { id: 'officer',  label: '👮 Officer Performance', icon: '📊' },
  { id: 'fraud',    label: '🚨 Fraud Detection',    icon: '🔍' },
  { id: 'trust',    label: '🤝 Public Trust',       icon: '📈' },
  { id: 'twin',     label: '🏙️ Digital Twin',       icon: '🎮' },
  { id: 'predict',  label: '🔮 Predictions',        icon: '📉' },
];

const panelMap = {
  geo:     GeoAnalytics,
  officer: OfficerPerformance,
  fraud:   FraudDetection,
  trust:   PublicTrust,
  twin:    DigitalTwin,
  predict: Predictions,
};

export default function GovernanceDashboard() {
  const [active, setActive] = useState('geo');
  const Panel = panelMap[active];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', paddingTop: 80 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '24px 16px 0' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.5px' }}>
          🏛️ Smart Governance Platform
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4, fontSize: 14 }}>
          AI-Powered Civic Intelligence & Analytics
        </p>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: 'flex', gap: 8, padding: '20px 24px', overflowX: 'auto',
        justifyContent: 'center', flexWrap: 'wrap',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'all 0.25s ease',
              background: active === tab.id
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'rgba(255,255,255,0.08)',
              color: active === tab.id ? '#fff' : 'rgba(255,255,255,0.7)',
              boxShadow: active === tab.id ? '0 4px 20px rgba(102,126,234,0.4)' : 'none',
              transform: active === tab.id ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Panel */}
      <div style={{ padding: '0 24px 40px', maxWidth: 1400, margin: '0 auto' }}>
        <Panel />
      </div>
    </div>
  );
}
