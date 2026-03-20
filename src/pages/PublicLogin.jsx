import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

/* Brushstroke background pattern */
function BrushBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pat-login" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M24 2 L46 24 L24 46 L2 24 Z" fill="none" stroke="#C4440A" strokeWidth="0.7" opacity="0.04"/>
            <path d="M24 12 L36 24 L24 36 L12 24 Z" fill="none" stroke="#E8820A" strokeWidth="0.5" opacity="0.035"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pat-login)"/>
      </svg>
      <div style={{
        position: 'absolute', top: '20%', right: '15%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(232,130,10,0.07) 0%, transparent 70%)',
      }}/>
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(196,68,10,0.05) 0%, transparent 70%)',
      }}/>
    </div>
  );
}

function CornerMotif({ flip = false }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
      style={{ transform: flip ? 'rotate(180deg)' : 'none', opacity: 0.5 }}>
      <path d="M2 2 Q16 1 30 2" stroke="#E8820A" strokeWidth="1.5" fill="none"/>
      <path d="M2 2 Q1 16 2 30" stroke="#E8820A" strokeWidth="1.5" fill="none"/>
      <circle cx="5" cy="5" r="2.5" fill="#C4440A" opacity="0.6"/>
    </svg>
  );
}

function AuthLogo({ subtitle }) {
  return (
    <Link to="/" id="auth-logo-link" className="inline-flex items-center gap-3 mb-6 group" style={{ textDecoration: 'none' }}>
      <Logo size={48} />
      <div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>
          JanVaani
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-amber)', fontFamily: 'Hind Siliguri, sans-serif', letterSpacing: '0.08em', marginTop: 2 }}>
          {subtitle}
        </div>
      </div>
    </Link>
  );
}

function ArchivalInput({ label, icon: Icon, rightIcon, onRightIconClick, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-5">
      {label && (
        <label style={{
          display: 'block', fontSize: '0.8rem', fontWeight: 600,
          color: focused ? '#E8820A' : 'rgba(196,68,10,0.7)',
          marginBottom: 6, fontFamily: 'Hind Siliguri, sans-serif',
          transition: 'color 0.2s', letterSpacing: '0.03em',
        }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: focused ? '#E8820A' : 'rgba(196,68,10,0.4)',
            transition: 'color 0.2s', pointerEvents: 'none',
          }}>
            <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          </div>
        )}
        <input
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%',
            paddingLeft: Icon ? 40 : 12,
            paddingRight: rightIcon ? 44 : 12,
            paddingTop: 12, paddingBottom: 12,
            background: 'transparent',
            border: 'none',
            borderBottom: `2.5px solid ${focused ? '#E8820A' : 'rgba(196,68,10,0.25)'}`,
            borderRadius: 0,
            color: 'var(--color-ink)',
            fontFamily: 'Hind Siliguri, sans-serif',
            fontSize: '0.95rem', outline: 'none',
            boxShadow: focused ? '0 4px 0 -1.5px rgba(232,130,10,0.2)' : 'none',
            transition: 'all 0.25s ease',
            backgroundColor: focused ? 'rgba(232,130,10,0.03)' : 'transparent',
          }}
        />
        {rightIcon && (
          <button type="button" onClick={onRightIconClick} style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(196,68,10,0.4)', background: 'none', border: 'none', cursor: 'pointer',
          }}>{rightIcon}</button>
        )}
      </div>
    </div>
  );
}

