import { useState, useEffect } from 'react';

const CARD = {
  background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
  borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', padding: 24, marginBottom: 20,
};

const PRIORITY_COLORS = { high: '#ff6b6b', medium: '#ffd700', low: '#43e97b' };

export default function DigitalTwin() {
  const [state, setState] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/digital-twin/state', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json())
      .then(d => { setState(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const runSim = () => {
    setSimulating(true);
    fetch('/api/digital-twin/simulate', { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }, 
      body: '{}' 
    })
      .then(r => r.json()).then(d => { setState(d); setSimulating(false); }).catch(() => setSimulating(false));
  };

  if (loading) return <Spinner />;
  const areas = state?.areas ? Object.values(state.areas) : [];

  return (
    <div>
      <div style={{ ...CARD, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h3 style={{ color: '#fff', fontWeight: 700, margin: 0 }}>🏙️ Virtual City Model</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '4px 0 0', fontSize: 13 }}>Tick #{state?.tick ?? 0} — {areas.length} areas</p>
        </div>
        <button onClick={runSim} disabled={simulating} style={{
          padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14,
          background: simulating ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff',
          boxShadow: simulating ? 'none' : '0 4px 20px rgba(102,126,234,0.4)',
        }}>{simulating ? '⏳ Simulating…' : '▶️ Run Simulation Tick'}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {areas.map((a, i) => {
          const pc = PRIORITY_COLORS[a.priority] || '#fff';
          const tc = a.trust_score > 70 ? '#43e97b' : a.trust_score > 45 ? '#ffd700' : '#ff6b6b';
          return (
            <div key={i} style={{ ...CARD, margin: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '6px 16px', borderRadius: '0 16px 0 12px', fontSize: 11, fontWeight: 700, background: pc + '22', color: pc, textTransform: 'uppercase' }}>{a.priority}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{a.area}</div>
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: tc }}>{a.trust_score?.toFixed(1)}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Trust Score</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                {[{ l: 'Complaints', v: a.complaints_count?.toLocaleString(), c: '#4facfe' },
                  { l: 'Potholes', v: a.pothole_count?.toLocaleString(), c: '#f093fb' },
                  { l: 'Avg Resolve', v: `${a.avg_resolution_time?.toFixed(1)}h`, c: '#667eea' },
                  { l: 'Population', v: a.population?.toLocaleString(), c: 'rgba(255,255,255,0.7)' }
                ].map((s, j) => (
                  <div key={j} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ color: s.c, fontWeight: 700, fontSize: 16 }}>{s.v}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {areas.length === 0 && <div style={{ ...CARD, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No data. Run preprocessing first.</div>}
    </div>
  );
}

function Spinner() {
  return (<div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
    <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#764ba2', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>);
}
