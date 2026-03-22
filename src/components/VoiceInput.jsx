import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, RotateCcw, Loader2, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * VoiceInput — Working voice input using Web Speech API.
 * Oil Painting palette: primary (#C4440A), fire (#D42E18), amber (#E8820A).
 */
export default function VoiceInput({ onTranscript, language = 'hi' }) {
  const [status, setStatus] = useState('inactive');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) setIsSupported(false);
  }, []);

  const initRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => setStatus('recording');

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript + ' ';
        else interimText += result[0].transcript;
      }
      if (finalText) {
        setTranscript(prev => {
          const updated = prev + finalText;
          onTranscript?.(updated.trim());
          return updated;
        });
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error !== 'aborted') setStatus('inactive');
    };

    recognition.onend = () => {
      setStatus('inactive');
      setInterimTranscript('');
    };

    return recognition;
  }, [language, onTranscript]);

  const startRecording = () => {
    if (!isSupported) return;
    const recognition = initRecognition();
    if (recognition) { recognitionRef.current = recognition; recognition.start(); }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      setStatus('processing');
      recognitionRef.current.stop();
      setTimeout(() => setStatus('inactive'), 500);
    }
  };

  const toggleRecording = () => {
    if (status === 'recording') stopRecording();
    else startRecording();
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    onTranscript?.('');
  };

  if (!isSupported) {
    return (
      <div className="p-6 rounded-lg text-center" style={{ background: 'rgba(212,46,24,0.08)', border: '1px solid rgba(212,46,24,0.2)' }}>
        <MicOff className="w-8 h-8 mx-auto mb-3" style={{ color: '#D42E18' }} />
        <p className="text-sm font-medium" style={{ color: '#D42E18', fontFamily: 'Hind Siliguri, sans-serif' }}>
          <span className="hi-text">आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता</span>
          <span className="en-text">Your browser does not support voice input</span>
        </p>
        <p className="text-xs mt-1" style={{ color: '#3D2A18', opacity: 0.6 }}>
          <span className="hi-text">कृपया Chrome या Edge ब्राउज़र का उपयोग करें</span>
          <span className="en-text">Please use Chrome or Edge browser</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <motion.button
          onClick={toggleRecording}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4"
          style={{
            width: 80,
            height: 80,
            background: status === 'recording'
              ? '#D42E18'
              : status === 'processing'
              ? '#3D2A18'
              : '#C4440A',
            color: '#FDECC8',
            boxShadow: status === 'recording'
              ? '0 0 0 0 rgba(212,46,24,0.4)'
              : '0 4px 14px -3px rgba(196,68,10,0.4)',
            animation: status === 'recording' ? 'recordingPulse 1.5s ease-in-out infinite' : 'none',
            cursor: status === 'processing' ? 'wait' : 'pointer',
          }}
          aria-label={status === 'recording' ? 'Stop recording' : 'Start voice recording'}
          disabled={status === 'processing'}
        >
          {status === 'recording' ? (
            <StopCircle className="w-8 h-8" />
          ) : status === 'processing' ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
          {status === 'recording' && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(212,46,24,0.2)' }} />
              <span className="absolute inset-[-8px] rounded-full" style={{ border: '2px solid rgba(212,46,24,0.3)', animation: 'recordingPulse 1.5s ease-in-out infinite 0.5s' }} />
            </>
          )}
        </motion.button>

        <p className="text-sm font-medium" style={{ color: status === 'recording' ? '#D42E18' : '#3D2A18', fontFamily: 'Hind Siliguri, sans-serif' }}>
          {status === 'recording' ? (
            <>
              <span className="hi-text">🔴 रिकॉर्डिंग... रुकने के लिए क्लिक करें</span>
              <span className="en-text">🔴 Recording... Click to stop</span>
            </>
          ) : status === 'processing' ? (
            <>
              <span className="hi-text">प्रोसेसिंग...</span>
              <span className="en-text">Processing...</span>
            </>
          ) : (
            <>
              <span className="hi-text">🎤 बोलकर शिकायत दर्ज करें</span>
              <span className="en-text">🎤 Speak to file your complaint</span>
            </>
          )}
        </p>
      </div>

      <AnimatePresence>
        {status === 'recording' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center gap-1 py-3"
            aria-hidden="true"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="waveform-bar w-1 rounded-full" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {(transcript || interimTranscript) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg"
          style={{
            background: '#FDECC8',
            border: '1.5px solid rgba(232,130,10,0.25)',
            minHeight: 80,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: '#3D2A18', opacity: 0.6, fontFamily: 'Hind Siliguri' }}>
              <span className="hi-text">ट्रांसक्रिप्शन</span>
              <span className="en-text">Transcription</span>
            </span>
            <button
              onClick={clearTranscript}
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors"
              style={{ color: '#D42E18' }}
              aria-label="Clear transcription"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hi-text">साफ़ करें</span>
              <span className="en-text">Clear</span>
            </button>
          </div>
          <p className="text-base leading-relaxed" style={{ color: '#1A1208', fontFamily: 'Hind Siliguri, sans-serif' }}>
            {transcript}
            {interimTranscript && (
              <span style={{ color: '#3D2A18', opacity: 0.5, fontStyle: 'italic' }}>{interimTranscript}</span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
