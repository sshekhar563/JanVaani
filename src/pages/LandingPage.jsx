import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Zap, Shield, Eye, BarChart3, Brain, CheckCircle2,
  AlertTriangle, Clock, Users, TrendingUp, Mic, Camera,
  Star, ArrowUpRight, Volume2, ChevronDown, Sparkles
} from 'lucide-react';
import Footer from '../components/Footer';

/* ═══════════════════════════════════════════
   Helper Components
   ═══════════════════════════════════════════ */

function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
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
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

function SectionHeader({ badge, badgeIcon: BadgeIcon, hiTitle, enTitle, hiSub, enSub, light = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center mb-16"
    >
      {badge && (
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-semibold mb-5"
          style={{
            background: light ? 'rgba(245,184,48,0.1)' : 'rgba(232,130,10,0.1)',
            border: `1px solid ${light ? 'rgba(245,184,48,0.3)' : 'rgba(232,130,10,0.3)'}`,
            color: light ? '#F5B830' : '#E8820A',
            fontFamily: 'Hind Siliguri, sans-serif',
          }}
        >
          {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
          <span className="hi-text">{badge.hi}</span>
          <span className="en-text">{badge.en}</span>
        </div>
      )}
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: 700,
          color: light ? '#FDECC8' : '#C4440A',
          marginBottom: '1rem',
        }}
      >
        <span className="hi-text">{hiTitle}</span>
        <span className="en-text">{enTitle}</span>
      </h2>
      {(hiSub || enSub) && (
        <p style={{
          fontFamily: 'Hind Siliguri, sans-serif',
          fontSize: '1rem',
          color: light ? 'rgba(253,236,200,0.7)' : '#3D2A18',
          lineHeight: 1.7,
          maxWidth: '36rem',
          margin: '0 auto',
        }}>
          <span className="hi-text">{hiSub}</span>
          <span className="en-text">{enSub}</span>
        </p>
      )}
    </motion.div>
  );
}

