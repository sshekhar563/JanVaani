import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';
import Dashboard from './pages/Dashboard';
import PublicLogin from './pages/PublicLogin';
import PublicSignup from './pages/PublicSignup';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import NotFound from './pages/NotFound';

import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="mx-auto mb-4 animate-spin-slow">
            <circle cx="28" cy="28" r="24" stroke="rgba(232,130,10,0.2)" strokeWidth="3"/>
            <path d="M28 4 A24 24 0 0 1 52 28" stroke="var(--color-amber)" strokeWidth="3" strokeLinecap="round"/>
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="28" y1="28"
                x2={28 + 14 * Math.cos((i * Math.PI) / 4)}
                y2={28 + 14 * Math.sin((i * Math.PI) / 4)}
                stroke="rgba(196,68,10,0.25)" strokeWidth="1"
              />
            ))}
            <circle cx="28" cy="28" r="3" fill="var(--color-primary)"/>
          </svg>
          <p className="hi-text" style={{ fontFamily: "'Noto Serif Devanagari', serif", color: 'var(--color-amber)', fontSize: '0.85rem' }}>
            लोड हो रहा है...
          </p>
          <p className="en-text" style={{ fontFamily: "'Hind Siliguri', sans-serif", color: 'var(--color-amber)', fontSize: '0.85rem' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(pageRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Navbar />
      <div ref={pageRef} style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/"             element={<LandingPage />} />
          <Route path="/report"       element={<CitizenPortal />} />
          <Route path="/dashboard"    element={
            <ProtectedRoute allowedRoles={['admin', 'department']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/login"        element={<PublicLogin />} />
          <Route path="/signup"       element={<PublicSignup />} />
          <Route path="/admin/login"  element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="*"             element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
