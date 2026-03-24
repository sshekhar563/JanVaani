import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase, Upload, CheckCircle2, Clock, Camera, MapPin,
  TrendingUp, AlertTriangle, Star, BarChart3, Eye
} from 'lucide-react';

const CARD = 'bg-white/[0.03] border border-white/10 rounded-2xl';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  const email = user?.email || '';

  const fetchAssignments = () => {
    fetch('/api/workflow/my-assignments', {
      headers: { 'Authorization': `Bearer ${user?.token}` }
    })
      .then(r => r.json())
      .then(data => { setAssignments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { if (user?.token) fetchAssignments(); }, [user?.token]);

  const pending = assignments.filter(a => a.workflow_status === 'assigned');
  const proofDone = assignments.filter(a => ['proof_uploaded', 'verified', 'feedback_received'].includes(a.workflow_status));
  const verified = assignments.filter(a => ['verified', 'feedback_received'].includes(a.workflow_status));

  const handleUploadProof = async (complaintId, file) => {
    setUploading(complaintId);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`/api/workflow/upload-proof/${complaintId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user?.token}` },
        body: formData
      });
      if (res.ok) {
        // Auto-trigger AI verification
        await fetch(`/api/workflow/verify-repair/${complaintId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        fetchAssignments();
      }
    } catch (e) { console.error(e); }
    setUploading(null);
  };

  const statusConfig = {
    assigned: { label: 'Needs Action', color: 'text-amber-400', bg: 'bg-amber-500/10 ring-amber-500/30' },
    proof_uploaded: { label: 'Proof Sent', color: 'text-purple-400', bg: 'bg-purple-500/10 ring-purple-500/30' },
    verified: { label: 'AI Verified', color: 'text-blue-400', bg: 'bg-blue-500/10 ring-blue-500/30' },
    feedback_received: { label: 'Complete', color: 'text-emerald-400', bg: 'bg-emerald-500/10 ring-emerald-500/30' },
  };

  return (
    <div className="min-h-screen text-white pt-16 px-4 sm:px-6 pb-20" style={{ background: '#1A1208' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-teal-400" /> Officer Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage assigned complaints, upload repair proofs, and track performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Assigned', value: assignments.length, icon: Briefcase, color: 'blue' },
            { label: 'Needs Proof', value: pending.length, icon: Camera, color: 'amber' },
            { label: 'Proof Uploaded', value: proofDone.length, icon: Upload, color: 'purple' },
            { label: 'Verified', value: verified.length, icon: CheckCircle2, color: 'emerald' },
          ].map((s, i) => (
            <div key={i} className={`${CARD} p-4 text-center`}>
              <s.icon className={`w-6 h-6 mx-auto mb-2 text-${s.color}-400`} />
              <p className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Performance Stats */}
        <div className={`${CARD} p-6 mb-8`}>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-teal-400" /> Performance Stats
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-teal-500/5 border border-teal-500/10">
              <p className="text-3xl font-bold text-teal-400">
                {assignments.length > 0 ? Math.round((verified.length / assignments.length) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Completion Rate</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <p className="text-3xl font-bold text-amber-400">{assignments.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total Cases</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              {(() => {
                const rated = assignments.filter(a => a.citizen_feedback);
                const avg = rated.length > 0 ? (rated.reduce((s, a) => s + (a.citizen_feedback?.rating || 0), 0) / rated.length).toFixed(1) : '—';
                return (<>
                  <p className="text-3xl font-bold text-blue-400">{avg}</p>
                  <p className="text-xs text-gray-500 mt-1">Citizen Rating</p>
                </>);
              })()}
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className={`${CARD} overflow-hidden`}>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> Assigned Complaints
              </h3>
              <p className="text-xs text-gray-500 mt-1">Upload repair proof to complete assignments</p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading assignments...
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No assignments yet</h3>
              <p className="text-gray-500 text-sm">Complaints will appear here when admin assigns them to you</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {assignments.map(comp => {
                const ws = comp.workflow_status || 'assigned';
                const cfg = statusConfig[ws] || statusConfig.assigned;
                return (
                  <div key={comp._id} className="p-5 hover:bg-white/[0.02] transition-all">
                    <div className="flex items-start gap-4">
                      {/* Left: Image or placeholder */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                        {comp.proof_image_url ? (
                          <img src={comp.proof_image_url} alt="proof" className="w-full h-full object-cover" />
                        ) : comp.image_url ? (
                          <img src={comp.image_url} alt="report" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-white truncate">{comp.category || 'Complaint'}</h4>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ring-1 ring-inset ${cfg.bg}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-1 mb-2">{comp.description || ''}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {comp.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {comp.location}</span>}
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(comp.assigned_at || comp.created_at).toLocaleDateString()}</span>
                          <span className="font-mono text-gray-600">{comp.tracking_id}</span>
                        </div>
                        {comp.citizen_feedback && (
                          <div className="flex items-center gap-1 mt-2">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= comp.citizen_feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">{comp.citizen_feedback.comment}</span>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0">
                        {ws === 'assigned' ? (
                          <label className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer">
                            {uploading === comp._id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <><Upload className="w-3.5 h-3.5" /> Upload Proof</>
                            )}
                            <input type="file" accept="image/*" className="hidden"
                              onChange={e => e.target.files?.[0] && handleUploadProof(comp._id, e.target.files[0])} />
                          </label>
                        ) : ws === 'proof_uploaded' || ws === 'verified' ? (
                          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Done
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Complete
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
