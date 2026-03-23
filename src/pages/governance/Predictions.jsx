import { useState, useEffect } from 'react';

const CARD = {
  background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
  borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', padding: 24, marginBottom: 20,
};

export default function Predictions() {
  const [complaints, setComplaints] = useState(null);
  const [potholes, setPotholes] = useState(null);
  const [riskAreas, setRiskAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/predict/complaints?months=6').then(r => r.json()).catch(() => ({})),
      fetch('/api/predict/potholes?months=6').then(r => r.json()).catch(() => ({})),
      fetch('/api/predict/high-risk-areas?top=5').then(r => r.json()).catch(() => ({ areas: [] })),
    ]).then(([c, p, r]) => {
      setComplaints(c); setPotholes(p); setRiskAreas(r.areas || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Complaint Forecast */}
      <div style={CARD}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}>📈 Complaint Forecast</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontSize: 13 }}>
          Trend: <span style={{ color: complaints?.trend === 'increasing' ? '#ff6b6b' : '#43e97b', fontWeight: 700 }}>{complaints?.trend || 'N/A'}</span>
        </p>
        <ChartBars data={complaints?.forecast || []} labelKey="month" valueKey="predicted_count" color="#667eea" />
        {complaints?.history?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8 }}>Historical</h4>
            <ChartBars data={complaints.history.slice(-6)} labelKey="month" valueKey="count" color="#4facfe" />
          </div>
        )}
      </div>

      {/* Pothole Forecast */}
      <div style={CARD}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}>🕳️ Pothole Forecast</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16, fontSize: 13 }}>
          Trend: <span style={{ color: potholes?.trend === 'increasing' ? '#ff6b6b' : '#43e97b', fontWeight: 700 }}>{potholes?.trend || 'N/A'}</span>
        </p>
        <ChartBars data={potholes?.forecast || []} labelKey="month" valueKey="predicted_count" color="#f093fb" />
      </div>

      {/* High-Risk Areas */}
      <div style={CARD}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>⚠️ High-Risk Areas</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Area', 'Total', 'Trend Slope', 'Pothole %', 'Risk'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riskAreas.map((a, i) => {
                const rc = a.risk_level === 'high' ? '#ff6b6b' : a.risk_level === 'medium' ? '#ffd700' : '#43e97b';
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 12px', color: '#fff', fontWeight: 600 }}>{a.area}</td>
                    <td style={{ padding: '10px 12px', color: '#4facfe' }}>{a.total_complaints?.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', color: '#f093fb', fontWeight: 600 }}>{a.monthly_trend_slope}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.7)' }}>{a.pothole_percentage}%</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: rc + '22', color: rc, textTransform: 'uppercase' }}>{a.risk_level}</span>
                    </td>
                  </tr>
                );
              })}
              {riskAreas.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No data. Run preprocessing script first.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChartBars({ data, labelKey, valueKey, color }) {
  if (!data.length) return <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>No forecast data</div>;
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            height: `${((d[valueKey] || 0) / max) * 100}px`,
            background: `${color}88`, borderRadius: '6px 6px 0 0',
            transition: 'height 0.6s ease', minHeight: 4,
          }} />
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d[labelKey]}</div>
          <div style={{ fontSize: 10, color, fontWeight: 700 }}>{d[valueKey]?.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

function Spinner() {
  return (<div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
    <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#f093fb', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>);
}