function AnimatedCard({ children, delay = 0, className = '', style = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(196,68,10,0.18)' }}
      className={`rounded-lg transition-all duration-300 ${className}`}
      style={{
        background: '#FDECC8',
        border: '1.5px solid rgba(232,130,10,0.25)',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}


/* ═══════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowFloatingCta(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: 85, suffix: '%',  hiLabel: 'तेज़ समाधान', enLabel: 'Faster Resolution', icon: Zap,   color: '#E8820A' },
    { value: 3,  suffix: '.2x', hiLabel: 'नागरिक जुड़ाव', enLabel: 'Citizen Engagement', icon: Users, color: '#F5B830' },
    { value: 24, suffix: '/7', hiLabel: 'AI निगरानी', enLabel: 'AI Monitoring',       icon: Eye,   color: '#1A7A8A' },
  ];

  const features = [
    {
      hiTitle: 'बहुभाषी इनपुट', enTitle: 'Multilingual Intake',
      hiDesc: 'आवाज़, पाठ या छवि से शिकायत दर्ज करें', enDesc: 'Submit via voice, text, or image in your language',
      icon: Mic, step: '01', color: '#C4440A',
    },
    {
      hiTitle: 'AI प्राथमिकता', enTitle: 'AI Prioritization',
      hiDesc: 'स्वचालित तात्कालिकता और प्रभाव स्कोरिंग', enDesc: 'Automated urgency and impact scoring',
      icon: Brain, step: '02', color: '#E8820A',
    },
    {
      hiTitle: 'पारदर्शी समाधान', enTitle: 'Transparent Resolution',
      hiDesc: 'कार्य-प्रमाण सत्यापन से विश्वास बढ़ाएं', enDesc: 'Visual proof-of-work builds public trust',
      icon: Shield, step: '03', color: '#1A7A8A',
    },
  ];

  const beforeItems = [
    { icon: Clock,         hiText: 'समस्या समाधान में हफ्तों की देरी', enText: 'Weeks-long delays in resolution' },
    { icon: AlertTriangle, hiText: 'कोई प्राथमिकता प्रणाली नहीं', enText: 'No prioritization system' },
    { icon: Eye,           hiText: 'कार्रवाई पर शून्य पारदर्शिता', enText: 'Zero transparency on actions' },
    { icon: Users,         hiText: 'नागरिकों में निराशा और अविश्वास', enText: 'Citizen frustration and distrust' },
    { icon: BarChart3,     hiText: 'गलत सूचना अनियंत्रित', enText: 'Misinformation goes unchecked' },
  ];

  const afterItems = [
    { icon: Zap,          hiText: 'AI-संचालित समाधान घंटों में', enText: 'AI-driven resolution in hours' },
    { icon: Brain,        hiText: 'स्मार्ट प्राथमिकता स्कोरिंग', enText: 'Smart priority scoring system' },
    { icon: Shield,       hiText: 'रीयल-टाइम सत्यापित प्रमाण', enText: 'Real-time verified proof' },
    { icon: Star,         hiText: 'पब्लिक ट्रस्ट इंडेक्स', enText: 'Public Trust Index' },
    { icon: CheckCircle2, hiText: 'AI गलत सूचना चिह्नित करता है', enText: 'AI flags misinformation' },
  ];

  const aiFeatures = [
    { hiTitle: 'ML प्राथमिकता', enTitle: 'ML Prioritization', hiDesc: 'प्रशिक्षित मॉडल से स्वत: रैंकिंग', enDesc: 'Auto-ranked by urgency using trained models', icon: Brain },
    { hiTitle: 'बहुभाषी सेवन', enTitle: 'Multilingual Intake', hiDesc: 'हिंदी, अंग्रेजी, तमिल, बंगाली समर्थित', enDesc: 'Hindi, English, Tamil, Bengali supported', icon: Volume2 },
    { hiTitle: 'दृश्य कार्य-प्रमाण', enTitle: 'Visual Proof-of-Work', hiDesc: 'फोटो/वीडियो जियो-टैग और सत्यापित', enDesc: 'Photo/video geotagged and verified', icon: Camera },
  ];

  const pipelineSteps = [
    { hi: 'आवाज़/टेक्स्ट', en: 'Voice/Text' },
    { hi: 'AI प्रोसेसिंग', en: 'AI Processing' },
    { hi: 'प्राथमिकता', en: 'Priority Score' },
    { hi: 'विभाग रूटिंग', en: 'Dept Routing' },
    { hi: 'समाधान', en: 'Resolution' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FDECC8', color: '#1A1208' }}>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative min-h-screen flex items-center pt-16" style={{ background: '#1A1208', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,68,10,0.12) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,122,138,0.1) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,184,48,0.06) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(253,236,200,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center" style={{ zIndex: 10 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold mb-8"
            style={{
              background: 'rgba(232,130,10,0.15)',
              border: '1px solid rgba(232,130,10,0.3)',
              color: '#F5B830',
              fontFamily: 'Hind Siliguri, sans-serif',
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
            <span className="hi-text">AI-संचालित शासन मंच</span>
            <span className="en-text">AI-Powered Governance Platform</span>
            <ArrowUpRight className="w-3 h-3" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              color: '#FDECC8',
              marginBottom: '1rem',
              fontFamily: "'Playfair Display', serif",
              letterSpacing: '-0.02em',
            }}
          >
            <span className="hi-text">
              <span style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>जनवाणी</span>
            </span>
            <span className="en-text">JanVaani</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl font-medium mb-3"
            style={{ color: '#F5B830', fontFamily: "'Noto Serif Devanagari', serif" }}
          >
            <span className="hi-text">अव्यवस्था से स्पष्टता तक</span>
            <span className="en-text" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>From Chaos to Clarity</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg max-w-2xl mx-auto mb-10"
            style={{ color: 'rgba(253,236,200,0.6)', lineHeight: 1.7, fontFamily: 'Hind Siliguri, sans-serif' }}
          >
            <span className="hi-text">बिखरी हुई नागरिक शिकायतों को AI द्वारा संरचित, कार्रवाई योग्य जानकारी में बदलें।</span>
            <span className="en-text">Transform scattered citizen grievances into structured, actionable intelligence powered by AI.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/report"
                id="hero-report-btn"
                className="btn-primary flex items-center gap-2 justify-center text-base px-8 py-4"
              >
                <Mic className="w-5 h-5" />
                <span className="hi-text">शिकायत दर्ज करें</span>
                <span className="en-text">File a Complaint</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/admin/login"
                id="hero-admin-btn"
                className="btn-admin flex items-center gap-2 justify-center text-base px-8 py-4"
              >
                <Shield className="w-5 h-5" />
                <span className="hi-text">प्रशासन लॉगिन</span>
                <span className="en-text">Admin Login</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 rounded-lg"
                style={{
                  background: 'rgba(253,236,200,0.05)',
                  border: '1px solid rgba(253,236,200,0.12)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 6,
                  background: `${stat.color}20`,
                  border: `1.5px solid ${stat.color}50`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color,
                }}>
                  <stat.icon style={{ width: 18, height: 18 }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: stat.color, lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(253,236,200,0.5)', fontWeight: 500, fontFamily: 'Hind Siliguri, sans-serif' }}>
                    <span className="hi-text">{stat.hiLabel}</span>
                    <span className="en-text">{stat.enLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ zIndex: 10 }}
        >
          <ChevronDown className="w-6 h-6" style={{ color: 'rgba(253,236,200,0.3)' }} />
        </motion.div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="section-padding" style={{ background: '#FDECC8' }}>
        <div className="container-main">
          <SectionHeader
            badge={{ hi: 'जनवाणी कैसे काम करता है', en: 'How JanVaani Works' }}
            badgeIcon={Sparkles}
            hiTitle="तीन सरल चरण"
            enTitle="Three Simple Steps"
            hiSub="AI द्वारा संचालित — शिकायत से समाधान तक"
            enSub="A seamless pipeline from complaint to resolution, powered by AI"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimatedCard key={i} delay={i * 0.1} className="p-7">
                <p className="text-xs font-bold tracking-widest mb-4" style={{ color: '#3D2A18', opacity: 0.5, fontFamily: 'Hind Siliguri, sans-serif' }}>
                  <span className="hi-text">चरण {feature.step}</span>
                  <span className="en-text">STEP {feature.step}</span>
                </p>
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center mb-5"
                  style={{
                    background: `${feature.color}15`,
                    border: `1.5px solid ${feature.color}40`,
                    color: feature.color,
                  }}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1208', fontFamily: "'Playfair Display', serif" }}>
                  <span className="hi-text">{feature.hiTitle}</span>
                  <span className="en-text">{feature.enTitle}</span>
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#3D2A18', fontFamily: 'Hind Siliguri, sans-serif' }}>
                  <span className="hi-text">{feature.hiDesc}</span>
                  <span className="en-text">{feature.enDesc}</span>
                </p>
                <div className="mt-5 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)`, width: '40%' }} />
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ AI INTELLIGENCE ═══════════ */}
      <section className="section-padding" style={{ background: '#0D4A5C', overflow: 'hidden', position: 'relative' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(253,236,200,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container-main relative" style={{ zIndex: 1 }}>
          <SectionHeader
            light
            badge={{ hi: 'AI-संचालित बुद्धिमत्ता', en: 'AI-Powered Intelligence' }}
            badgeIcon={Brain}
            hiTitle="बुद्धिमान शासन प्रणाली"
            enTitle="Intelligent Governance System"
            hiSub="आवाज़ से समाधान तक — हमारी AI पाइपलाइन शिकायतों को बुद्धिमानी से संसाधित करती है"
            enSub="From voice to resolution — our AI pipeline processes grievances intelligently"
          />

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {aiFeatures.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4, borderColor: 'rgba(232,130,10,0.5)' }}
                className="p-7 rounded-lg transition-all duration-300 cursor-default"
                style={{
                  background: 'rgba(253,236,200,0.05)',
                  border: '1px solid rgba(253,236,200,0.12)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: 'rgba(232,130,10,0.15)', border: '1px solid rgba(232,130,10,0.3)', color: '#F5B830' }}
                >
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: '#FDECC8', fontFamily: "'Playfair Display', serif" }}>
                  <span className="hi-text">{feat.hiTitle}</span>
                  <span className="en-text">{feat.enTitle}</span>
                </h3>
                <p className="text-sm" style={{ color: 'rgba(253,236,200,0.6)', lineHeight: 1.6, fontFamily: 'Hind Siliguri, sans-serif' }}>
                  <span className="hi-text">{feat.hiDesc}</span>
                  <span className="en-text">{feat.enDesc}</span>
                </p>
              </motion.div>
            ))}
          </div>

          {/* Pipeline flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg"
            style={{ background: 'rgba(253,236,200,0.05)', border: '1px solid rgba(253,236,200,0.12)' }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              {pipelineSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="px-4 py-2 rounded-md text-sm font-medium"
                    style={{
                      background: 'rgba(253,236,200,0.08)',
                      border: '1px solid rgba(253,236,200,0.15)',
                      color: '#FDECC8',
                      fontFamily: 'Hind Siliguri, sans-serif',
                    }}
                  >
                    <span className="hi-text">{step.hi}</span>
                    <span className="en-text">{step.en}</span>
                  </span>
                  {i < pipelineSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 hidden sm:block" style={{ color: 'rgba(232,130,10,0.6)' }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ BEFORE VS AFTER ═══════════ */}
      <section className="section-padding" style={{ background: '#FDECC8' }}>
        <div className="container-main">
          <SectionHeader
            badge={{ hi: 'परिवर्तन', en: 'The Transformation' }}
            badgeIcon={TrendingUp}
            hiTitle={<>अव्यवस्था से <span className="gradient-text-heritage">स्पष्टता</span> तक</>}
            enTitle={<>From Chaos to <span className="gradient-text-heritage">Clarity</span></>}
            hiSub="देखें कैसे जनवाणी पारंपरिक शासन को बदलती है"
            enSub="See how JanVaani transforms traditional governance"
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* BEFORE */}
            <AnimatedCard className="p-7 overflow-hidden" style={{ borderColor: 'rgba(212,46,24,0.3)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,46,24,0.1)' }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: '#D42E18' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#D42E18', fontFamily: "'Playfair Display', serif" }}>
                    <span className="hi-text">जनवाणी से पहले</span>
                    <span className="en-text">Before JanVaani</span>
                  </h3>
                  <p className="text-xs" style={{ color: '#3D2A18', opacity: 0.6, fontFamily: 'Hind Siliguri' }}>
                    <span className="hi-text">पारंपरिक शासन</span>
                    <span className="en-text">Traditional Governance</span>
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {beforeItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ background: 'rgba(212,46,24,0.08)', border: '1px solid rgba(212,46,24,0.2)' }}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#D42E18' }} />
                    <span className="text-sm" style={{ color: '#1A1208', fontFamily: 'Hind Siliguri, sans-serif' }}>
                      <span className="hi-text">{item.hiText}</span>
                      <span className="en-text">{item.enText}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>

            {/* AFTER */}
            <AnimatedCard delay={0.2} className="p-7 overflow-hidden" style={{ borderColor: 'rgba(4,120,87,0.3)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: 'rgba(4,120,87,0.1)' }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#047857' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#047857', fontFamily: "'Playfair Display', serif" }}>
                    <span className="hi-text">जनवाणी के साथ</span>
                    <span className="en-text">With JanVaani</span>
                  </h3>
                  <p className="text-xs" style={{ color: '#3D2A18', opacity: 0.6, fontFamily: 'Hind Siliguri' }}>
                    <span className="hi-text">AI-संचालित शासन</span>
                    <span className="en-text">AI-Powered Governance</span>
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {afterItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ background: 'rgba(4,120,87,0.08)', border: '1px solid rgba(4,120,87,0.2)' }}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#047857' }} />
                    <span className="text-sm" style={{ color: '#1A1208', fontFamily: 'Hind Siliguri, sans-serif' }}>
                      <span className="hi-text">{item.hiText}</span>
                      <span className="en-text">{item.enText}</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #C4440A 0%, #a3370a 100%)' }}>
        <div className="container-main text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#FDECC8', fontFamily: "'Playfair Display', serif" }}>
              <span className="hi-text">आज ही अपनी आवाज़ उठाएं</span>
              <span className="en-text">Raise Your Voice Today</span>
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'rgba(253,236,200,0.8)', fontFamily: 'Hind Siliguri, sans-serif' }}>
              <span className="hi-text">जनवाणी के साथ अपनी शिकायत दर्ज करें और AI-संचालित समाधान पाएं।</span>
              <span className="en-text">File your grievance with JanVaani and get AI-powered resolution.</span>
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-md transition-all"
                style={{
                  background: '#FDECC8',
                  color: '#C4440A',
                  fontFamily: 'Hind Siliguri, sans-serif',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                }}
              >
                <span className="hi-text">शिकायत दर्ज करें</span>
                <span className="en-text">File a Complaint</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FLOATING CTA ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showFloatingCta ? 1 : 0, y: showFloatingCta ? 0 : 20 }}
        className="fixed bottom-6 right-6 z-40"
        style={{ pointerEvents: showFloatingCta ? 'auto' : 'none' }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/report"
            className="btn-primary flex items-center gap-2 px-5 py-3 text-sm"
            style={{ boxShadow: '0 8px 30px rgba(196,68,10,0.5)' }}
          >
            <Mic className="w-4 h-4" />
            <span className="hi-text">शिकायत दर्ज करें</span>
            <span className="en-text">File Complaint</span>
          </Link>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}
