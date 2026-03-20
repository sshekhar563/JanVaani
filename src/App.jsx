import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
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
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-saffron-500 border-t-transparent animate-spin"></div>
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
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [location.pathname]);

  // Show animated background on Home, Login, and Signup pages
  const showAnimatedBg = ['/', '/login', '/signup', '/admin/login', '/admin/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-navy-900">
      {showAnimatedBg && <AnimatedBackground />}
      <Navbar />
      <div ref={pageRef} className="relative transition-opacity duration-300" style={{ zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<CitizenPortal />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'department']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<PublicLogin />} />
          <Route path="/signup" element={<PublicSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
