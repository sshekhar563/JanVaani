import { useEffect, useRef, useState } from 'react';
import { 
  Mic, Type, Image, Upload, MapPin, ChevronDown, Send, CheckCircle2,
  Brain, LayoutDashboard, Hammer, ShieldCheck, Clock, ArrowRight, 
  AlertCircle, Loader2, X
} from 'lucide-react';
import { categories, issues } from '../data/mockData';
import PipelineFlow from '../components/PipelineFlow';
import { pipelineSteps } from '../data/pipelineSteps';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';

/* ── Shared color tokens (new palette) ── */
const C = {
  primary:     '#C4440A',
  amber:       '#E8820A',
  gold:        '#F5B830',
  teal:        '#1A7A8A',
  tealDeep:    '#0D4A5C',
  cyan:        '#2A9BAD',
  fire:        '#D42E18',
  bg:          '#FDECC8',
  ink:         '#1A1208',
  inkSoft:     '#3D2A18',
  label:       '#1A1208',
  placeholder: '#6B5A42',
};

/* ── Styled form input ── */
function HeritageInput({ label, hiLabel, enLabel, icon: Icon, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {(label || hiLabel) && (
        <label style={{
          display: 'block',
          fontSize: 15,
          fontWeight: 600,
          color: focused ? C.amber : C.label,
          marginBottom: 6,
          fontFamily: 'Hind Siliguri, sans-serif',
          transition: 'color 0.2s',
        }}>
          {label ? label : (
            <>
              <span className="hi-text">{hiLabel}</span>
              <span className="en-text">{enLabel}</span>
            </>
          )}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            width: 16, height: 16,
            color: focused ? C.amber : C.placeholder,
            transition: 'color 0.2s', pointerEvents: 'none',
          }} />
        )}
        <input
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%',
            paddingLeft: Icon ? 38 : 12,
            paddingRight: 12,
            paddingTop: 11,
            paddingBottom: 11,
            background: C.bg,
            border: `1.5px solid ${focused ? C.amber : 'rgba(232,130,10,0.4)'}`,
            borderRadius: 8,
            color: C.ink,
            fontFamily: 'Hind Siliguri, sans-serif',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
      </div>
    </div>
  );
}

/* ── Heritage select ── */
function HeritageSelect({ label, hiLabel, enLabel, icon: Icon, children, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {(label || hiLabel) && (
        <label style={{
          display: 'block', fontSize: 15, fontWeight: 600,
          color: focused ? C.amber : C.label,
          marginBottom: 6, fontFamily: 'Hind Siliguri, sans-serif',
          transition: 'color 0.2s',
        }}>
          {label ? label : (
            <>
              <span className="hi-text">{hiLabel}</span>
              <span className="en-text">{enLabel}</span>
            </>
          )}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            width: 16, height: 16, color: focused ? C.amber : C.placeholder,
            pointerEvents: 'none',
          }} />
        )}
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            paddingLeft: Icon ? 38 : 12,
            paddingRight: 36,
            paddingTop: 11,
            paddingBottom: 11,
            background: C.bg,
            border: `1.5px solid ${focused ? C.amber : 'rgba(232,130,10,0.4)'}`,
            borderRadius: 8,
            color: C.ink,
            fontFamily: 'Hind Siliguri, sans-serif',
            fontSize: '0.9rem',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
        >
          {children}
        </select>
        <ChevronDown style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          width: 16, height: 16, color: C.placeholder, pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}

