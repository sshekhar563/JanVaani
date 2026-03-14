import { useEffect, useRef, useState } from 'react';
import { 
  Mic, Type, Image, Upload, MapPin, ChevronDown, Send, CheckCircle2,
  Brain, LayoutDashboard, Hammer, ShieldCheck, Clock, ArrowRight, 
  AlertCircle, Loader2, X
} from 'lucide-react';
import { categories, issues } from '../data/mockData';
import PipelineFlow, { pipelineSteps } from '../components/PipelineFlow';
import Footer from '../components/Footer';

function VoiceInput() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleToggle = () => {
    if (!recording) {
      setRecording(true);
      setTranscript('');
      setTimeout(() => {
        setTranscript('???? ?? ???? ????? ??... ???? ??? ?? ?? ????? ?? ???... ???? ?????? ??...');
        setRecording(false);
      }, 4000);
    } else {
      setRecording(false);
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
          <Mic className={`w-10 h-10 text-white ${recording ? 'animate-pulse' : ''}`} />
        </button>
        <p className="text-sm text-gray-400 mt-4">
          {recording ? 'Listening... speak in any language' : 'Tap to start recording'}
        </p>
        
        {/* Waveform */}
        {recording && (
          <div className="flex items-center justify-center gap-1 mt-4 h-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-1.5 bg-saffron-400 rounded-full waveform-bar" style={{ height: '8px' }} />
            ))}
          </div>
        )}

        {/* Dialect selector */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500">Dialect:</span>
          <div className="flex gap-2">
            {['Hindi', 'Haryanvi', 'Punjabi', 'Urdu', 'English'].map(d => (
              <button key={d} className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-saffron-500/30 transition-all">
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transcript Output */}
      {transcript && (
        <div className="bg-trust-500/5 border border-trust-500/20 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-trust-400" />
            <span className="text-xs font-medium text-trust-400">AI Transcription (Hindi to English)</span>
          </div>
          <p className="text-sm text-gray-300 italic mb-2">{transcript}</p>
          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">Translation:</span> "There is a big pothole on the road... on MG Road... near the bus stop... very dangerous..."
          </p>
        </div>
      )}
    </div>
  );
}

function TextInput({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <textarea
        rows={5}
        placeholder="Describe the issue in detail... (e.g., Large pothole on MG Road near the bus stop causing traffic issues)"
        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 transition-all"
        value={formData.description}
        onChange={e => setFormData({ ...formData, description: e.target.value })}
      />
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
        <Brain className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-400">
          <span className="text-blue-400 font-medium">AI Assist:</span> Our NLP engine will automatically detect the category, location, and sentiment from your description.
        </p>
      </div>
    </div>
  );
}

function ImageInput() {
  const [preview, setPreview] = useState(null);

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-saffron-500/30 transition-all cursor-pointer group"
        onClick={() => setPreview('mock')}
      >
        {preview ? (
          <div className="relative animate-fade-in">
            <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Image className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400">pothole_mg_road.jpg</p>
                <p className="text-xs text-gray-500">2.4 MB / 1920x1080</p>
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setPreview(null); }}
              className="absolute top-2 right-2 w-7 h-7 bg-navy-900/80 rounded-full flex items-center justify-center text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mt-3 bg-trust-500/5 border border-trust-500/20 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-trust-400 mt-0.5" />
              <div>
                <p className="text-xs text-trust-400 font-medium">AI Image Analysis</p>
                <p className="text-xs text-gray-400">Detected: Road damage, pothole (~3ft diameter). Location metadata extracted.</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3 group-hover:text-saffron-400 transition-colors" />
            <p className="text-sm text-gray-400">
              <span className="text-saffron-400 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
          </>
        )}
      </div>
    </div>
  );
}

