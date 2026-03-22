import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, FileText, Image as ImageIcon, MapPin, Upload, X,
  ChevronDown, Loader2, AlertCircle, CheckCircle2, Navigation,
  Trash2, Clock, Zap
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import VoiceInput from '../components/VoiceInput';
import LiveTracker from '../components/LiveTracker';
import SuccessModal from '../components/SuccessModal';
import Footer from '../components/Footer';

const issueCategories = [
  { value: 'road', hiLabel: '🛣️ सड़क / गड्ढे', enLabel: '🛣️ Road / Potholes' },
  { value: 'water', hiLabel: '💧 पानी की समस्या', enLabel: '💧 Water Supply Issue' },
  { value: 'electricity', hiLabel: '⚡ बिजली की समस्या', enLabel: '⚡ Electricity Issue' },
  { value: 'sanitation', hiLabel: '🗑️ स्वच्छता / कचरा', enLabel: '🗑️ Sanitation / Garbage' },
  { value: 'drainage', hiLabel: '🌊 नाली / जलभराव', enLabel: '🌊 Drainage / Waterlogging' },
  { value: 'streetlight', hiLabel: '💡 स्ट्रीटलाइट', enLabel: '💡 Street Light' },
  { value: 'corruption', hiLabel: '⚖️ भ्रष्टाचार', enLabel: '⚖️ Corruption' },
  { value: 'other', hiLabel: '📋 अन्य', enLabel: '📋 Other' },
];

const districts = [
  'अमेठी / Amethi', 'लखनऊ / Lucknow', 'वाराणसी / Varanasi',
  'कानपुर / Kanpur', 'आगरा / Agra', 'प्रयागराज / Prayagraj',
  'गोरखपुर / Gorakhpur', 'मेरठ / Meerut', 'बरेली / Bareilly',
  'अन्य / Other',
];

