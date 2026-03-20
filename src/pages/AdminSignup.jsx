import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Shield, ArrowRight, Building2, Briefcase } from 'lucide-react';
import Logo from '../components/Logo';

function BrushBgDark() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pat-admin-signup" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M24 2 L46 24 L24 46 L2 24 Z" fill="none" stroke="#1A7A8A" strokeWidth="0.7" opacity="0.07"/>
            <path d="M24 12 L36 24 L24 36 L12 24 Z" fill="none" stroke="#FDECC8" strokeWidth="0.5" opacity="0.04"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pat-admin-signup)"/>
      </svg>
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(26,122,138,0.12) 0%, transparent 70%)' }}/>
    </div>
  );
}

function SectionHeader({ label }) {
  return (
    <div className="flex items-center gap-3 mb-4 pt-2">
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#E8820A' }}/>
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(232,130,10,0.85)', fontFamily: 'Hind Siliguri, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(253,236,200,0.12)' }}/>
    </div>
  );
}

function AdminInput({ label, icon: Icon, rightIcon, onRightIconClick, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <label style={{
          display: 'block', fontSize: '0.78rem', fontWeight: 600,
          color: focused ? '#E8820A' : 'rgba(253,236,200,0.55)',
          marginBottom: 5, fontFamily: 'Hind Siliguri, sans-serif', transition: 'color 0.2s',
        }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: focused ? '#E8820A' : 'rgba(253,236,200,0.3)', transition: 'color 0.2s', pointerEvents: 'none' }}>
            <Icon style={{ width: 16, height: 16 }} />
          </div>
        )}
        <input {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          style={{
            width: '100%', paddingLeft: Icon ? 34 : 10, paddingRight: rightIcon ? 36 : 10,
            paddingTop: 10, paddingBottom: 10, background: 'transparent', border: 'none',
            borderBottom: `2px solid ${focused ? '#E8820A' : 'rgba(253,236,200,0.15)'}`,
            color: '#FDECC8', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.9rem',
            outline: 'none', transition: 'all 0.2s ease',
            backgroundColor: focused ? 'rgba(253,236,200,0.03)' : 'transparent',
          }}
        />
        {rightIcon && (
          <button type="button" onClick={onRightIconClick} style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(253,236,200,0.35)', background: 'none', border: 'none', cursor: 'pointer',
          }}>{rightIcon}</button>
        )}
      </div>
    </div>
  );
}

