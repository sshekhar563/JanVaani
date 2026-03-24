import { useState, useEffect } from 'react';

const CARD = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(16px)',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.1)',
  padding: 24,
  marginBottom: 20,
};

const STAT_CARD = {
  ...CARD,
  textAlign: 'center',
  flex: '1 1 200px',
  minWidth: 180,
};

export default function GeoAnalytics() {
  const [heatmap, setHeatmap] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [areaStats, setAreaStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
    Promise.all([
      fetch('/api/geo/heatmap?limit=2000', { headers }).then(r => r.json()).catch(() => ({ points: [] })),
      fetch('/api/geo/clusters?n=8', { headers }).then(r => r.json()).catch(() => ({ clusters: [] })),
      fetch('/api/geo/area-stats', { headers }).then(r => r.json()).catch(() => ({ stats: [] })),
    ]).then(([h, c, a]) => {
      setHeatmap(h.points || []);
      setClusters(c.clusters || []);
      setAreaStats(a.stats || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={STAT_CARD}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#667eea' }}>{heatmap.length.toLocaleString()}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>Complaint Points</div>
        </div>
        <div style={STAT_CARD}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#f093fb' }}>{clusters.length}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>Clusters</div>
        </div>
        <div style={STAT_CARD}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#4facfe' }}>{areaStats.length}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>Areas Tracked</div>
        </div>
        <div style={STAT_CARD}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#43e97b' }}>
            {areaStats.reduce((s, a) => s + a.total_complaints, 0).toLocaleString()}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>Total Complaints</div>
        </div>
      </div>

      {/* Cluster Table */}
      <div style={CARD}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
          📍 Complaint Clusters
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Cluster', 'Lat', 'Lng', 'Count', 'Top Complaints'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clusters.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px', color: '#667eea', fontWeight: 700 }}>#{c.id}</td>
                  <td style={{ padding: '10px 12px', color: '#fff' }}>{c.center_lat}</td>
                  <td style={{ padding: '10px 12px', color: '#fff' }}>{c.center_lng}</td>
                  <td style={{ padding: '10px 12px', color: '#43e97b', fontWeight: 700 }}>{c.count?.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.7)' }}>
                    {Object.entries(c.top_complaints || {}).map(([k, v]) => `${k} (${v})`).join(', ') || '—'}
                  </td>
                </tr>
              ))}
              {clusters.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 20, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>No cluster data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Area Stats */}
      <div style={CARD}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
          🏘️ Area Statistics
        </h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {areaStats.map((a, i) => (
            <div key={i} style={{
              flex: '1 1 250px', minWidth: 240,
              background: 'rgba(255,255,255,0.04)', borderRadius: 12,
              padding: 20, border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{a.borough}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#667eea' }}>{a.total_complaints?.toLocaleString()}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>complaints</div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                {Object.entries(a.top_complaint_types || {}).slice(0, 3).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span>{k}</span>
                    <span style={{ color: '#f093fb', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {areaStats.length === 0 && (
            <div style={{ color: 'rgba(255,255,255,0.4)', padding: 20 }}>No area data. Run the preprocessing script first.</div>
          )}
        </div>
      </div>

      {/* Heatmap Data Preview */}
      <div style={CARD}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>
          🔥 Heatmap Data Sample
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {heatmap.slice(0, 20).map((p, i) => (
            <div key={i} style={{
              background: 'rgba(102,126,234,0.1)', borderRadius: 8, padding: '8px 12px',
              fontSize: 11, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(102,126,234,0.2)',
            }}>
              <div style={{ fontWeight: 600, color: '#667eea' }}>{p.lat}, {p.lng}</div>
              <div>{p.type || 'Unknown'}</div>
            </div>
          ))}
        </div>
        {heatmap.length > 20 && (
          <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            + {heatmap.length - 20} more points
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSpinner() {
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