/* ── Input Method Selector ── */
function InputMethodSelector({ selected, onChange }) {
  const methods = [
    { id: 'text', icon: FileText, hiLabel: 'टेक्स्ट', enLabel: 'Text' },
    { id: 'voice', icon: Mic, hiLabel: 'आवाज़', enLabel: 'Voice' },
    { id: 'image', icon: ImageIcon, hiLabel: 'फ़ोटो', enLabel: 'Image' },
  ];

  return (
    <div className="flex gap-3" role="radiogroup" aria-label="Input method">
      {methods.map(({ id, icon: Icon, hiLabel, enLabel }) => {
        const isActive = selected === id;
        return (
          <motion.button
            key={id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(id)}
            role="radio"
            aria-checked={isActive}
            className="flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer"
            style={{
              background: isActive ? '#C4440A' : '#FDECC8',
              color: isActive ? '#FDECC8' : '#3D2A18',
              border: `2px solid ${isActive ? '#C4440A' : 'rgba(232,130,10,0.3)'}`,
              boxShadow: isActive ? '0 4px 14px -3px rgba(196,68,10,0.4)' : 'none',
              fontFamily: 'Hind Siliguri, sans-serif',
              minHeight: 68,
            }}
          >
            <Icon className="w-5 h-5" />
            <span>
              <span className="hi-text">{hiLabel}</span>
              <span className="en-text">{enLabel}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ── Image Upload ── */
function ImageUpload({ images, setImages }) {
  const fileRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const newImages = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && images.length + newImages.length < 5) {
        const url = URL.createObjectURL(file);
        newImages.push({ file, preview: url, name: file.name });
      }
    });
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div>
      <div
        className="relative rounded-lg p-8 text-center cursor-pointer transition-all duration-200"
        style={{
          border: `2px dashed ${isDragging ? '#C4440A' : 'rgba(232,130,10,0.3)'}`,
          background: isDragging ? 'rgba(196,68,10,0.04)' : 'transparent',
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        role="button"
        aria-label="Upload images"
      >
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
        <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: isDragging ? '#C4440A' : '#3D2A18', opacity: isDragging ? 1 : 0.5 }} />
        <p className="text-sm font-medium mb-1" style={{ color: '#1A1208', fontFamily: 'Hind Siliguri' }}>
          <span className="hi-text">फ़ोटो खींचकर छोड़ें या क्लिक करें</span>
          <span className="en-text">Drag & drop photos or click to browse</span>
        </p>
        <p className="text-xs" style={{ color: '#3D2A18', opacity: 0.5, fontFamily: 'Hind Siliguri' }}>
          <span className="hi-text">अधिकतम 5 फ़ोटो, 5MB प्रत्येक</span>
          <span className="en-text">Max 5 photos, 5MB each</span>
        </p>
      </div>
      {images.length > 0 && (
        <div className="flex gap-3 mt-4 flex-wrap">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="relative w-20 h-20 rounded-lg overflow-hidden group"
              style={{ border: '1.5px solid rgba(232,130,10,0.25)' }}
            >
              <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
              <button onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${img.name}`}
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CITIZEN PORTAL (File Complaint Page)
   ═══════════════════════════════════════════ */
export default function CitizenPortal() {
  const { lang } = useLang();

  const [inputMethod, setInputMethod] = useState('text');
  const [issueType, setIssueType] = useState('');
  const [district, setDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [errors, setErrors] = useState({});
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoLocation, setGeoLocation] = useState(null);

  const maxChars = 1000;
  const charCount = description.length;
  const readingTime = Math.max(1, Math.ceil(description.split(/\s+/).filter(Boolean).length / 200));

  // Auto-save
  useEffect(() => {
    const saved = localStorage.getItem('jv_draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.issueType) setIssueType(draft.issueType);
        if (draft.district) setDistrict(draft.district);
        if (draft.description) setDescription(draft.description);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('jv_draft', JSON.stringify({ issueType, district, description }));
    }, 500);
    return () => clearTimeout(timer);
  }, [issueType, district, description]);

  const aiCategory = issueType
    ? issueCategories.find(c => c.value === issueType)?.enLabel?.replace(/[^\w\s]/g, '').trim() || ''
    : '';

  const aiPriority = description.length > 200 ? 'high' : description.length > 50 ? 'medium' : 'low';

  const detectLocation = () => {
    setGeoLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setGeoLocation({ lat: latitude, lng: longitude });
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || '';
            if (city) {
              const match = districts.find(d => d.toLowerCase().includes(city.toLowerCase()));
              if (match) setDistrict(match); else setDistrict(city);
            }
          } catch {
            setDistrict(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
          setGeoLoading(false);
        },
        () => { setGeoLoading(false); alert(lang === 'hi' ? 'लोकेशन एक्सेस नहीं मिला' : 'Could not access location'); },
        { enableHighAccuracy: true }
      );
    } else { setGeoLoading(false); }
  };

  const handleVoiceTranscript = useCallback((text) => { setDescription(text); }, []);

  const validate = () => {
    const newErrors = {};
    if (!issueType) newErrors.issueType = lang === 'hi' ? 'समस्या का प्रकार चुनें' : 'Select issue type';
    if (!district) newErrors.district = lang === 'hi' ? 'जिला चुनें' : 'Select district';
    if (!description.trim()) newErrors.description = lang === 'hi' ? 'विवरण लिखें' : 'Enter description';
    if (description.length > maxChars) newErrors.description = lang === 'hi' ? 'विवरण बहुत लंबा है' : 'Description too long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const id = `JV-${Math.floor(10000 + Math.random() * 90000)}`;
    setComplaintId(id);
    setIsSubmitting(false);
    setShowSuccess(true);
    localStorage.removeItem('jv_draft');
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    setIssueType(''); setDistrict(''); setDescription('');
    setImages([]); setGeoLocation(null);
  };

  const timelineSteps = [
    { label: 'Draft', hiLabel: 'ड्राफ्ट', status: description ? 'completed' : 'active', timestamp: 'Now' },
    { label: 'AI Processing', hiLabel: 'AI प्रोसेसिंग', status: 'pending' },
    { label: 'Admin Review', hiLabel: 'प्रशासन समीक्षा', status: 'pending' },
    { label: 'Action', hiLabel: 'कार्रवाई', status: 'pending' },
    { label: 'Resolved', hiLabel: 'हल किया', status: 'pending' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FDECC8' }}>
      {/* Header */}
      <div className="pt-24 pb-8 px-4" style={{ background: '#1A1208' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#FDECC8', fontFamily: "'Playfair Display', serif" }}>
              <span className="hi-text" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>शिकायत दर्ज करें</span>
              <span className="en-text">File Your Grievance</span>
            </h1>
            <p className="text-sm sm:text-base" style={{ color: 'rgba(253,236,200,0.6)', fontFamily: 'Hind Siliguri, sans-serif' }}>
              <span className="hi-text">आवाज़, टेक्स्ट या फ़ोटो से अपनी शिकायत दर्ज करें</span>
              <span className="en-text">Submit your complaint via voice, text, or image</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">

          {/* LEFT: FORM */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>

              {/* Input Method */}
              <div className="p-6 rounded-lg" style={{ background: '#FDECC8', border: '1.5px solid rgba(232,130,10,0.25)' }}>
                <label className="input-label mb-3">
                  <span className="hi-text">इनपुट विधि चुनें</span>
                  <span className="en-text">Choose Input Method</span>
                </label>
                <InputMethodSelector selected={inputMethod} onChange={setInputMethod} />
              </div>

              {/* Voice Input */}
              <AnimatePresence mode="wait">
                {inputMethod === 'voice' && (
                  <motion.div key="voice" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="p-6 rounded-lg overflow-hidden"
                    style={{ background: '#FDECC8', border: '1.5px solid rgba(232,130,10,0.25)' }}
                  >
                    <VoiceInput onTranscript={handleVoiceTranscript} language={lang} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Issue Type */}
              <div className="p-6 rounded-lg" style={{ background: '#FDECC8', border: '1.5px solid rgba(232,130,10,0.25)' }}>
                <label htmlFor="issue-type" className="input-label">
                  <span className="hi-text">समस्या का प्रकार *</span>
                  <span className="en-text">Type of Issue *</span>
                </label>
                <div className="relative">
                  <select id="issue-type" value={issueType}
                    onChange={(e) => { setIssueType(e.target.value); setErrors(prev => ({ ...prev, issueType: '' })); }}
                    className="input-field appearance-none pr-10"
                    style={errors.issueType ? { borderBottomColor: '#D42E18' } : {}}
                    aria-invalid={!!errors.issueType}
                  >
                    <option value="">{lang === 'hi' ? '-- चुनें --' : '-- Select --'}</option>
                    {issueCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{lang === 'hi' ? cat.hiLabel : cat.enLabel}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: '#3D2A18', opacity: 0.5 }} />
                </div>
                {errors.issueType && (
                  <p className="flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: '#D42E18' }}>
                    <AlertCircle className="w-3 h-3" /> {errors.issueType}
                  </p>
                )}
              </div>

              {/* District */}
              <div className="p-6 rounded-lg" style={{ background: '#FDECC8', border: '1.5px solid rgba(232,130,10,0.25)' }}>
                <label htmlFor="district" className="input-label">
                  <span className="hi-text">जिला / स्थान *</span>
                  <span className="en-text">District / Location *</span>
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select id="district" value={district}
                      onChange={(e) => { setDistrict(e.target.value); setErrors(prev => ({ ...prev, district: '' })); }}
                      className="input-field appearance-none pr-10"
                      style={errors.district ? { borderBottomColor: '#D42E18' } : {}}
                      aria-invalid={!!errors.district}
                    >
                      <option value="">{lang === 'hi' ? '-- जिला चुनें --' : '-- Select District --'}</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: '#3D2A18', opacity: 0.5 }} />
                  </div>
                  <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={detectLocation} disabled={geoLoading}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all"
                    style={{ background: 'rgba(26,122,138,0.1)', color: '#1A7A8A', border: '1px solid rgba(26,122,138,0.25)', minWidth: 'fit-content', fontFamily: 'Hind Siliguri' }}
                    aria-label="Detect my location"
                  >
                    {geoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                    <span className="hidden sm:inline">GPS</span>
                  </motion.button>
                </div>
                {geoLocation && (
                  <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#047857', fontFamily: 'Hind Siliguri' }}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="hi-text">लोकेशन डिटेक्ट हो गई</span>
                    <span className="en-text">Location detected</span>
                  </p>
                )}
                {errors.district && (
                  <p className="flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: '#D42E18' }}>
                    <AlertCircle className="w-3 h-3" /> {errors.district}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="p-6 rounded-lg" style={{ background: '#FDECC8', border: '1.5px solid rgba(232,130,10,0.25)' }}>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="description" className="input-label mb-0">
                    <span className="hi-text">विवरण *</span>
                    <span className="en-text">Description *</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: '#3D2A18', opacity: 0.5, fontFamily: 'Hind Siliguri' }}>
                      <Clock className="w-3 h-3 inline mr-1" />~{readingTime} min read
                    </span>
                    <span className="text-xs font-semibold" style={{ color: charCount > maxChars ? '#D42E18' : charCount > maxChars * 0.8 ? '#E8820A' : '#3D2A18', opacity: charCount > maxChars * 0.8 ? 1 : 0.5 }}>
                      {charCount}/{maxChars}
                    </span>
                  </div>
                </div>
                <textarea id="description" value={description}
                  onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: '' })); }}
                  placeholder={lang === 'hi' ? 'अपनी समस्या का विस्तार से वर्णन करें...' : 'Describe your issue in detail...'}
                  rows={5} maxLength={maxChars + 50}
                  className="input-field resize-none"
                  style={errors.description ? { borderBottomColor: '#D42E18' } : {}}
                  aria-invalid={!!errors.description}
                />
                <div className="w-full h-1 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(232,130,10,0.15)' }}>
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (charCount / maxChars) * 100)}%`,
                      background: charCount > maxChars ? '#D42E18' : charCount > maxChars * 0.8 ? '#E8820A' : 'linear-gradient(90deg, #C4440A, #E8820A)',
                    }}
                  />
                </div>
                {errors.description && (
                  <p className="flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: '#D42E18' }}>
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="p-6 rounded-lg" style={{ background: '#FDECC8', border: '1.5px solid rgba(232,130,10,0.25)' }}>
                <label className="input-label">
                  <span className="hi-text">फ़ोटो अपलोड (वैकल्पिक)</span>
                  <span className="en-text">Upload Photos (optional)</span>
                </label>
                <ImageUpload images={images} setImages={setImages} />
              </div>

              {/* Submit */}
              <motion.button type="submit"
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
                style={{ opacity: isSubmitting ? 0.8 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="hi-text">दर्ज हो रही है...</span>
                    <span className="en-text">Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="hi-text">शिकायत दर्ज करें</span>
                    <span className="en-text">Submit Complaint</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* RIGHT: LIVE TRACKER */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <LiveTracker
              complaintData={{
                title: description.slice(0, 60) || '',
                location: district,
                priority: aiPriority,
                category: aiCategory,
                description,
                estimatedTime: aiPriority === 'high' ? '1-2 days' : aiPriority === 'medium' ? '3-5 days' : '5-7 days',
              }}
              timelineSteps={timelineSteps}
            />
          </div>
        </div>
      </div>

      <SuccessModal isOpen={showSuccess} onClose={closeSuccess} complaintId={complaintId} complaintTitle={description.slice(0, 60)} />
      <Footer />
    </div>
  );
}