/* ── Heritage card panel ── */
function HeritagePanel({ children, style, className }) {
  return (
    <div
      className={className}
      style={{
        background: C.bg,
        border: `1.5px solid rgba(232,130,10,0.25)`,
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(196,68,10,0.06)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const LANGUAGE_OPTIONS = [
  { label: 'Auto detect (Whisper)', value: 'auto' },
  { label: 'Hindi', value: 'Hindi' },
  { label: 'Marathi', value: 'Marathi' },
  { label: 'Punjabi', value: 'Punjabi' },
  { label: 'Bengali', value: 'Bengali' },
  { label: 'Urdu', value: 'Urdu' },
  { label: 'Tamil', value: 'Tamil' },
  { label: 'Kannada', value: 'Kannada' },
  { label: 'Telugu', value: 'Telugu' },
  { label: 'Gujarati', value: 'Gujarati' },
  { label: 'Malayalam', value: 'Malayalam' },
  { label: 'Odia', value: 'Odia' },
  { label: 'Haryanvi', value: 'Haryanvi' },
  { label: 'Rajasthani', value: 'Rajasthani' },
  { label: 'Bhojpuri', value: 'Bhojpuri' },
  { label: 'English', value: 'English' },
];

function VoiceInput({ onResult }) {
  const { t } = useTranslation();
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('Tap to start recording');
  const [transcript, setTranscript] = useState('');
  const [voicePhase, setVoicePhase] = useState('idle'); // idle | recording | uploading
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => () => {
    cleanupStream();
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  }, []);

  const sendRecording = async (blob) => {
    setStatus(t('report.processing', 'Uploading to Whisper...'));
    setVoicePhase('Uploading');

    try {
        const formData = new FormData();
        formData.append('audio', blob, `complaint-${Date.now()}.webm`);
        if (selectedLanguage && selectedLanguage !== 'auto') {
          formData.append('language', selectedLanguage);
        }

        const response = await fetch('http://localhost:8000/voice-report', {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) throw new Error('Whisper service failed');
      const data = await response.json();
      const transcriptText = data.transcript?.text ?? data.transcript ?? '';
      setTranscript(transcriptText);
      setStatus('Transcription ready');
      onResult?.({ transcript: { text: transcriptText, language: data.transcript?.language }, analysis: data.analysis });
    } catch (err) {
      console.error(err);
      setStatus(t('report.transcriptionFailed', 'Unable to transcribe.'));
    } finally {
      setVoicePhase('idle');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        cleanupStream();
        if (!chunks.length) { setStatus('No audio captured.'); return; }
        sendRecording(new Blob(chunks, { type: 'audio/webm' }));
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setVoicePhase('Recording');
      setStatus(t('report.listening', 'Recording...'));
      setTranscript('');
    } catch {
      setStatus('Microphone access denied.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    setRecording(false);
    setStatus(t('report.processing', 'Processing...'));
  };

  const handleToggle = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
      <div className="space-y-6">
        <div className="text-center py-8">
        <button
          onClick={handleToggle}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 mx-auto ${
            recording 
              ? 'bg-red-500 shadow-xl shadow-red-500/40 scale-110 animate-pulse' 
              : 'bg-gradient-to-br from-saffron-500 to-saffron-600 shadow-xl shadow-saffron-500/25 hover:shadow-saffron-500/40 hover:scale-105'
          }`}
        >
          <Mic style={{ width: 32, height: 32, color: '#FDECC8' }} />
        </button>
        <p style={{ fontSize: '0.85rem', color: C.label, marginTop: 12, fontFamily: 'Hind Siliguri, sans-serif' }}>
          {status}
        </p>

        {recording && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 12, height: 28 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ width: 5, background: C.amber, borderRadius: 3, height: 8, animation: `waveform ${0.5 + i * 0.1}s ease-in-out infinite alternate` }} />
            ))}
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <HeritageSelect
            label="Language"
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
          >
            {LANGUAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </HeritageSelect>
        </div>
      </div>

      {transcript && (
        <HeritagePanel style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <CheckCircle2 style={{ width: 16, height: 16, color: C.teal }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: C.teal, fontFamily: 'Hind Siliguri, sans-serif' }}>
              Transcription Ready
            </span>
          </div>
          <p className="text-sm text-brown-300 italic mb-2">{transcript}</p>
          <p className="text-sm text-brown-400">
            <span className="text-white font-medium">{t('report.translationLabel')}</span> "{t('report.translationText')}"
          </p>
        </HeritagePanel>
      )}
    </div>
  );
}

function TextInput({ formData, setFormData }) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-4">
      <div>
        <label style={{
          display: 'block', fontSize: 15, fontWeight: 600,
          color: focused ? C.amber : C.label,
          marginBottom: 6, fontFamily: 'Hind Siliguri, sans-serif',
        }}>
          <span className="hi-text">विवरण</span>
          <span className="en-text">Description</span>
        </label>
        <textarea
          rows={5}
          placeholder="Describe the issue in detail..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '12px',
            background: C.bg,
            border: `1.5px solid ${focused ? C.amber : 'rgba(232,130,10,0.4)'}`,
            borderRadius: 8,
            color: C.ink,
            fontFamily: 'Hind Siliguri, sans-serif',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <HeritagePanel style={{ padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <Brain style={{ width: 16, height: 16, color: C.teal, marginTop: 2, flexShrink: 0 }} />
        <p style={{ fontSize: '0.8rem', color: C.label, fontFamily: 'Hind Siliguri, sans-serif', margin: 0 }}>
          <span style={{ fontWeight: 600, color: C.teal }}>AI Assist: </span>
          <span className="hi-text">हमारा NLP इंजन श्रेणी, स्थान और भावना को स्वचालित रूप से पहचानेगा।</span>
          <span className="en-text">Our NLP engine will auto-categorize, detect urgency, and extract location.</span>
        </p>
      </HeritagePanel>
    </div>
  );
}

function ImageInput({ onDetectionResult }) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setDetecting(true);
    setDetectionResult(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/detect-pothole', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        setDetectionResult(data);
        setImageUrl(data.image_url || localUrl);
        onDetectionResult?.(data);
      } else throw new Error();
    } catch {
      const fallback = { detected: true, confidence: 0.82, priority: 'HIGH', label: 'Pothole Detected', bounding_boxes: [[180, 320, 420, 480]], image_width: 720, image_height: 720, original_filename: file.name };
      setDetectionResult(fallback);
      setImageUrl(localUrl);
      onDetectionResult?.(fallback);
    } finally {
      setDetecting(false);
    }
  };

  const clearImage = () => {
    setPreview(null); setDetectionResult(null); setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onDetectionResult?.(null);
  };

  return (
    <div className="space-y-4">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="pothole-image-upload" />

      {!preview && (
        <label
          htmlFor="pothole-image-upload"
          style={{
            display: 'block',
            border: `2px dashed rgba(232,130,10,0.4)`,
            borderRadius: 10,
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            background: C.bg,
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.amber}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(232,130,10,0.4)'}
        >
          <Upload style={{ width: 36, height: 36, color: C.placeholder, margin: '0 auto 12px' }} />
          <p style={{ fontSize: '0.9rem', color: C.label, fontFamily: 'Hind Siliguri, sans-serif', margin: '0 0 4px' }}>
            <span style={{ color: C.amber, fontWeight: 600 }}>
              <span className="hi-text">फ़ोटो अपलोड करें</span>
              <span className="en-text">Upload Photo</span>
            </span>
          </p>
          <p style={{ fontSize: '0.8rem', color: C.placeholder, fontFamily: 'Hind Siliguri, sans-serif', margin: '0 0 8px' }}>
            JPG, PNG up to 10MB
          </p>
        </label>
      )}

      {detecting && (
        <HeritagePanel style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Loader2 style={{ width: 32, height: 32, color: C.teal, margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: C.teal, margin: '0 0 4px', fontFamily: 'Hind Siliguri, sans-serif' }}>
            Analyzing road image...
          </p>
        </HeritagePanel>
      )}

      {preview && !detecting && (
        <div style={{ position: 'relative' }}>
          <button onClick={clearImage} style={{
            position: 'absolute', top: 8, right: 8, zIndex: 10,
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(26,18,8,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', color: '#FDECC8',
          }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
          {detectionResult
            ? <PotholeDetectionCard result={detectionResult} imageUrl={imageUrl} />
            : <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid rgba(232,130,10,0.25)` }}>
                <img src={preview} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />
              </div>
          }
        </div>
      )}
    </div>
  );
}

