import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isDashboard 
        ? 'bg-navy-900 border-b border-white/10' 
        : 'bg-navy-900/80 backdrop-blur-xl border-b border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-500 to-trust-500 flex items-center justify-center shadow-lg shadow-saffron-500/25 group-hover:shadow-saffron-500/40 transition-shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Jan Vaani</span>
              <span className="hidden sm:inline text-[10px] text-saffron-400 ml-1.5 font-medium uppercase tracking-wider">AI Governance</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === '/' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>Home</Link>
            <Link to="/report" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === '/report' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>Report Issue</Link>
            <Link to="/dashboard" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === '/dashboard' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>Dashboard</Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/report" className="btn-primary text-sm flex items-center gap-1.5">
              Report Issue <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-900/98 backdrop-blur-xl border-t border-white/10 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">Home</Link>
            <Link to="/report" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">Report Issue</Link>
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">Dashboard</Link>
            <Link to="/report" onClick={() => setIsOpen(false)} className="block btn-primary text-center text-sm mt-3">Report an Issue</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
