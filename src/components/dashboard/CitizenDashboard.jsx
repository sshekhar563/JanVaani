import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock } from 'lucide-react';
import StatusTimeline from '../StatusTimeline';

export default function CitizenDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/complaints', {
      headers: {
        'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
      }
    })
      .then(r => r.json())
      .then(data => {
        setComplaints(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [user]);

  // Generate dynamic steps based on current status
  const getStepsForStatus = (status, createdAt) => {
    const isPending = status === 'Pending';
    const isInProgress = status === 'In Progress';
    const isResolved = status === 'Resolved';
    
    return [
      { 
        label: 'Submitted', hiLabel: 'दर्ज़ की गई', 
        status: 'completed', 
        timestamp: new Date(createdAt).toLocaleString(), 
        description: 'Complaint filed successfully', hiDescription: 'शिकायत सफलतापूर्वक दर्ज की गई' 
      },
      { 
        label: 'Under Review', hiLabel: 'समीक्षा जारी', 
        status: isPending ? 'active' : 'completed', 
        description: isPending ? 'Pending review by authorities' : 'Reviewed and assigned', 
        hiDescription: isPending ? 'अधिकारियों द्वारा समीक्षा लंबित' : 'समीक्षा और असाइन किया गया' 
      },
      { 
        label: 'Action Taken', hiLabel: 'कार्रवाई', 
        status: isResolved ? 'completed' : (isInProgress ? 'active' : 'pending'), 
        description: isInProgress ? 'Field team is working on this' : 'Awaiting field team dispatch', 
        hiDescription: isInProgress ? 'फील्ड टीम इस पर काम कर रही है' : 'फील्ड टीम की प्रतीक्षा' 
      },
      { 
        label: 'Resolved', hiLabel: 'सत्यापित और बंद', 
        status: isResolved ? 'completed' : 'pending', 
        description: isResolved ? 'Issue has been verified and closed' : 'Awaiting completion', 
        hiDescription: isResolved ? 'मुद्दे को सत्यापित और बंद कर दिया गया है' : 'पूर्ण होने की प्रतीक्षा' 
      },
    ];
  };

  return (
    <div className="min-h-screen text-white pt-16 px-6 pb-20" style={{ background: '#1A1208' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('citizenDashboard.myComplaints') || 'My Complaints'}</h2>
          <p className="text-sm text-gray-400 mb-8">{t('citizenDashboard.trackStatus') || 'Track the status of your submitted grievances.'}</p>

          {loading ? (
            <div className="text-center text-gray-500 py-12 flex flex-col items-center">
               <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               Loading your complaints...
            </div>
          ) : complaints.length === 0 ? (
             <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-12">
              <h3 className="text-xl font-bold text-white mb-2">No complaints found</h3>
              <p className="text-gray-400">You haven't submitted any complaints yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {complaints.map(comp => (
                <div key={comp._id} className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all">
                  <div className="p-6 border-b border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{comp.category || comp.analysis?.category || 'General Complaint'}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1.5 font-mono">
                           ID: {comp.tracking_id || comp._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${
                        comp.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30' :
                        comp.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 ring-amber-500/30' :
                        'bg-amber-500/5 text-amber-400 ring-amber-500/20'
                      }`}>
                        {comp.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2 leading-relaxed">{comp.description || comp.text}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        {comp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-500/70" /> {comp.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500/70" /> {new Date(comp.created_at).toLocaleDateString()}
                        </span>
                    </div>
                  </div>
                  
                  <div className="bg-white/[0.02] p-6 pb-2">
                     <h4 className="text-xs font-bold text-amber-500/70 uppercase tracking-wider mb-5">Status Timeline</h4>
                     <StatusTimeline steps={getStepsForStatus(comp.status, comp.created_at)} />
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