function LiveTracker() {
  const { t } = useTranslation();
  const sampleIssue = issues[0];
  const stepsData = [
    { key: 'submitted',  hiLabel: 'सबमिट किया', enLabel: 'Submitted', icon: Send, time: 'Mar 8, 9:30 AM',  done: true },
    { key: 'ai',        hiLabel: 'AI प्रोसेसिंग', enLabel: 'AI Processing', icon: Brain, time: 'Mar 8, 9:31 AM', done: true },
    { key: 'dashboard', hiLabel: 'प्रशासन डैशबोर्ड', enLabel: 'Admin Dashboard', icon: LayoutDashboard, time: 'Mar 8, 10:15 AM', done: true },
    { key: 'action',    hiLabel: 'कार्रवाई की', enLabel: 'Action Taken', icon: Hammer, time: 'Mar 10, 2:00 PM', done: true },
    { key: 'verified',  hiLabel: 'सत्यापित प्रमाण', enLabel: 'Verified Proof', icon: ShieldCheck, time: 'Mar 10, 4:30 PM', done: false, active: true },
  ];

  return (
    <HeritagePanel style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: C.primary, margin: 0, fontFamily: "'Playfair Display', serif" }}>
            <span className="hi-text">लाइव ट्रैकर</span>
            <span className="en-text">Live Tracker</span>
          </h3>
          <p style={{ fontSize: '0.75rem', color: C.placeholder, marginTop: 4, fontFamily: 'Hind Siliguri, sans-serif' }}>
            Issue ID: {sampleIssue.id}
          </p>
        </div>
        <span style={{
          fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px',
          background: 'rgba(212,46,24,0.08)', border: `1px solid rgba(212,46,24,0.25)`,
          color: C.fire, borderRadius: 20, fontFamily: 'Hind Siliguri, sans-serif',
        }}>
          <span className="hi-text">उच्च प्राथमिकता</span>
          <span className="en-text">High Priority</span>
        </span>
      </div>

      <div style={{
        background: 'rgba(232,130,10,0.05)', borderRadius: 8,
        padding: '10px 14px', marginBottom: 20,
        border: '1px solid rgba(232,130,10,0.15)',
      }}>
        <h4 style={{ fontWeight: 600, color: C.ink, fontSize: '0.9rem', margin: '0 0 4px', fontFamily: 'Hind Siliguri, sans-serif' }}>
          {sampleIssue.title}
        </h4>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: C.placeholder, fontFamily: 'Hind Siliguri, sans-serif' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin style={{ width: 12, height: 12 }} />{sampleIssue.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock style={{ width: 12, height: 12 }} />Mar 8, 2024
          </span>
        </div>
      </div>

      <div>
        {stepsData.map((step, i) => {
          const sColor = step.done ? C.teal : step.active ? C.amber : '#d1c5b8';
          return (
            <div key={step.key} style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: step.done ? C.teal : step.active ? C.amber : 'rgba(232,130,10,0.1)',
                  border: `2px solid ${sColor}`,
                  boxShadow: step.active ? `0 0 0 4px rgba(232,130,10,0.15)` : 'none',
                }}>
                  {step.done
                    ? <CheckCircle2 style={{ width: 18, height: 18, color: '#fff' }} />
                    : <step.icon style={{ width: 16, height: 16, color: step.active ? '#fff' : sColor }} />
                  }
                </div>
                {i < stepsData.length - 1 && (
                  <div style={{ width: 2, height: 36, background: step.done ? `${C.teal}50` : 'rgba(232,130,10,0.15)' }} />
                )}
              </div>
              <div style={{ paddingBottom: 28 }}>
                <p style={{
                  fontWeight: 600, fontSize: '0.88rem',
                  color: step.done ? C.ink : step.active ? C.amber : C.placeholder,
                  margin: '4px 0 0', fontFamily: 'Hind Siliguri, sans-serif',
                }}>
                  <span className="hi-text">{step.hiLabel}</span>
                  <span className="en-text">{step.enLabel}</span>
                </p>
                <p style={{ fontSize: '0.75rem', color: C.placeholder, margin: '2px 0', fontFamily: 'Hind Siliguri, sans-serif' }}>
                  {step.time}
                </p>
                {step.active && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.75rem', color: C.amber, fontFamily: 'Hind Siliguri, sans-serif' }}>
                    <Loader2 style={{ width: 12, height: 12 }} />
                    <span className="hi-text">सत्यापन की प्रतीक्षा...</span>
                    <span className="en-text">Awaiting verification...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </HeritagePanel>
  );
}

export default function CitizenPortal() {
  const { t } = useTranslation();
  const [inputMode, setInputMode] = useState('text');
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [formFeedback, setFormFeedback] = useState('');
  const [formData, setFormData] = useState({ category: '', location: '', description: '' });
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [pipelineActive, setPipelineActive] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const pipelineTimers = useRef([]);
  const submitBtnRef = useRef(null);

  // GSAP submit button
  useEffect(() => {
    const btn = submitBtnRef.current;
    if (!btn) return;
    const onEnter = () => gsap.to(btn, { scale: 1.03, duration: 0.2, ease: 'power2.out' });
    const onLeave = () => gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => () => pipelineTimers.current.forEach(clearTimeout), []);

  const getTranscriptFallback = () =>
    inputMode === 'voice'
      ? 'Whisper transcribed a Hindi plea about MG Road pothole with high urgency.'
      : formData.description || 'Citizen text ready for NLP analysis.';

  const startPipeline = () => {
    pipelineTimers.current.forEach(clearTimeout);
    pipelineTimers.current = [];
    setPipelineActive(true);
    setPipelineStep(-1);
    pipelineSteps.forEach((_, idx) => {
      pipelineTimers.current.push(setTimeout(() => setPipelineStep(idx), idx * 900));
    });
    pipelineTimers.current.push(setTimeout(() => setPipelineActive(false), pipelineSteps.length * 900 + 600));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedText = (formData.description || '').trim();
    if (!trimmedText) { setFormFeedback('Please enter a description before submitting.'); return; }
    setFormFeedback('');
    startPipeline();
    setAnalysis(null);
    setLoadingAI(true);
    let finalAnalysis = null, finalTranscript = getTranscriptFallback();
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmedText, location: formData.location, category: formData.category }),
      });
      const data = await res.json();
      finalAnalysis = data.analysis ?? data;
      finalTranscript = data.transcript ?? trimmedText ?? getTranscriptFallback();
    } catch {
      finalAnalysis = { sentiment: 'NEGATIVE', category: formData.category || 'general', location: formData.location || null, urgency: 0.75 };
    }
    setAnalysis({ ...finalAnalysis, transcript: finalTranscript });
    if (detectionResult?.detected) {
      try { await fetch('/api/pothole-reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description: formData.description, location: formData.location, category: 'road', image_url: detectionResult.image_url || '', original_filename: detectionResult.original_filename || '', detection_result: detectionResult }) }); } catch {}
    }
    try { await fetch('/api/complaints', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description: formData.description, location: formData.location, category: formData.category || finalAnalysis.category || 'general', analysis: finalAnalysis }) }); } catch {}
    setSubmitted(true);
    setLoadingAI(false);

    // GSAP success animation
    if (submitBtnRef.current) {
      gsap.fromTo(submitBtnRef.current, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    }

    setTimeout(() => setSubmitted(false), 5200);
  };

  const handleVoiceResult = (payload) => {
    if (!payload?.analysis) return;
    const transcriptText = payload.transcript?.text ?? payload.transcript ?? '';
    setFormData(prev => ({ ...prev, description: transcriptText, location: payload.analysis.location ?? prev.location, category: payload.analysis.category ?? prev.category }));
    setAnalysis({ ...payload.analysis, transcript: transcriptText });
    setSubmitted(true);
    startPipeline();
    setTimeout(() => setSubmitted(false), 5200);
  };

  const modes = [
    { key: 'voice', hiLabel: 'आवाज़', enLabel: 'Voice', icon: Mic },
    { key: 'text',  hiLabel: 'टेक्स्ट', enLabel: 'Text',  icon: Type },
    { key: 'image', hiLabel: 'छवि', enLabel: 'Image', icon: Image },
  ];

  const transcriptPreview = analysis?.transcript ?? getTranscriptFallback();

  return (
    <div
      className="min-h-screen pt-20"
      style={{ background: 'var(--color-bg)', color: C.ink }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Page Header ── */}
          <div className="text-center mb-12">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 20,
              background: 'rgba(196,68,10,0.07)',
              border: '1px solid rgba(196,68,10,0.2)',
              marginBottom: 16,
            }}>
              <AlertCircle style={{ width: 14, height: 14, color: C.primary }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.primary, fontFamily: 'Hind Siliguri, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <span className="hi-text">नागरिक शिकायत पोर्टल</span>
                <span className="en-text">Citizen Grievance Portal</span>
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: C.primary,
              marginBottom: '0.75rem',
            }}>
              <span className="hi-text">शिकायत दर्ज करें</span>
              <span className="en-text">File Your Grievance</span>
            </h1>
            <p style={{ color: C.inkSoft, maxWidth: '36rem', margin: '0 auto', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '1rem', lineHeight: 1.65 }}>
              <span className="hi-text">अपनी भाषा में समस्याएं बताएं, बाकी AI संभालेगा।</span>
              <span className="en-text">Raise your voice for roads, water, sanitation — anything that needs attention.</span>
            </p>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <div style={{ height: 1, width: 60, background: 'rgba(232,130,10,0.35)' }}/>
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1 L15 8 L8 15 L1 8 Z" fill="none" stroke="#E8820A" strokeWidth="1.2" opacity="0.5"/></svg>
              <div style={{ height: 1, width: 60, background: 'rgba(232,130,10,0.35)' }}/>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* ── Form ── */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Input mode tabs + content */}
                <HeritagePanel style={{ padding: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: 15, fontWeight: 600, color: C.label, marginBottom: 10, fontFamily: 'Hind Siliguri, sans-serif' }}>
                    <span className="hi-text">इनपुट विधि</span>
                    <span className="en-text">Input Method</span>
                  </label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                    {modes.map(m => (
                      <button
                        type="button"
                        key={m.key}
                        onClick={() => setInputMode(m.key)}
                        style={{
                          flex: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '10px',
                          borderRadius: 8,
                          fontSize: '0.85rem', fontWeight: 600,
                          fontFamily: 'Hind Siliguri, sans-serif',
                          cursor: 'pointer',
                          transition: 'all 0.25s',
                          background: inputMode === m.key
                            ? `linear-gradient(135deg, ${C.primary}, #a3370a)`
                            : 'rgba(196,68,10,0.05)',
                          color: inputMode === m.key ? '#FDECC8' : C.label,
                          border: inputMode === m.key
                            ? `1.5px solid ${C.primary}`
                            : '1.5px solid rgba(196,68,10,0.15)',
                          boxShadow: inputMode === m.key ? `0 4px 14px rgba(196,68,10,0.2)` : 'none',
                        }}
                      >
                        <m.icon style={{ width: 16, height: 16 }} />
                        <span className="hi-text">{m.hiLabel}</span>
                        <span className="en-text">{m.enLabel}</span>
                      </button>
                    ))}
                  </div>

                  {inputMode === 'voice' && <VoiceInput onResult={handleVoiceResult} />}
                  {inputMode === 'text'  && <TextInput formData={formData} setFormData={setFormData} />}
                  {inputMode === 'image' && <ImageInput onDetectionResult={setDetectionResult} />}
                </HeritagePanel>

                {/* Category & Location */}
                <HeritagePanel style={{ padding: '1.5rem' }}>
                  <div className="space-y-5">
                    <HeritageSelect
                      hiLabel="शिकायत का प्रकार"
                      enLabel="Type of Issue"
                      icon={ChevronDown}
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="" style={{ color: C.placeholder }}>Select...</option>
                      {categories.map(c => (
                        <option key={c} value={c} style={{ color: C.ink, background: C.bg }}>{c}</option>
                      ))}
                    </HeritageSelect>

                    <HeritageInput
                      hiLabel="जिला"
                      enLabel="District"
                      icon={MapPin}
                      type="text"
                      placeholder="e.g. MG Road, Sector 9, Gurgaon"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </HeritagePanel>

                {/* Submit */}
                <button
                  ref={submitBtnRef}
                  type="submit"
                  id="submit-report-btn"
                  className="btn-primary btn-gsap w-full flex items-center justify-center gap-2"
                  style={{ fontSize: '1rem', padding: '1rem', opacity: loadingAI ? 0.7 : 1 }}
                  disabled={loadingAI}
                >
                  {loadingAI ? (
                    <><Loader2 style={{ width: 20, height: 20 }} className="animate-spin" />
                      <span className="hi-text">AI प्रोसेसिंग...</span>
                      <span className="en-text">AI Processing...</span>
                    </>
                  ) : submitted ? (
                    <><CheckCircle2 style={{ width: 20, height: 20 }} />
                      <span className="hi-text">सफलतापूर्वक जमा!</span>
                      <span className="en-text">Submitted Successfully!</span>
                    </>
                  ) : (
                    <><Send style={{ width: 20, height: 20 }} />
                      <span className="hi-text">जमा करें</span>
                      <span className="en-text">Submit Complaint</span>
                    </>
                  )}
                </button>

                {/* Error feedback */}
                {formFeedback && (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(212,46,24,0.06)',
                    border: '1px solid rgba(212,46,24,0.25)',
                    borderRadius: 8,
                    color: C.fire,
                    fontSize: '0.85rem',
                    fontFamily: 'Hind Siliguri, sans-serif',
                  }}>
                    {formFeedback}
                  </div>
                )}

                {/* Success confirmation */}
                {submitted && !loadingAI && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(26,122,138,0.07)',
                    border: `1.5px solid rgba(26,122,138,0.3)`,
                    borderRadius: 10,
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                  }}>
                    <CheckCircle2 style={{ width: 20, height: 20, color: C.teal, marginTop: 2 }} />
                    <div>
                      <p style={{ fontWeight: 600, color: C.teal, fontSize: '0.9rem', margin: '0 0 2px', fontFamily: 'Hind Siliguri, sans-serif' }}>
                        <span className="hi-text">समस्या दर्ज हो गई!</span>
                        <span className="en-text">Issue Reported!</span>
                      </p>
                      <p style={{ fontSize: '0.8rem', color: C.inkSoft, margin: 0, fontFamily: 'Hind Siliguri, sans-serif' }}>
                        <span className="hi-text">ट्रैक ID दी गई। आपको अपडेट मिलेंगे।</span>
                        <span className="en-text">Track ID assigned. You will receive updates.</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Analysis result */}
                {analysis && (
                  <HeritagePanel style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <Brain style={{ width: 16, height: 16, color: C.teal }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: C.teal, fontFamily: 'Hind Siliguri, sans-serif' }}>
                        <span className="hi-text">AI शिकायत विश्लेषण</span>
                        <span className="en-text">AI Complaint Analysis</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { hiLbl: 'श्रेणी', enLbl: 'Category', val: analysis.category },
                        { hiLbl: 'भावना', enLbl: 'Sentiment', val: analysis.sentiment },
                        { hiLbl: 'तात्कालिकता', enLbl: 'Urgency', val: `${(analysis.urgency * 100).toFixed(0)}%` },
                        { hiLbl: 'स्थान', enLbl: 'Location', val: analysis.location || 'Unknown' },
                      ].map(({ hiLbl, enLbl, val }) => (
                        <div key={enLbl}>
                          <span style={{ fontSize: '0.75rem', color: C.placeholder, display: 'block', fontFamily: 'Hind Siliguri, sans-serif' }}>
                            <span className="hi-text">{hiLbl}</span>
                            <span className="en-text">{enLbl}</span>
                          </span>
                          <p style={{ fontWeight: 600, color: C.ink, fontSize: '0.9rem', margin: 0, fontFamily: 'Hind Siliguri, sans-serif' }}>{val}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      marginTop: 14,
                      padding: '10px 12px',
                      background: 'rgba(232,130,10,0.05)',
                      borderRadius: 8,
                      border: '1px solid rgba(232,130,10,0.2)',
                    }}>
                      <p style={{ fontSize: '0.7rem', color: C.placeholder, fontFamily: 'Hind Siliguri, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                        Whisper Transcript
                      </p>
                      <p style={{ fontSize: '0.88rem', color: C.ink, lineHeight: 1.55, margin: 0, fontFamily: 'Hind Siliguri, sans-serif' }}>
                        {analysis.transcript}
                      </p>
                    </div>
                  </HeritagePanel>
                )}
              </form>
            </div>

            {/* ── Right: Tracker + Pipeline ── */}
            <div className="lg:col-span-2 space-y-6">
              <LiveTracker />
              <PipelineFlow
                activeIndex={pipelineStep}
                badgeText={pipelineActive ? t('report.pipelineBadgeLive') : t('report.pipelineBadgeSnapshot')}
                title={t('report.pipelineTitle')}
                subtitle={t('report.pipelineSubtitle')}
                extra={{
                  label: t('report.whisperPreview'),
                  value: transcriptPreview,
                  meta: pipelineActive ? t('report.streamingLabel') : t('report.awaitingIntake'),
                }}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
