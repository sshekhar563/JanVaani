import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

function AppContent() {
  const location = useLocation();

  // Show animated background on Home, Login, and Signup pages
  const showAnimatedBg = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-navy-900">
      {showAnimatedBg && <AnimatedBackground />}
      <Navbar />
      <div className="relative" style={{ zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<CitizenPortal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
