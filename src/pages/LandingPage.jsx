import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Zap, Shield, Eye, BarChart3, Brain, CheckCircle2,
  AlertTriangle, Clock, Users, TrendingUp, MapPin, Mic, Camera,
  ChevronRight, Star, ArrowUpRight, Volume2
} from 'lucide-react';
import Footer from '../components/Footer';
import gsap from 'gsap';

/* ── Animated Counter ── */
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ── Abstract Brushstroke SVG Background ── */
function BrushstrokeBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="brush1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4440A" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#E8820A" stopOpacity="0.06"/>
        </linearGradient>
        <linearGradient id="brush2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1A7A8A" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#2A9BAD" stopOpacity="0.05"/>
        </linearGradient>
        <linearGradient id="brush3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5B830" stopOpacity="0.08"/>
          <stop offset="100%" stopColor="#E8820A" stopOpacity="0.04"/>
        </linearGradient>
      </defs>
      {/* Orange brushstroke — top right */}
      <path d="M600 0 Q700 50 800 30 Q900 10 1000 80 Q1100 150 1200 120 Q1300 90 1440 140 L1440 0 Z" fill="url(#brush1)"/>
      {/* Teal brushstroke — left side */}
      <path d="M0 200 Q100 160 200 220 Q300 280 180 350 Q60 420 0 380 Z" fill="url(#brush2)"/>
      {/* Amber brushstroke — bottom */}
      <path d="M400 500 Q500 460 700 490 Q900 520 1000 480 Q1100 440 1200 500 Q1300 560 1440 520 L1440 600 L0 600 L0 540 Q100 580 200 550 Q300 520 400 500 Z" fill="url(#brush3)"/>
      {/* Small orange accent strokes */}
      <ellipse cx="300" cy="100" rx="120" ry="15" fill="#C4440A" opacity="0.06" transform="rotate(-15 300 100)"/>
      <ellipse cx="900" cy="400" rx="100" ry="12" fill="#1A7A8A" opacity="0.05" transform="rotate(10 900 400)"/>
      <ellipse cx="1100" cy="250" rx="80" ry="10" fill="#E8820A" opacity="0.05" transform="rotate(-8 1100 250)"/>
    </svg>
  );
}

/* ── Jaali Separator ── */
function JaaliSeparator() {
  return (
    <div className="relative overflow-hidden py-2" aria-hidden="true">
      <svg width="100%" height="32" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="jaali" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect x="8" y="8" width="16" height="16" fill="none" stroke="#E8820A" strokeWidth="0.8" opacity="0.3" transform="rotate(45 16 16)"/>
            <circle cx="16" cy="0" r="2" fill="none" stroke="#C4440A" strokeWidth="0.6" opacity="0.2"/>
            <circle cx="16" cy="32" r="2" fill="none" stroke="#C4440A" strokeWidth="0.6" opacity="0.2"/>
            <circle cx="0" cy="16" r="2" fill="none" stroke="#C4440A" strokeWidth="0.6" opacity="0.2"/>
            <circle cx="32" cy="16" r="2" fill="none" stroke="#C4440A" strokeWidth="0.6" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="32" fill="url(#jaali)"/>
      </svg>
      <div style={{
        position: 'absolute', inset: '50% 0 0 0', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(232,130,10,0.5) 20%, rgba(196,68,10,0.4) 50%, rgba(232,130,10,0.5) 80%, transparent)',
      }}/>
    </div>
  );
}

/* ── Section Badge ── */
function SectionBadge({ icon: Icon, hiText, enText }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
      style={{
        background: 'rgba(232,130,10,0.1)',
        border: '1px solid rgba(232,130,10,0.3)',
        color: '#E8820A',
        fontFamily: 'Hind Siliguri, sans-serif',
      }}
    >
      {Icon && <Icon className="w-3 h-3" />}
      <span className="hi-text">{hiText}</span>
      <span className="en-text">{enText}</span>
    </div>
  );
}

/* ── GSAP Button Component ── */
function GsapButton({ children, className, style, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onEnter = () => gsap.to(el, { scale: 1.05, duration: 0.25, ease: 'power2.out' });
    const onLeave = () => gsap.to(el, { scale: 1, duration: 0.25, ease: 'power2.out' });
    const onClick = () => {
      gsap.fromTo(el, { scale: 0.95 }, { scale: 1.05, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 });
    };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('click', onClick);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <Link ref={ref} className={`btn-gsap ${className || ''}`} style={{ willChange: 'transform', ...style }} {...props}>
      {children}
    </Link>
  );
}

