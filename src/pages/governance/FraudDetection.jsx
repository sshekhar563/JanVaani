import { useState, useEffect } from 'react';

const CARD = {
  background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
  borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', padding: 24, marginBottom: 20,
};

const FLAG_COLORS = {
  duplicate_image: { bg: '#ff6b6b22', color: '#ff6b6b', label: '🖼️ Duplicate Image' },
  unresolved_damage: { bg: '#ffa50022', color: '#ffa500', label: '⚠️ Unresolved Damage' },
  suspicious_time: { bg: '#f093fb22', color: '#f093fb', label: '⏱️ Suspicious Time' },
  geo_mismatch: { bg: '#4facfe22', color: '#4facfe', label: '📍 Geo Mismatch' },
};

export default function FraudDetection() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fraud/reports?limit=50', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(data => {
        setReports(data.reports || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const flagCounts = {};
  reports.forEach(r => (r.flags || []).forEach(f => { flagCounts[f] = (flagCounts[f] || 0) + 1; }));

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ ...CARD, textAlign: 'center', flex: '1 1 200px' }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: '#ff6b6b' }}>{reports.length}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Flagged Reports</div>
        </div>
        {Object.entries(FLAG_COLORS).map(([key, meta]) => (
          <div key={key} style={{ ...CARD, textAlign: 'center', flex: '1 1 180px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: meta.color }}>{flagCounts[key] || 0}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{meta.label}</div>
          </div>
        ))}
      </div>

      {/* Fraud Reports Table */}
      <div style={CARD}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>🚨 Fraud Reports</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Report ID', 'Flags', 'Details', 'Checked At'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px', color: '#fff', fontFamily: 'monospace', fontSize: 11 }}>
                    {r.report_id?.slice(0, 12)}…
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {(r.flags || []).map(f => {
                        const meta = FLAG_COLORS[f] || { bg: '#ffffff11', color: '#fff', label: f };
                        return (
                          <span key={f} style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                            background: meta.bg, color: meta.color,
                          }}>
                            {meta.label}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)', fontSize: 12, maxWidth: 300 }}>
                    {Object.entries(r.details || {}).map(([k, v]) => (
                      <div key={k}><strong style={{ color: 'rgba(255,255,255,0.8)' }}>{k}:</strong> {v}</div>
                    ))}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                    {r.checked_at ? new Date(r.checked_at).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 32, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                  ✅ No fraud detected yet — system is monitoring all reports.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detection Info */}
      <div style={{ ...CARD, background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.15)' }}>
        <h4 style={{ color: '#ff6b6b', fontWeight: 700, marginBottom: 8 }}>🔍 Detection Methods</h4>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.8 }}>
          <div>• <strong>Duplicate Image</strong> — Detects when the same image hash is reused across different reports</div>
          <div>• <strong>Unresolved Damage</strong> — AI still detects pothole in the after-image</div>
          <div>• <strong>Suspicious Time</strong> — Repair marked complete in less than 15 minutes</div>
          <div>• <strong>Geo Mismatch</strong> — Before/after image locations are too far apart</div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <div style={{
        width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#ff6b6b', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
