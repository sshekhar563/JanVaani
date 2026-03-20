import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

function BrushBgDark() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pat-admin" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M24 2 L46 24 L24 46 L2 24 Z" fill="none" stroke="#1A7A8A" strokeWidth="0.7" opacity="0.07"/>
            <path d="M24 12 L36 24 L24 36 L12 24 Z" fill="none" stroke="#FDECC8" strokeWidth="0.5" opacity="0.04"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pat-admin)"/>
      </svg>
      <div style={{ position: 'absolute', top: '25%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(26,122,138,0.12) 0%, transparent 70%)' }}/>
      <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(232,130,10,0.08) 0%, transparent 70%)' }}/>
    </div>
  );
}

function CornerMotifLight({ flip = false }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
      style={{ transform: flip ? 'rotate(180deg)' : 'none', opacity: 0.35 }}>
      <path d="M2 2 Q16 1 30 2" stroke="#FDECC8" strokeWidth="1.5" fill="none"/>
      <path d="M2 2 Q1 16 2 30" stroke="#FDECC8" strokeWidth="1.5" fill="none"/>
      <circle cx="5" cy="5" r="2.5" fill="#E8820A" opacity="0.7"/>
    </svg>
  );
}

function AdminInput({ label, icon: Icon, rightIcon, onRightIconClick, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-5">
      {label && (
        <label style={{
          display: 'block', fontSize: '0.8rem', fontWeight: 600,
          color: focused ? '#E8820A' : 'rgba(253,236,200,0.6)',
          marginBottom: 6, fontFamily: 'Hind Siliguri, sans-serif',
          transition: 'color 0.2s', letterSpacing: '0.03em',
        }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: focused ? '#E8820A' : 'rgba(253,236,200,0.35)',
            transition: 'color 0.2s', pointerEvents: 'none',
          }}><Icon style={{ width: 18, height: 18 }} /></div>
        )}
        <input {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%', paddingLeft: Icon ? 40 : 12, paddingRight: rightIcon ? 44 : 12,
            paddingTop: 12, paddingBottom: 12, background: 'transparent', border: 'none',
            borderBottom: `2.5px solid ${focused ? '#E8820A' : 'rgba(253,236,200,0.2)'}`,
            color: '#FDECC8', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.95rem',
            outline: 'none',
            boxShadow: focused ? '0 4px 0 -1.5px rgba(232,130,10,0.15)' : 'none',
            transition: 'all 0.25s ease',
            backgroundColor: focused ? 'rgba(253,236,200,0.04)' : 'transparent',
          }}
        />
        {rightIcon && (
          <button type="button" onClick={onRightIconClick} style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(253,236,200,0.4)', background: 'none', border: 'none', cursor: 'pointer',
          }}>{rightIcon}</button>
        )}
      </div>
    </div>
  );
}

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', departmentKey: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      if (formData.departmentKey !== 'JANVAANI_ADMIN_2024') throw new Error('Invalid Department Access Key');
      const response = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Login failed');
      login(data.access_token, 'admin');
      navigate('/dashboard');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10"
      style={{ background: '#0D4A5C', position: 'relative' }}>
      <BrushBgDark />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" id="admin-auth-logo" className="inline-flex items-center gap-3 mb-6 group" style={{ textDecoration: 'none' }}>
            <Logo size={48} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#FDECC8', lineHeight: 1 }}>JanVaani</div>
              <div style={{ fontSize: '0.7rem', color: '#1A7A8A', fontFamily: 'Hind Siliguri, sans-serif', letterSpacing: '0.08em', marginTop: 2 }}>
                <span className="hi-text">प्रशासन पोर्टल</span>
                <span className="en-text">Administration Portal</span>
              </div>
            </div>
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#FDECC8', marginBottom: '0.5rem' }}>
            <span className="hi-text">प्रशासन लॉगिन</span>
            <span className="en-text">Admin Login</span>
          </h1>
          <p style={{ color: 'rgba(253,236,200,0.5)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
            <span className="hi-text">सरकारी अधिकारियों के लिए सुरक्षित पहुंच</span>
            <span className="en-text">Secure access for government officials</span>
          </p>
        </div>

        <div className="animate-slide-up" style={{
          background: 'rgba(13,74,92,0.85)',
          border: '1.5px solid rgba(26,122,138,0.4)',
          borderRadius: 12, padding: '2.5rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0 }}><CornerMotifLight/></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0 }}><CornerMotifLight flip/></div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6"
            style={{ background: 'rgba(26,122,138,0.15)', border: '1px solid rgba(26,122,138,0.3)', display: 'inline-flex' }}>
            <Shield className="w-4 h-4" style={{ color: '#1A7A8A' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(253,236,200,0.7)', fontFamily: 'Hind Siliguri, sans-serif', letterSpacing: '0.05em' }}>
              <span className="hi-text">सुरक्षित प्रशासन पहुंच</span>
              <span className="en-text">Secure Administration Access</span>
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <AdminInput label="Admin Email" type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="admin@gov.in" icon={Mail} required />
            <AdminInput label="Password" type={showPassword ? 'text' : 'password'} name="password"
              value={formData.password} onChange={handleChange} placeholder="••••••••" icon={Lock}
              rightIcon={showPassword ? <EyeOff style={{ width: 18, height: 18 }}/> : <Eye style={{ width: 18, height: 18 }}/>}
              onRightIconClick={() => setShowPassword(!showPassword)} required />
            <AdminInput label="Department Access Key" type="text" name="departmentKey"
              value={formData.departmentKey} onChange={handleChange} placeholder="Enter access key"
              icon={Briefcase} required />

            {error && (
              <div style={{ background: 'rgba(212,46,24,0.12)', border: '1px solid rgba(212,46,24,0.3)',
                borderRadius: 6, padding: '10px 14px', color: '#e07060', fontSize: '0.85rem',
                fontFamily: 'Hind Siliguri, sans-serif', marginBottom: 16 }}>{error}</div>
            )}

            <button id="admin-login-submit" type="submit" disabled={loading}
              className="btn-admin w-full flex items-center justify-center gap-2 mt-4"
              style={{ fontSize: '1rem', padding: '0.9rem', opacity: loading ? 0.6 : 1 }}>
              {loading ? (
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(253,236,200,0.25)', borderTopColor: '#FDECC8', animation: 'spin 0.8s linear infinite' }}/>
              ) : (<>
                <span className="hi-text">प्रशासन में लॉगिन करें</span>
                <span className="en-text">Sign In to Administration</span>
                <ArrowRight className="w-5 h-5" />
              </>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem',
            color: 'rgba(253,236,200,0.4)', fontFamily: 'Hind Siliguri, sans-serif' }}>
            <span className="hi-text">नए प्रशासक? </span>
            <span className="en-text">New administrator? </span>
            <Link to="/admin/signup" id="admin-signup-link" style={{ color: '#1A7A8A', fontWeight: 600, textDecoration: 'none' }}>
              <span className="hi-text">पहुंच का अनुरोध करें</span>
              <span className="en-text">Request Access</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
