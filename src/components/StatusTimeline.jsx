import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Loader2, Circle } from 'lucide-react';

/**
 * StatusTimeline — Vertical animated timeline showing complaint progress.
 * Oil Painting palette: success green, amber active, cream text.
 */
export default function StatusTimeline({ steps = defaultSteps }) {
  return (
    <div className="relative" role="list" aria-label="Complaint Status Timeline">
      {steps.map((step, index) => {
        const isCompleted = step.status === 'completed';
        const isActive = step.status === 'active';
        const isLast = index === steps.length - 1;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4, ease: 'easeOut' }}
            className="relative flex gap-4 pb-8"
            role="listitem"
          >
            {!isLast && (
              <div
                className="absolute left-[19px] top-[40px] w-[2px]"
                style={{
                  height: 'calc(100% - 32px)',
                  background: isCompleted
                    ? 'linear-gradient(180deg, #047857, #047857)'
                    : isActive
                    ? 'linear-gradient(180deg, #047857, rgba(232,130,10,0.25))'
                    : 'rgba(232,130,10,0.2)',
                  transition: 'background 0.5s ease',
                }}
              />
            )}

            <div className="relative z-10 flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: isCompleted
                    ? 'rgba(4,120,87,0.1)'
                    : isActive
                    ? 'rgba(232,130,10,0.1)'
                    : '#FDECC8',
                  border: `2px solid ${
                    isCompleted ? '#047857' : isActive ? '#E8820A' : 'rgba(232,130,10,0.25)'
                  }`,
                  boxShadow: isActive ? '0 0 0 4px rgba(232,130,10,0.15)' : 'none',
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#047857' }} />
                ) : isActive ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#E8820A' }} />
                  </motion.div>
                ) : (
                  <Circle className="w-5 h-5" style={{ color: 'rgba(61,42,24,0.3)' }} />
                )}
              </div>
            </div>

            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: isCompleted ? '#047857' : isActive ? '#E8820A' : 'rgba(61,42,24,0.5)',
                    fontFamily: 'Hind Siliguri, sans-serif',
                  }}
                >
                  <span className="hi-text">{step.hiLabel}</span>
                  <span className="en-text">{step.label}</span>
                </p>
                {isActive && (
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-sm"
                    style={{ background: 'rgba(232,130,10,0.12)', color: '#E8820A', border: '1px solid rgba(232,130,10,0.3)' }}
                  >
                    <span className="hi-text">प्रगति पर</span>
                    <span className="en-text">In Progress</span>
                  </span>
                )}
              </div>
              {step.timestamp && (
                <p className="text-xs mt-1" style={{ color: '#3D2A18', opacity: 0.5, fontFamily: 'Hind Siliguri' }}>{step.timestamp}</p>
              )}
              {step.description && (
                <p className="text-xs mt-1" style={{ color: '#3D2A18', opacity: 0.7, lineHeight: 1.5, fontFamily: 'Hind Siliguri' }}>
                  <span className="hi-text">{step.hiDescription || step.description}</span>
                  <span className="en-text">{step.description}</span>
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

const defaultSteps = [
  { label: 'Submitted', hiLabel: 'दर्ज़ की गई', status: 'completed', timestamp: '22 Mar 2026, 10:30 AM', description: 'Complaint filed successfully', hiDescription: 'शिकायत सफलतापूर्वक दर्ज की गई' },
  { label: 'AI Processing', hiLabel: 'AI प्रोसेसिंग', status: 'completed', timestamp: '22 Mar 2026, 10:31 AM', description: 'Categorized & priority assigned', hiDescription: 'श्रेणीबद्ध और प्राथमिकता निर्धारित' },
  { label: 'Admin Dashboard', hiLabel: 'प्रशासन डैशबोर्ड', status: 'active', timestamp: '22 Mar 2026, 10:35 AM', description: 'Under review by district admin', hiDescription: 'जिला प्रशासक द्वारा समीक्षा जारी' },
  { label: 'Action Taken', hiLabel: 'कार्रवाई', status: 'pending', description: 'Awaiting field team dispatch', hiDescription: 'फील्ड टीम की प्रतीक्षा' },
  { label: 'Verified & Closed', hiLabel: 'सत्यापित और बंद', status: 'pending', description: 'Proof-of-work verification', hiDescription: 'कार्य-प्रमाण सत्यापन' },
];