export default function PublicLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('email');
  const [formData, setFormData] = useState({ email: '', password: '', phone: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleEmailLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      let data;
      const ct = response.headers.get('content-type');
      if (ct && ct.includes('application/json')) data = await response.json();
      else throw new Error('Server is currently unavailable. Please try again later.');
      if (!response.ok) throw new Error(data?.detail || 'Login failed');
      login(data.access_token, 'public');
      navigate('/report');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      if (formData.otp === '123456') { login('mock_otp_token_12345', 'public'); navigate('/report'); }
      else throw new Error('Invalid OTP');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleSendOtp = (e) => { e.preventDefault(); setOtpSent(true); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10"
      style={{ background: 'var(--color-bg)', position: 'relative' }}>
      <BrushBg />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <AuthLogo subtitle="Public Portal — जन पोर्टल" />
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '2rem',
            fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem',
          }}>
            <span className="hi-text">{t('login.welcomeBack')}</span>
            <span className="en-text">Welcome Back</span>
          </h1>
          <p style={{ color: 'var(--color-ink-soft)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.9rem' }}>
            <span className="hi-text">शिकायत दर्ज और ट्रैक करने के लिए लॉगिन करें</span>
            <span className="en-text">Sign in to report and track issues</span>
          </p>
        </div>

        <div className="animate-slide-up" style={{
          background: '#FDECC8',
          border: '1.5px solid rgba(232,130,10,0.3)',
          borderRadius: 12, padding: '2.5rem',
          boxShadow: '0 8px 40px rgba(196,68,10,0.1)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0 }}><CornerMotif/></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0 }}><CornerMotif flip/></div>

          {/* Tabs */}
          <div className="flex mb-7 rounded-lg p-1"
            style={{ background: 'rgba(196,68,10,0.05)', border: '1px solid rgba(196,68,10,0.1)' }}>
            {[
              { id: 'email', label: t('login.emailTab'), icon: Mail },
              { id: 'otp',   label: t('login.otpTab'),   icon: Smartphone },
            ].map(({ id, label, icon: TabIcon }) => (
              <button key={id} id={`tab-${id}`}
                onClick={() => { setActiveTab(id); setOtpSent(false); setError(''); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all duration-300"
                style={{
                  fontFamily: 'Hind Siliguri, sans-serif',
                  background: activeTab === id ? 'linear-gradient(135deg, #C4440A, #a3370a)' : 'transparent',
                  color: activeTab === id ? '#FDECC8' : 'rgba(196,68,10,0.6)',
                  border: 'none', cursor: 'pointer',
                  boxShadow: activeTab === id ? '0 2px 12px rgba(196,68,10,0.25)' : 'none',
                }}>
                <TabIcon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          <form onSubmit={activeTab === 'email' ? handleEmailLogin : (otpSent ? handleOtpLogin : handleSendOtp)}>
            {activeTab === 'email' ? (
              <>
                <ArchivalInput label={t('login.emailLabel')} type="text" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder={t('login.emailPlaceholder')} icon={Mail} required />
                <ArchivalInput label={t('login.passwordLabel')}
                  type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder={t('login.passwordPlaceholder')} icon={Lock}
                  rightIcon={showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  onRightIconClick={() => setShowPassword(!showPassword)} required />
              </>
            ) : (
              <>
                <ArchivalInput label={t('login.mobileLabel')} type="tel" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder={t('login.mobilePlaceholder')} icon={Phone} required />
                {otpSent && (
                  <div className="animate-fade-in">
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600,
                      color: 'rgba(196,68,10,0.7)', marginBottom: 6, fontFamily: 'Hind Siliguri, sans-serif' }}>
                      {t('login.enterOtp')}
                    </label>
                    <input type="text" name="otp" value={formData.otp} onChange={handleChange}
                      placeholder={t('login.otpPlaceholder')} maxLength={6} required
                      style={{
                        width: '100%', padding: '12px',
                        background: 'rgba(253,236,200,0.6)',
                        border: '1.5px solid rgba(232,130,10,0.3)',
                        borderRadius: 8, color: 'var(--color-ink)',
                        textAlign: 'center', fontSize: '1.4rem',
                        letterSpacing: '0.5em', fontFamily: 'Playfair Display, serif',
                        outline: 'none', marginBottom: 20,
                      }} />
                  </div>
                )}
              </>
            )}

            {error && (
              <div style={{
                background: 'rgba(212,46,24,0.08)', border: '1px solid rgba(212,46,24,0.25)',
                borderRadius: 6, padding: '10px 14px', color: '#D42E18',
                fontSize: '0.85rem', fontFamily: 'Hind Siliguri, sans-serif', marginBottom: 16,
              }}>{error}</div>
            )}

            <button id="login-submit-btn" type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              style={{ fontSize: '1rem', padding: '0.9rem', opacity: loading ? 0.6 : 1 }}>
              {loading ? (
                <div className="spinner-heritage" style={{ width: 20, height: 20, borderWidth: 2 }} />
              ) : (
                <>
                  {activeTab === 'email' ? t('login.loginBtn') : otpSent ? t('login.verifyLogin') : t('login.sendOtp')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div style={{ flex: 1, height: 1, background: 'rgba(196,68,10,0.15)' }}/>
            <span style={{ fontSize: '0.8rem', color: 'rgba(196,68,10,0.4)', fontFamily: 'Hind Siliguri, sans-serif' }}>
              {t('login.or')}
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(196,68,10,0.15)' }}/>
          </div>

          {/* Google */}
          <button id="google-login-btn"
            className="w-full flex items-center justify-center gap-3 py-3 px-6 transition-all duration-200 rounded-lg"
            style={{
              background: 'rgba(196,68,10,0.04)', border: '1.5px solid rgba(196,68,10,0.15)',
              color: 'var(--color-ink)', fontFamily: 'Hind Siliguri, sans-serif',
              fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,68,10,0.07)'; e.currentTarget.style.borderColor = 'rgba(232,130,10,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(196,68,10,0.04)'; e.currentTarget.style.borderColor = 'rgba(196,68,10,0.15)'; }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{t('login.continueGoogle')}</span>
          </button>

          <p style={{
            textAlign: 'center', marginTop: '1.5rem',
            fontSize: '0.875rem', color: 'var(--color-ink-soft)', fontFamily: 'Hind Siliguri, sans-serif',
          }}>
            {t('login.noAccount')}{' '}
            <Link to="/signup" id="signup-link" style={{ color: '#E8820A', fontWeight: 600, textDecoration: 'none' }}>
              {t('login.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
