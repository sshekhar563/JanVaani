import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LogIn, UserPlus, Languages, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout, user } = useAuth();

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(next);
  };

  const isHindi = i18n.language === 'hi';

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
              <span className="hidden sm:inline text-[10px] text-saffron-400 ml-1.5 font-medium uppercase tracking-wider">{t('navbar.tagline')}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === '/' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>{t('navbar.home')}</Link>
            <Link to="/report" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === '/report' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>{t('navbar.reportIssue')}</Link>
            <Link to="/dashboard" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === '/dashboard' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>{t('navbar.dashboard')}</Link>
          </div>

          {/* Auth Buttons + Lang Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border border-white/10 hover:border-saffron-500/50 text-gray-300 hover:text-saffron-400 hover:bg-saffron-500/5 transition-all duration-300"
            >
              <Languages className="w-4 h-4" />
              <span>{isHindi ? 'EN' : 'हिं'}</span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 btn-outline border-none text-red-400 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 btn-outline border-none`}
                >
                  <LogIn className="w-4 h-4" />
                  {t('navbar.login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 flex items-center gap-2 btn-primary border-none"
                >
                  <UserPlus className="w-4 h-4" />
                  {t('navbar.signUp')}
                </Link>
              </>
            )}
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
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">{t('navbar.home')}</Link>
            <Link to="/report" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">{t('navbar.reportIssue')}</Link>
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">{t('navbar.dashboard')}</Link>
            <div className="border-t border-white/10 my-3" />
            {/* Language Toggle (mobile) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 w-full px-4 py-3 text-gray-300 hover:text-saffron-400 hover:bg-white/5 rounded-xl transition-all text-sm font-medium"
            >
              <Languages className="w-4 h-4" />
              {isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
            </button>
            {isAuthenticated ? (
              <button onClick={() => { logout(); setIsOpen(false); }} className="flex w-full items-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl transition-all">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <LogIn className="w-4 h-4" /> {t('navbar.login')}
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block btn-primary text-center text-sm mt-2">
                  {t('navbar.signUp')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
