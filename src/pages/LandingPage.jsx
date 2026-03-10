import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Zap, Shield, Eye, BarChart3, Brain, CheckCircle2, 
  AlertTriangle, Clock, Users, TrendingUp, MapPin, Mic, Camera,
  ChevronRight, Star, ArrowUpRight
} from 'lucide-react';
import Footer from '../components/Footer';

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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-500/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-500/20 rounded-full blur-[120px] animate-pulse-slow animate-delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-trust-500/5 rounded-full blur-[150px]" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-trust-400 animate-pulse" />
              AI-Powered Governance Platform
              <ArrowUpRight className="w-3 h-3" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
              Smarter Governance{' '}
              <br className="hidden sm:block" />
              Through{' '}
              <span className="gradient-text text-shadow-glow">AI Decision</span>
              <br />
              <span className="gradient-text text-shadow-glow">Intelligence</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200 leading-relaxed">
              Transform scattered citizen grievances into structured, actionable intelligence. 
              Connect leaders with real-time community needs through verified AI insights.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up animate-delay-300">
              <Link to="/report" className="btn-primary text-base px-8 py-4 flex items-center gap-2 w-full sm:w-auto justify-center">
                Report an Issue <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/dashboard" className="btn-outline text-base px-8 py-4 flex items-center gap-2 w-full sm:w-auto justify-center">
                <Shield className="w-5 h-5" /> Leader Login
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slide-up animate-delay-400">
              {[
                { value: 85, suffix: '%', label: 'Faster Resolution', icon: Zap, color: 'saffron' },
                { value: 3.2, suffix: 'x', label: 'Citizen Engagement', icon: Users, color: 'trust' },
                { value: 24, suffix: '/7', label: 'AI Monitoring', icon: Eye, color: 'navy' },
              ].map((stat, i) => (
                <div key={i} className="stat-card flex flex-col items-center py-6">
                  <stat.icon className={`w-6 h-6 mb-3 ${
                    stat.color === 'saffron' ? 'text-saffron-400' : 
                    stat.color === 'trust' ? 'text-trust-400' : 'text-blue-400'
                  }`} />
                  <div className="text-3xl font-bold text-white mb-1">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Before vs After Section */}
      <section className="relative py-24 bg-gradient-to-b from-navy-900 via-navy-900/95 to-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-xs font-medium text-saffron-400 mb-4">
              <TrendingUp className="w-3 h-3" /> The Transformation
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              From Chaos to <span className="text-saffron-400">Clarity</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              See how Jan Vaani transforms traditional governance into a data-driven, transparent system
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* BEFORE */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/30 to-red-500/10 rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative bg-navy-900 border border-red-500/20 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-400">Before Jan Vaani</h3>
                    <p className="text-xs text-gray-500">Traditional Governance</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: Clock, text: 'Weeks-long delays in issue resolution' },
                    { icon: AlertTriangle, text: 'No prioritization — first come, first served' },
                    { icon: Eye, text: 'Zero transparency on action status' },
                    { icon: Users, text: 'Citizen frustration and distrust' },
                    { icon: BarChart3, text: 'Misinformation goes unchecked' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <item.icon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AFTER */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-trust-600/30 to-trust-500/10 rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative bg-navy-900 border border-trust-500/20 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-trust-500/15 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-trust-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-trust-400">With Jan Vaani</h3>
                    <p className="text-xs text-gray-500">AI-Powered Governance</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: Zap, text: 'AI-driven priority resolution in hours' },
                    { icon: Brain, text: 'Smart scoring based on urgency & impact' },
                    { icon: Shield, text: 'Real-time verified proof of completion' },
                    { icon: Star, text: 'Public Trust Index builds confidence' },
                    { icon: CheckCircle2, text: 'AI flags misinformation instantly' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-trust-500/5 border border-trust-500/10">
                      <item.icon className="w-5 h-5 text-trust-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Connecting Arrow */}
          <div className="hidden md:flex items-center justify-center my-2">
            <div className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-saffron-500 to-trust-500 flex items-center justify-center shadow-2xl shadow-saffron-500/25 -mt-[310px]">
              <ArrowRight className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              How It <span className="text-trust-400">Works</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A seamless pipeline from complaint to resolution, powered by AI
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Mic,
                title: 'Multi-Modal Input',
                desc: 'Voice, text, or image — report in any format, in any regional dialect. Our AI understands it all.',
                color: 'saffron',
                step: '01'
              },
              {
                icon: Brain,
                title: 'AI Analysis',
                desc: 'Instant NLP-powered categorization, sentiment analysis, and urgency scoring of every complaint.',
                color: 'blue',
                step: '02'
              },
              {
                icon: BarChart3,
                title: 'Smart Dashboard',
                desc: 'Leaders see prioritized issues with AI recommendations, geo-mapping, and cluster analysis.',
                color: 'trust',
                step: '03'
              },
              {
                icon: Camera,
                title: 'Verified Proof',
                desc: 'Completed actions are verified with geo-tagged photos, timestamps, and transparency reports.',
                color: 'saffron',
                step: '04'
              },
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${
                  feature.color === 'saffron' ? 'bg-saffron-500/30' :
                  feature.color === 'trust' ? 'bg-trust-500/30' : 'bg-blue-500/30'
                }`} />
                <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 h-full card-hover group-hover:border-white/20">
                  <div className="text-xs font-bold text-gray-600 mb-4">{feature.step}</div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.color === 'saffron' ? 'bg-saffron-500/15 text-saffron-400' :
                    feature.color === 'trust' ? 'bg-trust-500/15 text-trust-400' : 'bg-blue-500/15 text-blue-400'
                  }`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-saffron-500/20 via-trust-500/10 to-navy-600/20 rounded-3xl blur-xl" />
            <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-12 sm:p-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Transform <span className="text-saffron-400">Governance</span>?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join the movement towards transparent, AI-powered public administration. 
                Every voice matters. Every action is verified.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/report" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                  Report an Issue <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to="/dashboard" className="btn-secondary text-base px-8 py-4 flex items-center gap-2">
                  Explore Dashboard <BarChart3 className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
