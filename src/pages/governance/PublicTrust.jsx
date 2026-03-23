import { useState, useEffect } from 'react';

const CARD = {
  background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
  borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', padding: 24, marginBottom: 20,
};

function TrustGauge({ score, label }) {
  const color = score > 70 ? '#43e97b' : score > 45 ? '#ffd700' : '#ff6b6b';
  const pct = Math.min(100, Math.max(0, score));
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${pct * 3.27} 327`} strokeLinecap="round"
            transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color }}>{score.toFixed(1)}</div>
        </div>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 8 }}>{label}</div>
    </div>
  );
}

export default function PublicTrust() {
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/trust/city')
      .then(r => r.json())
      .then(data => { setCity(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const areas = city?.areas || [];
  const cityScore = city?.city_trust_score ?? 0;

  return (
    <div>
      {/* City-wide gauge */}
      <div style={{ ...CARD, textAlign: 'center', padding: 40 }}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>
          🏙️ City-Wide Trust Score
        </h3>
        <TrustGauge score={cityScore} label="Overall Trust Index" />
        {city?.message && (
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 16, fontSize: 13 }}>{city.message}</p>
        )}
      </div>

      {/* Area Cards */}
      <div style={CARD}>
        <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>
          📊 Trust by Area
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {areas.map((a, i) => {
            const score = a.trust_score ?? 0;
            const color = score > 70 ? '#43e97b' : score > 45 ? '#ffd700' : '#ff6b6b';
            return (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 20,
                border: `1px solid ${color}22`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{a.area}</div>
                  <div style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 800,
                    background: `${color}22`, color,
                  }}>
                    {score.toFixed(1)}
                  </div>
                </div>
                {/* Trust bar */}
                <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', marginBottom: 12 }}>
                  <div style={{ width: `${Math.min(100, score)}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>Speed Score <span style={{ color: '#4facfe', fontWeight: 700 }}>{a.speed_score?.toFixed(1)}</span></div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>Rating <span style={{ color: '#ffd700', fontWeight: 700 }}>{a.citizen_rating?.toFixed(1)}</span></div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>Complaints <span style={{ color: '#f093fb', fontWeight: 700 }}>{a.total_complaints}</span></div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>Pending <span style={{ color: '#ff6b6b', fontWeight: 700 }}>{a.pending_complaints}</span></div>
                </div>
              </div>
            );
          })}
        </div>
        {areas.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.4)', padding: 20, textAlign: 'center' }}>
            Submit complaints to populate trust scores.
          </div>
        )}
      </div>

      {/* Formula */}
      <div style={{ ...CARD, background: 'rgba(67,233,123,0.06)', border: '1px solid rgba(67,233,123,0.15)' }}>
        <h4 style={{ color: '#43e97b', fontWeight: 700, marginBottom: 8 }}>📐 Trust Score Formula</h4>
        <code style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>
          Trust = 0.4 × Resolution Speed + 0.3 × Citizen Rating + 0.2 × Sentiment − 0.1 × Pending
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
        borderTopColor: '#43e97b', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
