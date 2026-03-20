import { useState, useEffect } from 'react';
import { 
  MapPin, Clock, Brain, ChevronRight, X, AlertTriangle, 
  TrendingUp, Mic, Type, Image, Shield
} from 'lucide-react';
import { issues } from '../../data/mockData';

function IssueModal({ issue, onClose }) {
  if (!issue) return null;

  const sentimentColor = issue.sentimentScore < -0.7 ? 'text-red-400' : 
                          issue.sentimentScore < -0.4 ? 'text-saffron-400' : 'text-yellow-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-navy-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gray-500">{issue.id}</span>
              {issue.tags.map(tag => (
                <span key={tag} className={
                  tag === 'High Priority' ? 'tag-high' :
                  tag === 'Misinformation Alert' ? 'tag-misinfo' : 'tag-geo'
                }>{tag}</span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-white">{issue.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Location</p>
            <p className="text-sm text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" /> {issue.location}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Category</p>
            <p className="text-sm text-white">{issue.category}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Reported By</p>
            <p className="text-sm text-white">{issue.reportedBy}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Input Method</p>
            <p className="text-sm text-white flex items-center gap-1.5">
              {issue.inputMode === 'voice' ? <Mic className="w-4 h-4 text-saffron-400" /> :
               issue.inputMode === 'image' ? <Image className="w-4 h-4 text-blue-400" /> :
               <Type className="w-4 h-4 text-gray-400" />}
              {issue.inputMode.charAt(0).toUpperCase() + issue.inputMode.slice(1)}
              {issue.dialect && <span className="text-xs text-gray-500 ml-1">({issue.dialect})</span>}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Description</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{issue.description}</p>
        </div>

        {/* AI Analysis */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-blue-400">AI Analysis</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{issue.aiAnalysis}</p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center bg-white/5 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Urgency</p>
            <p className="text-2xl font-bold text-red-400">{issue.urgencyScore}</p>
          </div>
          <div className="text-center bg-white/5 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Public Impact</p>
            <p className="text-2xl font-bold text-saffron-400">{issue.publicImpact}</p>
          </div>
          <div className="text-center bg-white/5 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Sentiment</p>
            <p className={`text-lg font-bold ${sentimentColor}`}>{issue.sentiment}</p>
            <p className="text-xs text-gray-500">{issue.sentimentScore}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 btn-primary text-sm py-3 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> Take Action
          </button>
          <button className="flex-1 btn-secondary text-sm py-3 flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" /> Escalate
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PriorityInbox() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [liveIssues, setLiveIssues] = useState([...issues]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(c => ({
            id: c.tracking_id,
            title: c.category.charAt(0).toUpperCase() + c.category.slice(1) + ' Issue',
            description: c.description,
            location: c.location,
            category: c.category,
            reportedBy: 'Citizen',
            inputMode: 'text',
            aiAnalysis: `Sentiment: ${c.analysis.sentiment}, Urgency: ${c.analysis.urgency}`,
            urgencyScore: c.analysis.urgency * 100,
            publicImpact: c.analysis.sentiment === 'NEGATIVE' ? 'High' : 'Medium',
            sentiment: c.analysis.sentiment,
            sentimentScore: c.analysis.sentiment === 'NEGATIVE' ? '-0.8' : '0.0',
            aiScore: Math.round(c.analysis.urgency * 100),
            status: c.status?.toLowerCase().replace(' ', '_') || 'submitted',
            tags: [c.analysis.urgency > 0.7 ? 'High Priority' : 'Geotagged'],
            reportedAt: c.created_at,
          }));
          setLiveIssues(formatted);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to fetch real issues, falling back to mock data:', err);
        setLoading(false);
      });
  }, []);

  const sortedIssues = [...liveIssues].sort((a, b) => b.aiScore - a.aiScore);

  const statusColors = {
    submitted: 'bg-gray-500/20 text-gray-400',
    ai_processing: 'bg-blue-500/20 text-blue-400',
    administration_dashboard: 'bg-saffron-500/20 text-saffron-400',
    action_taken: 'bg-trust-500/20 text-trust-400',
    verified: 'bg-trust-500/20 text-trust-300',
  };

  const statusLabels = {
    submitted: 'Submitted',
    ai_processing: 'AI Processing',
    administration_dashboard: 'In Review',
    action_taken: 'Action Taken',
    verified: 'Verified',
  };

  return (
    <>
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-saffron-400" />
              AI Priority Inbox
            </h3>
            <p className="text-xs text-gray-500 mt-1">Auto-ranked by urgency × public impact</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-trust-400 animate-pulse" />
            Live Updating
          </div>
        </div>

        {/* Issue List */}
        <div className="divide-y divide-white/5">
          {sortedIssues.map((issue, i) => (
            <button
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-all group text-left"
            >
              {/* Rank */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                i < 3 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-500'
              }`}>
                #{i + 1}
              </div>

              {/* AI Score Bar */}
              <div className="w-12 flex-shrink-0">
                <div className="text-center">
                  <span className={`text-lg font-bold ${
                    issue.aiScore >= 85 ? 'text-red-400' :
                    issue.aiScore >= 70 ? 'text-saffron-400' : 'text-trust-400'
                  }`}>{issue.aiScore}</span>
                  <p className="text-[10px] text-gray-600">Score</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-saffron-400 transition-colors">
                    {issue.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {issue.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(issue.reportedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                {issue.tags.map(tag => (
                  <span key={tag} className={
                    tag === 'High Priority' ? 'tag-high' :
                    tag === 'Misinformation Alert' ? 'tag-misinfo' : 'tag-geo'
                  }>{tag}</span>
                ))}
              </div>

              {/* Status */}
              <div className="flex-shrink-0 hidden md:block">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[issue.status]}`}>
                  {statusLabels[issue.status]}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedIssue && (
        <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}
    </>
  );
}
