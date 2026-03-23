import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Star, CheckCircle2, ThumbsUp, Shield, AlertTriangle, TrendingUp, Send, Eye, ExternalLink } from 'lucide-react';
import StatusTimeline from '../StatusTimeline';

const CARD = 'bg-white/[0.03] border border-white/10 rounded-2xl';

// ── Complaint Map (simple visual grid) ──────────────────────────────
function ComplaintMap({ complaints }) {
  const areas = {};
  complaints.forEach(c => {
    const loc = c.location || 'Unknown';
    areas[loc] = (areas[loc] || 0) + 1;
  });
  const entries = Object.entries(areas).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const max = Math.max(...entries.map(e => e[1]), 1);

  return (
    <div className={`${CARD} p-6`}>
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
        <MapPin className="w-5 h-5 text-blue-400" /> Complaint Map
      </h3>
      <p className="text-xs text-gray-500 mb-5">Hotspot areas by complaint density</p>
      {entries.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">No location data yet</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([loc, count]) => (
            <div key={loc} className="flex items-center gap-3">
              <span className="text-sm text-gray-300 w-32 truncate">{loc}</span>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Trust Score Card ────────────────────────────────────────────────
function TrustScoreCard() {
  const [trust, setTrust] = useState(null);
  useEffect(() => {
    fetch('/api/trust/city').then(r => r.json()).then(setTrust).catch(() => {});
  }, []);

  const score = trust?.city_trust_score || 0;
  const pct = Math.min(score, 100);
  const color = score >= 70 ? '#43e97b' : score >= 40 ? '#ffd700' : '#ff6b6b';

  return (
    <div className={`${CARD} p-6 text-center`}>
      <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-teal-400" /> Public Trust Score
      </h3>
      <div className="relative w-32 h-32 mx-auto mb-3">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${pct * 2.64} 264`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score.toFixed(1)}</span>
          <span className="text-[10px] text-gray-500">out of 100</span>
        </div>
      </div>
      <p className="text-xs text-gray-400">City-wide trust index</p>
    </div>
  );
}

// ── Completed Works ─────────────────────────────────────────────────
function CompletedWorks() {
  const [works, setWorks] = useState([]);
  useEffect(() => {
    fetch('/api/workflow/completed-works').then(r => r.json()).then(d => setWorks(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  return (
    <div className={`${CARD} p-6`}>
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Completed Works
      </h3>
      <p className="text-xs text-gray-500 mb-4">Verified repairs with proof</p>
      {works.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-10 h-10 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No verified completions yet</p>
          <p className="text-gray-600 text-xs mt-1">Completed work will appear here after AI verification</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {works.slice(0, 10).map(w => (
            <div key={w._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              {w.proof_image_url ? (
                <img src={w.proof_image_url} alt="proof" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{w.category || 'Repair'}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {w.location || 'N/A'}
                </p>
              </div>
              {w.citizen_feedback && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-amber-400 font-bold">{w.citizen_feedback.rating}/5</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Community Validation ────────────────────────────────────────────
function CommunityValidation({ complaints }) {
  const resolved = complaints.filter(c => c.status === 'Resolved' || c.workflow_status === 'feedback_received');
  const withFeedback = resolved.filter(c => c.citizen_feedback);
  const avgRating = withFeedback.length > 0
    ? (withFeedback.reduce((s, c) => s + (c.citizen_feedback?.rating || 0), 0) / withFeedback.length).toFixed(1)
    : null;

  return (
    <div className={`${CARD} p-6`}>
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <ThumbsUp className="w-5 h-5 text-amber-400" /> Community Validation
      </h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <p className="text-2xl font-bold text-emerald-400">{resolved.length}</p>
          <p className="text-xs text-gray-500 mt-1">Resolved</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <p className="text-2xl font-bold text-amber-400">{withFeedback.length}</p>
          <p className="text-xs text-gray-500 mt-1">Rated</p>
        </div>
        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <p className="text-2xl font-bold text-blue-400">{avgRating || '—'}</p>
          <p className="text-xs text-gray-500 mt-1">Avg Rating</p>
        </div>
      </div>
    </div>
  );
}

// ── Feedback Form ───────────────────────────────────────────────────
function FeedbackForm({ complaint, onDone }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (rating < 1) return;
    setSubmitting(true);
    try {
      await fetch(`/api/workflow/feedback/${complaint._id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      onDone();
    } catch { } finally { setSubmitting(false); }
  };

  return (
    <div className="mt-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
      <p className="text-sm text-amber-400 font-semibold mb-2">Rate this resolution</p>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} onClick={() => setRating(s)}
            className={`p-1 transition-transform ${s <= rating ? 'scale-110' : 'opacity-40'}`}>
            <Star className={`w-6 h-6 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
          </button>
        ))}
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)}
        placeholder="Optional feedback..."
        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white placeholder-gray-600 mb-2 resize-none"
        rows={2} />
      <button onClick={submit} disabled={rating < 1 || submitting}
        className="btn-primary text-xs px-4 py-2 disabled:opacity-40">
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
}

// ── Main Public Dashboard ───────────────────────────────────────────
export default function PublicDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = () => {
    fetch('/api/complaints', {
      headers: { 'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then(data => { setComplaints(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchComplaints(); }, [user]);

  const getSteps = (comp) => {
    const ws = comp.workflow_status || '';
    const s = comp.status || 'Pending';
    return [
      { label: 'Submitted', hiLabel: 'दर्ज़', status: 'completed', timestamp: new Date(comp.created_at).toLocaleString() },
      { label: 'AI Detected', hiLabel: 'AI पहचान', status: comp.analysis ? 'completed' : 'pending' },
      { label: 'Assigned', hiLabel: 'असाइन', status: ['assigned', 'proof_uploaded', 'verified', 'feedback_received'].includes(ws) ? 'completed' : (s === 'Pending' ? 'active' : 'pending') },
      { label: 'Repair Done', hiLabel: 'मरम्मत', status: ['proof_uploaded', 'verified', 'feedback_received'].includes(ws) ? 'completed' : (ws === 'assigned' ? 'active' : 'pending') },
      { label: 'AI Verified', hiLabel: 'सत्यापित', status: ['verified', 'feedback_received'].includes(ws) ? 'completed' : (ws === 'proof_uploaded' ? 'active' : 'pending') },
      { label: 'Feedback', hiLabel: 'फ़ीडबैक', status: ws === 'feedback_received' ? 'completed' : (ws === 'verified' ? 'active' : 'pending') },
    ];
  };

  return (
    <div className="min-h-screen text-white pt-16 px-4 sm:px-6 pb-20" style={{ background: '#1A1208' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Citizen Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Track complaints, view trust scores, and monitor resolutions</p>
          </div>
          <a href="/report" className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 no-underline">
            <Send className="w-4 h-4" /> File a Complaint
          </a>
        </div>

        {/* Top Grid: Trust + Community + Map */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <TrustScoreCard />
          <CommunityValidation complaints={complaints} />
          <CompletedWorks />
        </div>

        {/* Complaint Map */}
        <div className="mb-8">
          <ComplaintMap complaints={complaints} />
        </div>

        {/* My Complaints */}
        <div className={`${CARD} p-6 sm:p-8`}>
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> My Complaints
          </h2>
          <p className="text-sm text-gray-400 mb-6">Full lifecycle tracking from submission to resolution</p>

          {loading ? (
            <div className="text-center text-gray-500 py-12 flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
              Loading...
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-2xl">
              <Send className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No complaints yet</h3>
              <p className="text-gray-500 text-sm">File your first complaint to see the full workflow here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {complaints.map(comp => (
                <div key={comp._id} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all">
                  <div className="p-5 border-b border-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-base font-bold text-white">{comp.category || 'General'}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">ID: {comp.tracking_id || comp._id.slice(-6)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ring-1 ring-inset ${
                        comp.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30' :
                        comp.status === 'Verified' ? 'bg-blue-500/10 text-blue-400 ring-blue-500/30' :
                        comp.status === 'Proof Uploaded' ? 'bg-purple-500/10 text-purple-400 ring-purple-500/30' :
                        comp.status === 'Assigned' ? 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/30' :
                        comp.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 ring-amber-500/30' :
                        'bg-gray-500/10 text-gray-400 ring-gray-500/30'
                      }`}>{comp.status}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{comp.description || comp.text}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                      {comp.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-500/70" /> {comp.location}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500/70" /> {new Date(comp.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="bg-white/[0.02] p-5">
                    <h4 className="text-xs font-bold text-amber-500/70 uppercase tracking-wider mb-4">Workflow Timeline</h4>
                    <StatusTimeline steps={getSteps(comp)} />
                    {/* Show feedback form for verified complaints */}
                    {comp.workflow_status === 'verified' && !comp.citizen_feedback && (
                      <FeedbackForm complaint={comp} onDone={fetchComplaints} />
                    )}
                    {comp.citizen_feedback && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Rated {comp.citizen_feedback.rating}/5 — Thank you for your feedback!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
