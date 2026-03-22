import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Copy, Share2, Download, X } from 'lucide-react';
import { useState } from 'react';

/**
 * SuccessModal — Animated success modal after complaint submission.
 * Oil Painting palette: cream bg, primary (#C4440A), gold (#F5B830), success green.
 */
export default function SuccessModal({ isOpen, onClose, complaintId = 'JV-28451', complaintTitle = '' }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = complaintId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareComplaint = async () => {
    const text = `My grievance has been filed on JanVaani.\nComplaint ID: ${complaintId}\nTrack: https://janvaani.gov.in/track/${complaintId}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'JanVaani Complaint', text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      alert('Share link copied to clipboard!');
    }
  };

  const downloadReceipt = () => {
    const receipt = `
═══════════════════════════════════════
       JanVaani जनवाणी — Receipt
═══════════════════════════════════════

Complaint ID:  ${complaintId}
Title:         ${complaintTitle || 'Citizen Grievance'}
Date:          ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
Time:          ${new Date().toLocaleTimeString('en-IN')}
Status:        Submitted ✓

═══════════════════════════════════════
Track your complaint at:
https://janvaani.gov.in/track/${complaintId}
═══════════════════════════════════════
    `.trim();

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JanVaani_Receipt_${complaintId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(26,18,8,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Complaint submitted successfully"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md rounded-lg p-8 text-center"
            style={{
              background: '#FDECC8',
              border: '1.5px solid rgba(232,130,10,0.3)',
              boxShadow: '0 25px 65px -15px rgba(26,18,8,0.35)',
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg transition-colors"
              style={{ color: '#3D2A18' }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Animated checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="mx-auto mb-6 flex items-center justify-center"
              style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(4,120,87,0.1)',
                border: '3px solid #047857',
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 className="w-10 h-10" style={{ color: '#047857' }} />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-2" style={{ color: '#047857', fontFamily: "'Playfair Display', serif" }}>
                <span className="hi-text">शिकायत सफलतापूर्वक दर्ज!</span>
                <span className="en-text">Complaint Filed Successfully!</span>
              </h2>
              <p className="text-sm mb-6" style={{ color: '#3D2A18', fontFamily: 'Hind Siliguri, sans-serif' }}>
                <span className="hi-text">आपकी शिकायत दर्ज कर ली गई है और AI प्रोसेसिंग में है।</span>
                <span className="en-text">Your complaint has been registered and is being processed by AI.</span>
              </p>
            </motion.div>

            {/* Complaint ID */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6 p-4 rounded-lg"
              style={{ background: 'rgba(232,130,10,0.08)', border: '2px dashed rgba(232,130,10,0.3)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: '#3D2A18', opacity: 0.6, fontFamily: 'Hind Siliguri' }}>
                <span className="hi-text">शिकायत आईडी</span>
                <span className="en-text">Complaint ID</span>
              </p>
              <p className="text-2xl font-bold tracking-wider" style={{ color: '#C4440A', fontFamily: "'Playfair Display', serif" }}>
                {complaintId}
              </p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-3 justify-center flex-wrap"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-md transition-all"
                style={{
                  background: copied ? 'rgba(4,120,87,0.1)' : 'rgba(232,130,10,0.08)',
                  color: copied ? '#047857' : '#1A1208',
                  border: `1px solid ${copied ? 'rgba(4,120,87,0.3)' : 'rgba(232,130,10,0.25)'}`,
                  fontFamily: 'Hind Siliguri, sans-serif',
                }}
              >
                <Copy className="w-4 h-4" />
                {copied ? (
                  <><span className="hi-text">कॉपी हो गया!</span><span className="en-text">Copied!</span></>
                ) : (
                  <><span className="hi-text">कॉपी करें</span><span className="en-text">Copy ID</span></>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={shareComplaint}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-md transition-all"
                style={{ background: 'rgba(232,130,10,0.08)', color: '#1A1208', border: '1px solid rgba(232,130,10,0.25)', fontFamily: 'Hind Siliguri' }}
              >
                <Share2 className="w-4 h-4" />
                <span className="hi-text">शेयर</span>
                <span className="en-text">Share</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadReceipt}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-md transition-all"
                style={{ background: 'rgba(232,130,10,0.08)', color: '#1A1208', border: '1px solid rgba(232,130,10,0.25)', fontFamily: 'Hind Siliguri' }}
              >
                <Download className="w-4 h-4" />
                <span className="hi-text">रसीद</span>
                <span className="en-text">Receipt</span>
              </motion.button>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="btn-primary w-full mt-6 text-sm"
            >
              <span className="hi-text">बंद करें</span>
              <span className="en-text">Done</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
