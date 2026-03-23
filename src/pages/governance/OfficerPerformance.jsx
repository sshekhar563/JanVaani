import { useState, useEffect } from 'react';

const CARD = {
  background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
  borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', padding: 24, marginBottom: 20,
};

export default function OfficerPerformance() {
  const [ranking, setRanking] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/officer/ranking?limit=20').then(r => r.json()).catch(() => ({ ranking: [] })),
      fetch('/api/officer/stats').then(r => r.json()).catch(() => ({})),
    ]).then(([r, s]) => {
      setRanking(r.ranking || []);
      setStats(s);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        {[
          { label: 'Total Officers', value: stats.total_officers ?? 0, color: '#667eea' },
          { label: 'Avg Efficiency', value: `${(stats.avg_efficiency ?? 0).toFixed(1)}%`, color: '#43e97b' },
          { label: 'Avg Resolution (hr)', value: (stats.avg_resolution_hours ?? 0).toFixed(1), color: '#f093fb' },
          { label: 'Total Resolved', value: stats.total_resolved ?? 0, color: '#4facfe' },
          { label: 'Total Fraud Cases', value: stats.total_fraud ?? 0, color: '#ff6b6b' },
        ].map((s, i) => (
          <div key={i} style={{
            ...CARD, textAlign: 'center', flex: '1 1 180px', minWidth: 160,
          }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ranking Table */}
      <div style={CARD}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
          🏆 Officer Ranking
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Rank', 'Officer', 'Cases', 'Resolved', 'Avg Hours', 'Rating', 'Fraud', 'Efficiency'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranking.map((o, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 12px', color: i < 3 ? '#ffd700' : '#fff', fontWeight: 700 }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#fff' }}>{o.officer_email}</td>
                  <td style={{ padding: '10px 12px', color: '#4facfe' }}>{o.total_cases}</td>
                  <td style={{ padding: '10px 12px', color: '#43e97b' }}>{o.resolved_cases}</td>
                  <td style={{ padding: '10px 12px', color: '#f093fb' }}>{o.avg_resolution_hours}h</td>
                  <td style={{ padding: '10px 12px', color: '#ffd700' }}>⭐ {o.citizen_rating}</td>
                  <td style={{ padding: '10px 12px', color: o.fraud_cases > 0 ? '#ff6b6b' : 'rgba(255,255,255,0.4)' }}>{o.fraud_cases}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 60, height: 6, borderRadius: 3,
                        background: 'rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${Math.min(100, o.efficiency_score)}%`, height: '100%',
                          background: o.efficiency_score > 70 ? '#43e97b' : o.efficiency_score > 40 ? '#ffd700' : '#ff6b6b',
                          borderRadius: 3,
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>{o.efficiency_score}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {ranking.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 32, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                  No officer data yet. Assign officers to reports to populate.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula Card */}
      <div style={{ ...CARD, background: 'rgba(102,126,234,0.08)', border: '1px solid rgba(102,126,234,0.2)' }}>
        <h4 style={{ color: '#667eea', fontWeight: 700, marginBottom: 8 }}>📐 Efficiency Formula</h4>
        <code style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
          efficiency = 0.4 × resolved_ratio + 0.3 × speed_score + 0.2 × citizen_rating − 0.1 × fraud_ratio
        </code>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <div style={{
        width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#667eea', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
