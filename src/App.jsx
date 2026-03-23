import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';
import Dashboard from './pages/Dashboard';
import PublicLogin from './pages/PublicLogin';
import PublicSignup from './pages/PublicSignup';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import NotFound from './pages/NotFound';
import GovernanceDashboard from './pages/GovernanceDashboard';

import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDECC8' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner mx-auto mb-4" />
          <p className="hi-text text-sm" style={{ color: '#3D2A18', fontFamily: 'Hind Siliguri' }}>लोड हो रहा है...</p>
          <p className="en-text text-sm" style={{ color: '#3D2A18', fontFamily: 'Hind Siliguri' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Routes location={location}>
          <Route path="/"             element={<LandingPage />} />
          <Route path="/report"       element={<CitizenPortal />} />
          <Route path="/dashboard"    element={
            <ProtectedRoute allowedRoles={['admin', 'department', 'public']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/login"        element={<PublicLogin />} />
          <Route path="/signup"       element={<PublicSignup />} />
          <Route path="/admin/login"  element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/governance"   element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GovernanceDashboard />
            </ProtectedRoute>
          } />
          <Route path="*"             element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen" style={{ background: '#FDECC8' }}>
      <Navbar />
      <AnimatedRoutes />
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