/* ── Main Component ── */
export default function LandingPage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  // GSAP hero entrance
  useEffect(() => {
    if (heroRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.hero-title', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
        gsap.from('.hero-subtitle', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.4 });
        gsap.from('.hero-tagline', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.6 });
        gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.8 });
        gsap.from('.hero-stats', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 1.0 });
      }, heroRef);
      return () => ctx.revert();
    }
  }, []);

  const features = [
    {
      hiTitle: 'बहुभाषी इनपुट',
      enTitle: 'Multilingual Intake',
      hiDesc: 'नागरिक आवाज़, पाठ और छवि से शिकायत दर्ज करें',
      enDesc: 'Submit via voice, text, or image in your language',
      step: '०१',
      accentColor: 'var(--color-primary)',
    },
    {
      hiTitle: 'AI प्राथमिकता',
      enTitle: 'AI Prioritization',
      hiDesc: 'तात्कालिकता और प्रभाव के आधार पर स्वचालित वर्गीकरण',
      enDesc: 'Automated urgency and impact scoring',
      step: '०२',
      accentColor: 'var(--color-amber)',
    },
    {
      hiTitle: 'पारदर्शी समाधान',
      enTitle: 'Transparent Resolution',
      hiDesc: 'कार्य-प्रमाण सत्यापन से जनता का विश्वास बढ़ाएं',
      enDesc: 'Visual proof-of-work builds public trust',
      step: '०३',
      accentColor: 'var(--color-teal)',
    },
  ];

  const stats = [
    { value: 85,  suffix: '%',  hiLabel: 'तेज़ समाधान', enLabel: 'Faster Resolution',  icon: Zap,   color: 'var(--color-primary)' },
    { value: 3,   suffix: '.2x', hiLabel: 'नागरिक जुड़ाव', enLabel: 'Citizen Engagement', icon: Users, color: 'var(--color-amber)' },
    { value: 24,  suffix: '/7', hiLabel: 'AI निगरानी', enLabel: 'AI Monitoring',       icon: Eye,   color: 'var(--color-teal)' },
  ];

  const beforeItems = [
    { icon: Clock,         hiText: 'समस्या समाधान में हफ्तों की देरी', enText: 'Weeks-long delays in issue resolution' },
    { icon: AlertTriangle, hiText: 'कोई प्राथमिकता नहीं', enText: 'No prioritization — first come, first served' },
    { icon: Eye,           hiText: 'कार्रवाई पर शून्य पारदर्शिता', enText: 'Zero transparency on action status' },
    { icon: Users,         hiText: 'नागरिकों में निराशा', enText: 'Citizen frustration and distrust' },
    { icon: BarChart3,     hiText: 'गलत सूचना अनियंत्रित', enText: 'Misinformation goes unchecked' },
  ];

  const afterItems = [
    { icon: Zap,          hiText: 'AI-संचालित समाधान घंटों में', enText: 'AI-driven priority resolution in hours' },
    { icon: Brain,        hiText: 'स्मार्ट स्कोरिंग', enText: 'Smart scoring based on urgency & impact' },
    { icon: Shield,       hiText: 'रीयल-टाइम सत्यापित प्रमाण', enText: 'Real-time verified proof of completion' },
    { icon: Star,         hiText: 'पब्लिक ट्रस्ट इंडेक्स', enText: 'Public Trust Index builds confidence' },
    { icon: CheckCircle2, hiText: 'AI गलत सूचना चिह्नित करता है', enText: 'AI flags misinformation instantly' },
  ];

  const aiFeatures = [
    { hiTitle: 'ML प्राथमिकता', enTitle: 'ML Prioritization', hiDesc: 'प्रशिक्षित मॉडल से तात्कालिकता और प्रभाव के आधार पर स्वत: रैंकिंग', enDesc: 'Grievances auto-ranked by urgency & impact using trained models', icon: Brain },
    { hiTitle: 'बहुभाषी सेवन', enTitle: 'Multilingual Intake', hiDesc: 'हिंदी, अंग्रेजी, तमिल, बंगाली, मराठी — सभी समर्थित', enDesc: 'Hindi, English, Tamil, Bengali, Marathi — all supported natively', icon: Volume2 },
    { hiTitle: 'दृश्य कार्य-प्रमाण', enTitle: 'Visual Proof-of-Work', hiDesc: 'फोटो/वीडियो साक्ष्य जियो-टैग और सत्यापित', enDesc: 'Photo/video evidence geotagged and verified before processing', icon: Camera },
  ];

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: 'var(--color-bg)', color: 'var(--color-ink)' }}
    >

      {/* ════════════════════════════════
          HERO SECTION
          ════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16" id="hero" style={{ background: '#1A1208' }}>

        {/* Abstract brushstroke SVG background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <BrushstrokeBackground />
          {/* Warm ambient glow */}
          <div style={{
            position: 'absolute', top: '20%', left: '15%',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(196,68,10,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}/>
          <div style={{
            position: 'absolute', bottom: '10%', right: '10%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(26,122,138,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}/>
        </div>

        {/* Hero content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center" style={{ zIndex: 10 }}>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{
              background: 'rgba(196,68,10,0.15)',
              border: '1px solid rgba(196,68,10,0.4)',
              color: '#F5B830',
              fontFamily: 'Hind Siliguri, sans-serif',
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#1A7A8A' }} />
            <span className="hi-text">AI-संचालित शासन मंच</span>
            <span className="en-text">AI-Powered Governance Platform</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>

          {/* Main headline */}
          <h1 className="hero-title" style={{
            fontFamily: "'Noto Serif Devanagari', 'Playfair Display', serif",
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#FDECC8',
            marginBottom: '0.6rem',
            textShadow: '0 2px 20px rgba(196,68,10,0.3)',
          }}>
            <span className="hi-text">जनवाणी</span>
            <span className="en-text">JanVaani</span>
          </h1>

          <h2 className="hero-subtitle" style={{
            fontFamily: "'Noto Serif Devanagari', serif",
            fontSize: 'clamp(1.1rem, 2.5vw, 1.7rem)',
            fontWeight: 600,
            color: '#F5B830',
            marginBottom: '0.8rem',
            letterSpacing: '0.03em',
          }}>
            <span className="hi-text">AI-संचालित नागरिक शिकायत प्रणाली</span>
            <span className="en-text">AI-Powered Civic Grievance System</span>
          </h2>

          <p className="hero-tagline" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1rem, 2vw, 1.35rem)',
            fontStyle: 'italic',
            color: 'rgba(253,236,200,0.7)',
            marginBottom: '1.25rem',
          }}>
            <span className="hi-text">जनता की आवाज़, नेता की दिशा</span>
            <span className="en-text">Transforming citizen voices into actionable intelligence</span>
          </p>

          <p className="hero-tagline subheading max-w-2xl mx-auto" style={{ marginBottom: '2.5rem', fontSize: '1.05rem', color: 'rgba(253,236,200,0.6)' }}>
            <span className="hi-text">बिखरी हुई नागरिक शिकायतों को संरचित, कार्रवाई योग्य जानकारी में बदलें।</span>
            <span className="en-text">Transform scattered citizen grievances into structured, actionable intelligence.</span>
          </p>

          {/* CTAs */}
          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center" style={{ marginBottom: '3.5rem' }}>
            <GsapButton
              to="/report"
              id="hero-report-btn"
              className="btn-primary flex items-center gap-2 justify-center"
              style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
            >
              <Mic className="w-5 h-5" />
              <span className="hi-text">शिकायत दर्ज करें</span>
              <span className="en-text">File a Complaint</span>
              <ArrowRight className="w-5 h-5" />
            </GsapButton>
            <GsapButton
              to="/admin/login"
              id="hero-admin-btn"
              className="btn-admin flex items-center gap-2 justify-center"
              style={{ fontSize: '1rem', padding: '1rem 2.5rem', borderRadius: '6px' }}
            >
              <Shield className="w-5 h-5" />
              <span className="hi-text">प्रशासन लॉगिन</span>
              <span className="en-text">Administration Login</span>
            </GsapButton>
          </div>

          {/* Stat pills */}
          <div className="hero-stats flex flex-wrap items-center justify-center gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 rounded-full"
                style={{
                  background: 'rgba(253,236,200,0.08)',
                  border: `1.5px solid ${stat.color}40`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `${stat.color}15`,
                  border: `1.5px solid ${stat.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color,
                }}>
                  <stat.icon style={{ width: 16, height: 16 }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.3rem', fontWeight: 700,
                    color: stat.color, lineHeight: 1,
                  }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{
                    fontSize: '0.7rem', color: 'rgba(253,236,200,0.6)',
                    fontFamily: 'Hind Siliguri, sans-serif',
                  }}>
                    <span className="hi-text">{stat.hiLabel}</span>
                    <span className="en-text">{stat.enLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true" style={{ zIndex: 10 }}>
          <div style={{
            width: 24, height: 40, borderRadius: 12,
            border: '2px solid rgba(253,236,200,0.25)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: 6,
          }}>
            <div style={{
              width: 4, height: 10, borderRadius: 2,
              background: 'rgba(245,184,48,0.5)',
              animation: 'slideUp 1.5s ease-in-out infinite',
            }}/>
          </div>
        </div>
      </section>

      {/* ── Jaali Divider ── */}
      <JaaliSeparator />

      {/* ════════════════════════════════
          FEATURES SECTION
          ════════════════════════════════ */}
      <section
        id="features"
        ref={featuresRef}
        className="relative py-24"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionBadge icon={Star} hiText="जनवाणी क्यों काम करता है" enText="Why JanVaani Works" />
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1rem',
            }}>
              <span className="hi-text">यह कैसे </span>
              <span className="en-text">How It </span>
              <span style={{ color: 'var(--color-amber)' }}>
                <span className="hi-text">काम करता है</span>
                <span className="en-text">Works</span>
              </span>
            </h2>
            <p className="subheading max-w-xl mx-auto">
              <span className="hi-text">AI द्वारा संचालित — शिकायत से समाधान तक एक निर्बाध पाइपलाइन</span>
              <span className="en-text">A seamless pipeline from complaint to resolution, powered by AI</span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="heritage-card p-6 animate-slide-up group cursor-default"
                style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'both' }}
              >
                {/* Step badge */}
                <div style={{
                  fontFamily: "'Noto Serif Devanagari', serif",
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'rgba(232,130,10,0.5)',
                  marginBottom: '12px',
                  letterSpacing: '0.1em',
                }}>
                  <span className="hi-text">चरण {feature.step}</span>
                  <span className="en-text">Step {feature.step}</span>
                </div>

                {/* Icon Circle */}
                <div style={{
                  width: 72, height: 72,
                  borderRadius: '50%',
                  background: `${feature.accentColor}12`,
                  border: `1.5px solid ${feature.accentColor}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                  transition: 'all 0.3s ease',
                  color: feature.accentColor,
                  fontSize: '1.6rem',
                }}>
                  {i === 0 ? <Mic className="w-7 h-7" /> : i === 1 ? <Brain className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
                </div>

                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '8px',
                }}>
                  <span className="hi-text">{feature.hiTitle}</span>
                  <span className="en-text">{feature.enTitle}</span>
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  lineHeight: 1.65,
                  color: 'var(--color-ink-soft)',
                  fontFamily: 'Hind Siliguri, sans-serif',
                }}>
                  <span className="hi-text">{feature.hiDesc}</span>
                  <span className="en-text">{feature.enDesc}</span>
                </p>

                {/* Bottom accent */}
                <div style={{
                  height: 3,
                  borderRadius: 2,
                  marginTop: 16,
                  background: `linear-gradient(90deg, ${feature.accentColor}, transparent)`,
                  opacity: 0.5,
                }}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rangoli Rule ── */}
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="rangoli-rule">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="#E8820A" opacity="0.5"/>
          </svg>
        </div>
      </div>

      {/* ════════════════════════════════
          AI INTELLIGENCE SECTION (Dark Band)
          ════════════════════════════════ */}
      <section
        id="ai-intelligence"
        className="relative py-24 overflow-hidden"
        style={{ background: '#1A1208' }}
      >
        {/* Brushstroke background */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.15 }}>
          <BrushstrokeBackground />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{
                background: 'rgba(253,236,200,0.1)',
                border: '1px solid rgba(253,236,200,0.3)',
                color: '#FDECC8',
                fontFamily: 'Hind Siliguri, sans-serif',
              }}
            >
              <Brain className="w-3 h-3" />
              <span className="hi-text">AI-संचालित बुद्धिमत्ता</span>
              <span className="en-text">AI-Powered Intelligence</span>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: '#FDECC8',
              marginBottom: '1rem',
            }}>
              <span className="hi-text">बुद्धिमान शासन प्रणाली</span>
              <span className="en-text">Intelligent Governance System</span>
            </h2>
            <p style={{
              color: 'rgba(253,236,200,0.7)',
              maxWidth: '36rem',
              margin: '0 auto',
              fontFamily: 'Hind Siliguri, sans-serif',
              lineHeight: 1.7,
            }}>
              <span className="hi-text">आवाज़ से समाधान तक — हमारी AI पाइपलाइन शिकायतों को बुद्धिमानी से संसाधित करती है</span>
              <span className="en-text">From voice to resolution — our AI pipeline processes grievances intelligently</span>
            </p>
          </div>

          {/* Flow cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {aiFeatures.map((feat, i) => (
              <div
                key={i}
                className="group animate-slide-up"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationFillMode: 'both',
                  background: 'rgba(253,236,200,0.06)',
                  border: '1.5px solid rgba(253,236,200,0.2)',
                  borderRadius: 8,
                  padding: '2rem',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(253,236,200,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(232,130,10,0.5)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(253,236,200,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(253,236,200,0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: 'rgba(232,130,10,0.2)',
                  border: '1.5px solid rgba(232,130,10,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                  color: '#F5B830',
                }}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#FDECC8',
                  marginBottom: 8,
                }}>
                  <span className="hi-text">{feat.hiTitle}</span>
                  <span className="en-text">{feat.enTitle}</span>
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'rgba(253,236,200,0.65)',
                  fontFamily: 'Hind Siliguri, sans-serif',
                  lineHeight: 1.65,
                }}>
                  <span className="hi-text">{feat.hiDesc}</span>
                  <span className="en-text">{feat.enDesc}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Flow diagram */}
          <div style={{
            background: 'rgba(253,236,200,0.06)',
            border: '1px solid rgba(253,236,200,0.15)',
            borderRadius: 8,
            padding: '1.5rem 2rem',
          }}>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { hi: 'आवाज़/टेक्स्ट', en: 'Voice/Text' },
                '→',
                { hi: 'AI प्रोसेसिंग', en: 'AI Processing' },
                '→',
                { hi: 'प्राथमिकता स्कोर', en: 'Priority Score' },
                '→',
                { hi: 'विभाग रूटिंग', en: 'Dept Routing' },
                '→',
                { hi: 'समाधान ट्रैकिंग', en: 'Resolution Tracking' },
              ].map((step, i) => (
                <span
                  key={i}
                  style={{
                    color: step === '→' ? 'rgba(232,130,10,0.6)' : '#FDECC8',
                    fontFamily: step === '→' ? 'serif' : 'Hind Siliguri, sans-serif',
                    fontSize: step === '→' ? '1.5rem' : '0.85rem',
                    fontWeight: step === '→' ? 300 : 500,
                    padding: step === '→' ? '0 4px' : '6px 14px',
                    background: step === '→' ? 'none' : 'rgba(253,236,200,0.08)',
                    borderRadius: step === '→' ? 0 : 4,
                    border: step === '→' ? 'none' : '1px solid rgba(253,236,200,0.15)',
                  }}
                >
                  {step === '→' ? '→' : (
                    <>
                      <span className="hi-text">{step.hi}</span>
                      <span className="en-text">{step.en}</span>
                    </>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Jaali Divider ── */}
      <JaaliSeparator />

      {/* ════════════════════════════════
          BEFORE vs AFTER
          ════════════════════════════════ */}
      <section
        id="transformation"
        className="relative py-24"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionBadge icon={TrendingUp} hiText="परिवर्तन" enText="The Transformation" />
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1rem',
            }}>
              <span className="hi-text">अव्यवस्था से </span>
              <span className="en-text">From Chaos to </span>
              <span style={{
                background: 'linear-gradient(135deg, var(--color-amber), var(--color-primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                <span className="hi-text">स्पष्टता</span>
                <span className="en-text">Clarity</span>
              </span>
            </h2>
            <p className="subheading max-w-xl mx-auto">
              <span className="hi-text">देखें कैसे जनवाणी पारंपरिक शासन को बदलती है</span>
              <span className="en-text">See how JanVaani transforms traditional governance</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative">
            {/* BEFORE */}
            <div
              className="heritage-card p-8 animate-slide-up"
              style={{ borderColor: 'rgba(212,46,24,0.3)', animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div style={{
                  width: 44, height: 44, borderRadius: 8,
                  background: 'rgba(212,46,24,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: '#D42E18' }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.2rem',
                    color: '#D42E18',
                    fontWeight: 700,
                  }}>
                    <span className="hi-text">जनवाणी से पहले</span>
                    <span className="en-text">Before JanVaani</span>
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-soft)', fontFamily: 'Hind Siliguri, sans-serif' }}>
                    <span className="hi-text">पारंपरिक शासन</span>
                    <span className="en-text">Traditional Governance</span>
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {beforeItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-md"
                    style={{
                      background: 'rgba(212,46,24,0.04)',
                      border: '1px solid rgba(212,46,24,0.12)',
                    }}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#D42E18' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-ink)', fontFamily: 'Hind Siliguri, sans-serif' }}>
                      <span className="hi-text">{item.hiText}</span>
                      <span className="en-text">{item.enText}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AFTER */}
            <div
              className="heritage-card p-8 animate-slide-up animate-delay-200"
              style={{ borderColor: 'rgba(26,122,138,0.35)', animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div style={{
                  width: 44, height: 44, borderRadius: 8,
                  background: 'rgba(26,122,138,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#1A7A8A' }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.2rem',
                    color: '#1A7A8A',
                    fontWeight: 700,
                  }}>
                    <span className="hi-text">जनवाणी के साथ</span>
                    <span className="en-text">With JanVaani</span>
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-soft)', fontFamily: 'Hind Siliguri, sans-serif' }}>
                    <span className="hi-text">AI-संचालित शासन</span>
                    <span className="en-text">AI-Powered Governance</span>
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {afterItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-md"
                    style={{
                      background: 'rgba(26,122,138,0.04)',
                      border: '1px solid rgba(26,122,138,0.12)',
                    }}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#1A7A8A' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-ink)', fontFamily: 'Hind Siliguri, sans-serif' }}>
                      <span className="hi-text">{item.hiText}</span>
                      <span className="en-text">{item.enText}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center arrow */}
            <div className="hidden md:flex items-center justify-center my-2" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-amber), var(--color-primary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(196,68,10,0.35), 0 0 0 4px rgba(232,130,10,0.2)',
                color: 'white',
              }}>
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Jaali Divider ── */}
      <JaaliSeparator />

      {/* ════════════════════════════════
          CTA SECTION
          ════════════════════════════════ */}
      <section className="relative py-24" style={{ background: 'var(--color-bg)' }}>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="heritage-card p-12 sm:p-16"
            style={{
              borderColor: 'rgba(232,130,10,0.4)',
              boxShadow: '0 16px 60px rgba(196,68,10,0.12)',
            }}
          >
            {/* Top ornament */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(232,130,10,0.6))' }}/>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2 L17 11 L26 11 L19 17 L22 26 L14 20 L6 26 L9 17 L2 11 L11 11 Z"
                  fill="none" stroke="#E8820A" strokeWidth="1.5"/>
              </svg>
              <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, rgba(232,130,10,0.6), transparent)' }}/>
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '0.75rem',
            }}>
              <span className="hi-text">शासन को बदलने के लिए </span>
              <span className="en-text">Ready to Transform </span>
              <span style={{
                background: 'linear-gradient(135deg, var(--color-amber), var(--color-primary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                <span className="hi-text">तैयार हैं?</span>
                <span className="en-text">Governance?</span>
              </span>
            </h2>
            <p className="subheading mb-10 max-w-lg mx-auto">
              <span className="hi-text">पारदर्शी, AI-संचालित सार्वजनिक प्रशासन की ओर आंदोलन में शामिल हों।</span>
              <span className="en-text">Join the movement towards transparent, AI-powered public administration.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GsapButton
                to="/report"
                id="cta-report-btn"
                className="btn-primary flex items-center gap-2"
                style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}
              >
                <span className="hi-text">शिकायत दर्ज करें</span>
                <span className="en-text">File a Complaint</span>
                <ChevronRight className="w-5 h-5" />
              </GsapButton>
              <GsapButton
                to="/dashboard"
                id="cta-dashboard-btn"
                className="btn-secondary flex items-center gap-2"
                style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}
              >
                <span className="hi-text">डैशबोर्ड देखें</span>
                <span className="en-text">Explore Dashboard</span>
                <BarChart3 className="w-5 h-5" />
              </GsapButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
