import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Zap, FileText, Activity } from 'lucide-react';
import StatusTimeline from './StatusTimeline';

/**
 * LiveTracker — Right sidebar showing real-time complaint preview.
 * Oil Painting palette: ink (#1A1208) header, cream (#FDECC8) cards, amber accents.
 */
export default function LiveTracker({ complaintData = {}, timelineSteps }) {
  const {
    title = '',
    location = '',
    date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    priority = 'medium',
    category = '',
    description = '',
    estimatedTime = '3-5 days',
  } = complaintData;

  const progress = useMemo(() => {
    if (!timelineSteps) return 40;
    const completed = timelineSteps.filter(s => s.status === 'completed').length;
    const active = timelineSteps.filter(s => s.status === 'active').length;
    const total = timelineSteps.length;
    return Math.round(((completed + active * 0.5) / total) * 100);
  }, [timelineSteps]);

  const priorityConfig = {
    high:   { label: 'High',   hiLabel: 'उच्च',  color: '#D42E18', bg: 'rgba(212,46,24,0.1)',  border: 'rgba(212,46,24,0.3)' },
    medium: { label: 'Medium', hiLabel: 'मध्यम', color: '#E8820A', bg: 'rgba(232,130,10,0.1)', border: 'rgba(232,130,10,0.3)' },
    low:    { label: 'Low',    hiLabel: 'निम्न',  color: '#1A7A8A', bg: 'rgba(26,122,138,0.1)', border: 'rgba(26,122,138,0.3)' },
  };

  const currentPriority = priorityConfig[priority] || priorityConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-lg overflow-hidden"
      style={{
        background: '#FDECC8',
        border: '1.5px solid rgba(232,130,10,0.25)',
        boxShadow: '0 2px 16px rgba(196,68,10,0.08)',
      }}
    >
      {/* Header */}
      <div className="px-6 py-4" style={{ background: '#1A1208' }}>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5" style={{ color: '#F5B830' }} />
          <h3 className="text-base font-bold" style={{ color: '#FDECC8', fontFamily: "'Playfair Display', serif" }}>
            <span className="hi-text">लाइव ट्रैकर</span>
            <span className="en-text">Live Tracker</span>
          </h3>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
            <span className="text-xs" style={{ color: 'rgba(253,236,200,0.6)', fontFamily: 'Hind Siliguri' }}>
              <span className="hi-text">लाइव</span>
              <span className="en-text">Live</span>
            </span>
          </span>
        </div>
      </div>

      {/* Complaint Preview */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(232,130,10,0.2)' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#1A1208', fontFamily: 'Hind Siliguri' }}>
              {title || (
                <>
                  <span className="hi-text" style={{ color: '#3D2A18', opacity: 0.5 }}>शिकायत शीर्षक यहाँ दिखेगा...</span>
                  <span className="en-text" style={{ color: '#3D2A18', opacity: 0.5 }}>Complaint title appears here...</span>
                </>
              )}
            </p>
          </div>
          <span
            className="inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-sm flex-shrink-0"
            style={{ background: currentPriority.bg, color: currentPriority.color, border: `1px solid ${currentPriority.border}`, fontFamily: 'Hind Siliguri' }}
          >
            <span className="hi-text">{currentPriority.hiLabel}</span>
            <span className="en-text">{currentPriority.label}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs" style={{ color: '#3D2A18', opacity: 0.7, fontFamily: 'Hind Siliguri' }}>
          {location && (
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{location}</span>
          )}
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{date}</span>
        </div>
      </div>

      {/* AI Categorization */}
      {category && (
        <div className="px-6 py-3 border-b" style={{ borderColor: 'rgba(232,130,10,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5" style={{ color: '#E8820A' }} />
            <span className="text-xs font-semibold" style={{ color: '#E8820A', fontFamily: 'Hind Siliguri' }}>
              <span className="hi-text">AI वर्गीकरण</span>
              <span className="en-text">AI Classification</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-sm"
              style={{ background: 'rgba(232,130,10,0.1)', color: '#C4440A', border: '1px solid rgba(232,130,10,0.3)', fontFamily: 'Hind Siliguri' }}>
              {category}
            </span>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="px-6 py-3 border-b" style={{ borderColor: 'rgba(232,130,10,0.2)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: '#1A1208', fontFamily: 'Hind Siliguri' }}>
            <span className="hi-text">प्रगति</span>
            <span className="en-text">Progress</span>
          </span>
          <span className="text-xs font-bold" style={{ color: '#C4440A', fontFamily: "'Playfair Display', serif" }}>{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(232,130,10,0.15)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #C4440A, #E8820A)' }}
          />
        </div>
      </div>

      {/* Status Timeline */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(232,130,10,0.2)' }}>
        <h4 className="text-xs font-semibold mb-4" style={{ color: '#1A1208', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Hind Siliguri' }}>
          <span className="hi-text">स्थिति टाइमलाइन</span>
          <span className="en-text">Status Timeline</span>
        </h4>
        <StatusTimeline steps={timelineSteps} />
      </div>

      {/* Pipeline Snapshot */}
      <div className="px-6 py-4">
        <h4 className="text-xs font-semibold mb-3" style={{ color: '#1A1208', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Hind Siliguri' }}>
          <span className="hi-text">पाइपलाइन स्नैपशॉट</span>
          <span className="en-text">Pipeline Snapshot</span>
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg" style={{ background: 'rgba(26,122,138,0.08)', border: '1px solid rgba(26,122,138,0.2)' }}>
            <Clock className="w-4 h-4 mb-1" style={{ color: '#1A7A8A' }} />
            <p className="text-xs font-medium" style={{ color: '#3D2A18', opacity: 0.7, fontFamily: 'Hind Siliguri' }}>
              <span className="hi-text">अनुमानित समय</span>
              <span className="en-text">Est. Time</span>
            </p>
            <p className="text-sm font-bold" style={{ color: '#1A1208', fontFamily: "'Playfair Display', serif" }}>{estimatedTime}</p>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(232,130,10,0.08)', border: '1px solid rgba(232,130,10,0.2)' }}>
            <FileText className="w-4 h-4 mb-1" style={{ color: '#E8820A' }} />
            <p className="text-xs font-medium" style={{ color: '#3D2A18', opacity: 0.7, fontFamily: 'Hind Siliguri' }}>
              <span className="hi-text">प्राथमिकता</span>
              <span className="en-text">Priority</span>
            </p>
            <p className="text-sm font-bold" style={{ color: currentPriority.color, fontFamily: "'Playfair Display', serif" }}>
              <span className="hi-text">{currentPriority.hiLabel}</span>
              <span className="en-text">{currentPriority.label}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