export default function AdminSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', mobile: '', department: '', designation: '', registrationKey: '', password: '', confirmPassword: '' });
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
        body: JSON.stringify({ email: formData.email, full_name: formData.fullName, password: formData.password, registration_key: formData.registrationKey, role: 'admin' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Signup failed');
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', 'admin');
      window.location.href = '/dashboard';
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10"
      style={{ background: '#0D4A5C', position: 'relative' }}>
      <BrushBgDark />
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" id="admin-signup-logo" className="inline-flex items-center gap-2.5 mb-5 group" style={{ textDecoration: 'none' }}>
            <Logo size={48} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#FDECC8', lineHeight: 1 }}>JanVaani</div>
              <div style={{ fontSize: '0.65rem', color: '#1A7A8A', fontFamily: 'Hind Siliguri, sans-serif', letterSpacing: '0.06em', marginTop: 2 }}>
                <span className="hi-text">प्रशासन</span>
                <span className="en-text">Administration</span>
              </div>
            </div>
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#FDECC8', marginBottom: '0.45rem' }}>
            <span className="hi-text">प्रशासन पंजीकरण</span>
            <span className="en-text">Request Admin Access</span>
          </h1>
          <p style={{ color: 'rgba(253,236,200,0.45)', fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.875rem' }}>
            <span className="hi-text">नागरिक समस्याओं के प्रबंधन के लिए पंजीकरण करें</span>
            <span className="en-text">Register as a government official to manage citizen issues</span>
          </p>
        </div>

        <div className="animate-slide-up" style={{
          background: 'rgba(13,74,92,0.85)', border: '1.5px solid rgba(26,122,138,0.4)',
          borderRadius: 12, padding: '2.5rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
          position: 'relative', overflow: 'hidden',
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.3 }}>
            <path d="M2 2 Q16 1 30 2" stroke="#FDECC8" strokeWidth="1.5" fill="none"/>
            <path d="M2 2 Q1 16 2 30" stroke="#FDECC8" strokeWidth="1.5" fill="none"/>
            <circle cx="5" cy="5" r="2.5" fill="#E8820A" opacity="0.7"/>
          </svg>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.3, transform: 'rotate(180deg)' }}>
            <path d="M2 2 Q16 1 30 2" stroke="#FDECC8" strokeWidth="1.5" fill="none"/>
            <path d="M2 2 Q1 16 2 30" stroke="#FDECC8" strokeWidth="1.5" fill="none"/>
            <circle cx="5" cy="5" r="2.5" fill="#E8820A" opacity="0.7"/>
          </svg>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, marginBottom: 20, background: 'rgba(26,122,138,0.15)', border: '1px solid rgba(26,122,138,0.3)' }}>
            <Shield className="w-4 h-4" style={{ color: '#1A7A8A' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(253,236,200,0.7)', fontFamily: 'Hind Siliguri, sans-serif' }}>
              <span className="hi-text">आधिकारिक प्रशासन पंजीकरण</span>
              <span className="en-text">Official Administration Registration</span>
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <SectionHeader label="Personal Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <AdminInput label="Full Name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" icon={User} required />
              <AdminInput label="Official Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@gov.in" icon={Mail} required />
            </div>
            <div className="grid grid-cols-1 mb-4">
              <AdminInput label="Mobile Number" type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91 XXXXX XXXXX" icon={Phone} required />
            </div>

            <SectionHeader label="Department Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <AdminInput label="Department" type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Public Works" icon={Building2} required />
              <AdminInput label="Designation" type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Chief Engineer" icon={Briefcase} required />
            </div>
            <div className="mb-4">
              <AdminInput label="Registration Key" type="text" name="registrationKey" value={formData.registrationKey} onChange={handleChange} placeholder="Enter registration key" icon={Shield} required />
            </div>

            <SectionHeader label="Security" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
              <AdminInput label="Create Password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" icon={Lock}
                rightIcon={showPassword ? <EyeOff style={{ width: 16, height: 16 }}/> : <Eye style={{ width: 16, height: 16 }}/>}
                onRightIconClick={() => setShowPassword(!showPassword)} required />
              <AdminInput label="Confirm Password" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" icon={Lock} required />
            </div>

            {error && (
              <div style={{ margin: '12px 0', background: 'rgba(212,46,24,0.12)', border: '1px solid rgba(212,46,24,0.3)', borderRadius: 6, padding: '10px 14px', color: '#e07060', fontSize: '0.85rem', fontFamily: 'Hind Siliguri, sans-serif' }}>{error}</div>
            )}

            <button id="admin-register-btn" type="submit" disabled={loading}
              className="btn-admin w-full flex items-center justify-center gap-2 mt-6"
              style={{ fontSize: '1rem', padding: '0.9rem', opacity: loading ? 0.6 : 1 }}>
              {loading ? (
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(253,236,200,0.25)', borderTopColor: '#FDECC8', animation: 'spin 0.8s linear infinite' }}/>
              ) : (<>
                <span className="hi-text">पंजीकरण अनुरोध भेजें</span>
                <span className="en-text">Submit Registration Request</span>
                <ArrowRight className="w-5 h-5" />
              </>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'rgba(253,236,200,0.4)', fontFamily: 'Hind Siliguri, sans-serif' }}>
            <span className="hi-text">पहले से खाता है? </span>
            <span className="en-text">Already have an admin account? </span>
            <Link to="/admin/login" id="admin-login-link" style={{ color: '#1A7A8A', fontWeight: 600, textDecoration: 'none' }}>
              <span className="hi-text">लॉगिन</span>
              <span className="en-text">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
