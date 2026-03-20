import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, MapPin, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';

function BrushBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pat-signup" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M24 2 L46 24 L24 46 L2 24 Z" fill="none" stroke="#C4440A" strokeWidth="0.7" opacity="0.04"/>
            <path d="M24 12 L36 24 L24 36 L12 24 Z" fill="none" stroke="#E8820A" strokeWidth="0.5" opacity="0.035"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pat-signup)"/>
      </svg>
      <div style={{ position: 'absolute', top: '15%', right: '10%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(232,130,10,0.07) 0%, transparent 70%)' }}/>
    </div>
  );
}

function SectionHeader({ label }) {
  return (
    <div className="flex items-center gap-3 mb-4 pt-2">
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8820A' }}/>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E8820A', fontFamily: 'Hind Siliguri, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(232,130,10,0.2)' }}/>
    </div>
  );
}

function ArchivalInput({ label, icon: Icon, rightIcon, onRightIconClick, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <label style={{
          display: 'block', fontSize: '0.78rem', fontWeight: 600,
          color: focused ? '#E8820A' : 'rgba(196,68,10,0.65)',
          marginBottom: 5, fontFamily: 'Hind Siliguri, sans-serif', transition: 'color 0.2s',
        }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: focused ? '#E8820A' : 'rgba(196,68,10,0.35)', transition: 'color 0.2s', pointerEvents: 'none' }}>
            <Icon style={{ width: 16, height: 16 }} />
          </div>
        )}
        <input {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%', paddingLeft: Icon ? 34 : 10, paddingRight: rightIcon ? 36 : 10,
            paddingTop: 10, paddingBottom: 10, background: 'transparent', border: 'none',
            borderBottom: `2px solid ${focused ? '#E8820A' : 'rgba(196,68,10,0.2)'}`,
            color: 'var(--color-ink)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.9rem',
            outline: 'none', transition: 'all 0.2s ease',
            backgroundColor: focused ? 'rgba(232,130,10,0.03)' : 'transparent',
          }}
        />
        {rightIcon && (
          <button type="button" onClick={onRightIconClick} style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(196,68,10,0.4)', background: 'none', border: 'none', cursor: 'pointer',
          }}>{rightIcon}</button>
        )}
      </div>
    </div>
  );
}

export default function PublicSignup() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', mobile: '', password: '', confirmPassword: '', city: '', area: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match!'); return; }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, full_name: formData.fullName, password: formData.password, role: 'public' }),
      });
      let data;
      const ct = response.headers.get('content-type');
      if (ct && ct.includes('application/json')) data = await response.json();
      else throw new Error('Server is currently unavailable.');
      if (!response.ok) throw new Error(data?.detail || 'Signup failed');
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', 'public');
      window.location.href = '/report';
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10"
      style={{ background: 'var(--color-bg)', position: 'relative' }}>
      <BrushBg />
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" id="signup-logo" className="inline-flex items-center gap-2.5 mb-5 group" style={{ textDecoration: 'none' }}>
            <Logo size={48} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>JanVaani</div>
              <div style={{ fontSize: '0.65rem', color: '#E8820A', fontFamily: 'Hind Siliguri, sans-serif', letterSpacing: '0.06em' }}>Public Portal — जन पोर्टल</div>
            </div>
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.45rem' }}>
            {t('signup.createAccount')}
          </h1>
          <p style={{ color: 'var(--color-ink-soft)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.9rem' }}>
            <span className="hi-text">जनवाणी से जुड़ें और अपनी आवाज़ उठाएं</span>
            <span className="en-text">Join JanVaani and raise your voice</span>
          </p>
        </div>

        <div className="animate-slide-up" style={{
          background: '#FDECC8', border: '1.5px solid rgba(232,130,10,0.3)',
          borderRadius: 12, padding: '2.5rem',
          boxShadow: '0 8px 40px rgba(196,68,10,0.1)', position: 'relative', overflow: 'hidden',
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.45 }}>
            <path d="M2 2 Q16 1 30 2" stroke="#E8820A" strokeWidth="1.5" fill="none"/>
            <path d="M2 2 Q1 16 2 30" stroke="#E8820A" strokeWidth="1.5" fill="none"/>
            <circle cx="5" cy="5" r="2.5" fill="#C4440A" opacity="0.6"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.45, transform: 'rotate(180deg)' }}>
            <path d="M2 2 Q16 1 30 2" stroke="#E8820A" strokeWidth="1.5" fill="none"/>
            <path d="M2 2 Q1 16 2 30" stroke="#E8820A" strokeWidth="1.5" fill="none"/>
            <circle cx="5" cy="5" r="2.5" fill="#C4440A" opacity="0.6"/>
          </svg>

          <form onSubmit={handleSubmit}>
            <SectionHeader label={t('signup.basicInfo')} />
            <div className="grid grid-cols-1 gap-4 mb-4">
              <ArchivalInput label={t('signup.fullNameLabel')} type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t('signup.fullNamePlaceholder')} icon={User} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <ArchivalInput label={t('signup.emailLabel')} type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('signup.emailPlaceholder')} icon={Mail} required />
              <ArchivalInput label={t('signup.mobileLabel')} type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder={t('signup.mobilePlaceholder')} icon={Phone} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
              <ArchivalInput label={t('signup.passwordLabel')} type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder={t('signup.passwordPlaceholder')} icon={Lock}
                rightIcon={showPassword ? <EyeOff style={{ width: 16, height: 16 }}/> : <Eye style={{ width: 16, height: 16 }}/>}
                onRightIconClick={() => setShowPassword(!showPassword)} required />
              <ArchivalInput label={t('signup.confirmPasswordLabel')} type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder={t('signup.confirmPasswordPlaceholder')} icon={Lock}
                rightIcon={showConfirmPassword ? <EyeOff style={{ width: 16, height: 16 }}/> : <Eye style={{ width: 16, height: 16 }}/>}
                onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)} required />
            </div>

            <SectionHeader label={t('signup.locationSection')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
              <ArchivalInput label={t('signup.cityLabel')} type="text" name="city" value={formData.city} onChange={handleChange} placeholder={t('signup.cityPlaceholder')} icon={MapPin} required />
              <ArchivalInput label={t('signup.areaLabel')} type="text" name="area" value={formData.area} onChange={handleChange} placeholder={t('signup.areaPlaceholder')} icon={Building2} required />
            </div>

            {error && (
              <div style={{ margin: '12px 0', background: 'rgba(212,46,24,0.08)', border: '1px solid rgba(212,46,24,0.25)', borderRadius: 6, padding: '10px 14px', color: '#D42E18', fontSize: '0.85rem', fontFamily: 'Hind Siliguri, sans-serif' }}>
                {error}
              </div>
            )}

            <button id="public-signup-btn" type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
              style={{ fontSize: '1rem', padding: '0.9rem', opacity: loading ? 0.6 : 1 }}>
              {loading ? <div className="spinner-heritage" style={{ width: 20, height: 20, borderWidth: 2 }}/> : <>{t('signup.createBtn')} <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-ink-soft)', fontFamily: 'Hind Siliguri, sans-serif' }}>
            {t('signup.haveAccount')}{' '}
            <Link to="/login" id="login-redirect-link" style={{ color: '#E8820A', fontWeight: 600, textDecoration: 'none' }}>{t('signup.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