function LiveTracker() {
  const sampleIssue = issues[0];
  const stepsData = [
    { key: 'submitted', label: 'Submitted', icon: Send, time: 'Mar 8, 9:30 AM', done: true },
    { key: 'ai_processing', label: 'AI Processing', icon: Brain, time: 'Mar 8, 9:31 AM', done: true },
    { key: 'leader_dashboard', label: 'Leader Dashboard', icon: LayoutDashboard, time: 'Mar 8, 10:15 AM', done: true },
    { key: 'action_taken', label: 'Action Taken', icon: Hammer, time: 'Mar 10, 2:00 PM', done: true },
    { key: 'verified', label: 'Verified Proof', icon: ShieldCheck, time: 'Mar 10, 4:30 PM', done: false, active: true },
  ];

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Live Issue Tracker</h3>
          <p className="text-xs text-gray-500 mt-1">Track ID: {sampleIssue.id}</p>
        </div>
        <span className="tag-high">High Priority</span>
      </div>

      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-white text-sm mb-1">{sampleIssue.title}</h4>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{sampleIssue.location}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Mar 8, 2024</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {stepsData.map((step, i) => (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                step.done ? 'bg-trust-500 shadow-lg shadow-trust-500/25' :
                step.active ? 'bg-saffron-500 shadow-lg shadow-saffron-500/25 animate-pulse' :
                'bg-white/10'
              }`}>
                {step.done ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <step.icon className={`w-5 h-5 ${step.active ? 'text-white' : 'text-gray-500'}`} />
                )}
              </div>
              {i < stepsData.length - 1 && (
                <div className={`w-0.5 h-12 ${step.done ? 'bg-trust-500/40' : 'bg-white/10'}`} />
              )}
            </div>
            <div className="pb-8">
              <p className={`font-medium text-sm ${step.done ? 'text-white' : step.active ? 'text-saffron-400' : 'text-gray-500'}`}>
                {step.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{step.time}</p>
              {step.active && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-saffron-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Awaiting final verification...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CitizenPortal() {
  const [inputMode, setInputMode] = useState('text');
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: '',
  });
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [pipelineActive, setPipelineActive] = useState(false);
  const pipelineTimers = useRef([]);

  useEffect(() => {
    return () => pipelineTimers.current.forEach(clearTimeout);
  }, []);

  const getTranscriptFallback = () => (
    inputMode === 'voice'
      ? 'Whisper transcribed a Hindi (Haryanvi) plea about MG Road pothole with high urgency.'
      : formData.description || 'Citizen text ready for NLP analysis.'
  );

  const startPipeline = () => {
    pipelineTimers.current.forEach(clearTimeout);
    pipelineTimers.current = [];
    setPipelineActive(true);
    setPipelineStep(-1);
    pipelineSteps.forEach((_, idx) => {
      pipelineTimers.current.push(
        setTimeout(() => {
          setPipelineStep(idx);
        }, idx * 900)
      );
    });
    pipelineTimers.current.push(
      setTimeout(() => setPipelineActive(false), pipelineSteps.length * 900 + 600)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    startPipeline();
    setAnalysis(null);

    setLoadingAI(true);

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: formData.description,
          location: formData.location,
          category: formData.category,
        }),
      });

      const data = await res.json();

      setAnalysis({
        ...data,
        transcript: data.transcript ?? getTranscriptFallback(),
      });
      setSubmitted(true);

    } catch (err) {
      console.error("NLP analysis failed:", err);
    }

    setLoadingAI(false);

    setTimeout(() => setSubmitted(false), 5200);
  };

  const modes = [
    { key: 'voice', label: 'Voice', icon: Mic },
    { key: 'text', label: 'Text', icon: Type },
    { key: 'image', label: 'Image', icon: Image },
  ];

  const transcriptPreview = analysis?.transcript ?? getTranscriptFallback();

  return (
    <div className="min-h-screen bg-navy-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-xs font-medium text-saffron-400 mb-4">
            <AlertCircle className="w-3 h-3" /> Citizen Intake Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Report a <span className="text-saffron-400">Community Issue</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Your voice matters. Report issues in your language, let AI handle the rest.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Mode Tabs */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <label className="text-sm font-medium text-gray-300 mb-3 block">Input Method</label>
                <div className="flex gap-2 mb-6">
                  {modes.map(m => (
                    <button
                      type="button"
                      key={m.key}
                      onClick={() => setInputMode(m.key)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        inputMode === m.key
                          ? 'bg-gradient-to-r from-saffron-500/20 to-saffron-600/10 text-saffron-400 border border-saffron-500/30'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <m.icon className="w-4 h-4" /> {m.label}
                    </button>
                  ))}
                </div>

                {/* Input Content */}
                {inputMode === 'voice' && <VoiceInput />}
                {inputMode === 'text' && <TextInput formData={formData} setFormData={setFormData} />}
                {inputMode === 'image' && <ImageInput />}
              </div>

              {/* Category & Location */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
                  <div className="relative">
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm appearance-none focus:outline-none focus:border-saffron-500/50 transition-all cursor-pointer"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="" className="bg-navy-900">Select a category</option>
                      {categories.map(c => (
                        <option key={c} value={c} className="bg-navy-900">{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., MG Road, Sector 12"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 transition-all"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full btn-primary text-base py-4 flex items-center justify-center gap-2"
              >
                {loadingAI ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI Processing...
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Submitted Successfully!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Report
                  </>
                )}
              </button>

              {submitted && (
                <div className="bg-trust-500/10 border border-trust-500/20 rounded-xl p-4 flex items-start gap-3 animate-slide-up">
                  <CheckCircle2 className="w-5 h-5 text-trust-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-trust-400">Issue Reported Successfully!</p>
                    <p className="text-xs text-gray-400 mt-1">Track ID: JV-2024-009. AI is analyzing your report...</p>
                  </div>
                </div>
              )}
              {analysis && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4 animate-fade-in">
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-blue-400">
                      AI Complaint Analysis
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">

                    <div>
                      <span className="text-gray-500">Category</span>
                      <p className="text-white font-medium">{analysis.category}</p>
                    </div>

                    <div>
                      <span className="text-gray-500">Sentiment</span>
                      <p className="text-white font-medium">{analysis.sentiment}</p>
                    </div>

                    <div>
                      <span className="text-gray-500">Urgency Score</span>
                      <p className="text-white font-medium">
                        {(analysis.urgency * 100).toFixed(0)}%
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">Detected Location</span>
                      <p className="text-white font-medium">
                        {analysis.location || "Unknown"}
                      </p>
                    </div>

                  </div>
                  <div className="mt-4 bg-navy-900/40 border border-white/5 rounded-2xl p-3">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500 mb-1">Whisper transcript</p>
                    <p className="text-sm text-gray-200 leading-relaxed break-words">{analysis.transcript}</p>
                  </div>

                </div>
              )}
            </form>
          </div>

          {/* Live Tracker + Pipeline */}
          <div className="lg:col-span-2 space-y-6">
            <LiveTracker />
            <PipelineFlow
              activeIndex={pipelineStep}
              badgeText={pipelineActive ? 'Live pipeline' : 'Pipeline snapshot'}
              title="Reality Check Pipeline"
              subtitle="Whisper → GPT → Leader action in one verified stream."
              extra={{
                label: 'Whisper preview',
                value: transcriptPreview,
                meta: pipelineActive ? 'Streaming with Whisper + GPT' : 'Awaiting next citizen intake',
              }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
