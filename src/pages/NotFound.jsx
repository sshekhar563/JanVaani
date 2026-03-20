import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}
    >
      <div className="text-center max-w-md mx-auto relative z-10">

        {/* 404 in heritage style */}
        <div className="relative mb-10">
          <div style={{
            fontSize: '9rem', fontFamily: "'Playfair Display', serif",
            fontWeight: 900, color: 'rgba(196,68,10,0.06)',
            lineHeight: 1, userSelect: 'none',
          }}>
            <span className="hi-text">४०४</span>
            <span className="en-text">404</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: 'rgba(253,236,200,0.9)',
              border: '2px solid rgba(232,130,10,0.4)',
              boxShadow: '0 0 0 6px rgba(196,68,10,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'diyaGlow 3s ease-in-out infinite',
            }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="10" r="6" fill="none" stroke="#C4440A" strokeWidth="2"/>
                <line x1="20" y1="16" x2="20" y2="30" stroke="#C4440A" strokeWidth="2" strokeLinecap="round"/>
                <line x1="20" y1="22" x2="12" y2="28" stroke="#C4440A" strokeWidth="2" strokeLinecap="round"/>
                <line x1="20" y1="22" x2="28" y2="28" stroke="#C4440A" strokeWidth="2" strokeLinecap="round"/>
                <line x1="20" y1="30" x2="15" y2="39" stroke="#C4440A" strokeWidth="2" strokeLinecap="round"/>
                <line x1="20" y1="30" x2="25" y2="39" stroke="#C4440A" strokeWidth="2" strokeLinecap="round"/>
                <text x="28" y="12" fontFamily="serif" fontSize="12" fill="#E8820A" fontWeight="700">?</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
          style={{
            background: 'rgba(232,130,10,0.1)',
            border: '1px solid rgba(232,130,10,0.3)',
            color: '#E8820A',
            fontFamily: 'Hind Siliguri, sans-serif',
          }}
        >
          <span className="hi-text">पृष्ठ नहीं मिला</span>
          <span className="en-text">Page Not Found</span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.2rem', fontWeight: 700,
          color: 'var(--color-primary)', marginBottom: '1rem',
        }}>
          <span className="hi-text">रास्ता भटक गया!</span>
          <span className="en-text">
            Oops!{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--color-amber), var(--color-primary))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              This path is lost
            </span>
          </span>
        </h1>

        <p style={{
          color: 'var(--color-ink-soft)',
          marginBottom: '2.5rem', lineHeight: 1.7,
          fontFamily: 'Hind Siliguri, sans-serif', fontSize: '0.95rem',
        }}>
          <span className="hi-text">आप जो पृष्ठ ढूंढ रहे हैं वह मौजूद नहीं है। चलिए सही रास्ते पर लौटें।</span>
          <span className="en-text">The page you're looking for may have been moved. Let's get you back on track.</span>
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/"
            id="notfound-home-btn"
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
            style={{ fontSize: '0.95rem', padding: '0.85rem 2rem' }}
          >
            <Home className="w-5 h-5" />
            <span className="hi-text">घर जाएं</span>
            <span className="en-text">Go Home</span>
          </Link>
          <button
            id="notfound-back-btn"
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
            style={{ fontSize: '0.95rem', padding: '0.85rem 2rem' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hi-text">वापस जाएं</span>
            <span className="en-text">Go Back</span>
          </button>
        </div>

        {/* Quick links */}
        <div style={{
          borderTop: '1px solid rgba(232,130,10,0.2)',
          paddingTop: '2rem',
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)', marginBottom: 12, fontFamily: 'Hind Siliguri, sans-serif' }}>
            <span className="hi-text">त्वरित लिंक</span>
            <span className="en-text">Quick links</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { to: '/report', hiLabel: 'शिकायत दर्ज करें', enLabel: 'Report Issue' },
              { to: '/login',  hiLabel: 'लॉगिन', enLabel: 'Login' },
            ].map(({ to, hiLabel, enLabel }) => (
              <Link
                key={to}
                to={to}
                style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)', fontFamily: 'Hind Siliguri, sans-serif', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#E8820A'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ink-soft)'}
              >
                <span className="hi-text">{hiLabel}</span>
                <span className="en-text">{enLabel}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
