import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navbar — Sticky header with bilingual nav links, language toggle, and auth buttons.
 * Mobile hamburger menu with slide-down animation.
 * Original Oil Painting palette: ink background, cream text, gold/amber accents.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { lang, setLang } = useLang();

  // Detect scroll for navbar background change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navLinks = [
    { to: '/',       hiLabel: 'घर',              enLabel: 'Home' },
    { to: '/report', hiLabel: 'शिकायत दर्ज करें', enLabel: 'File Complaint' },
    { to: '/dashboard', hiLabel: 'डैशबोर्ड',     enLabel: 'Dashboard' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: '#1A1208',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid rgba(245,184,48,0.25)'
          : '1px solid rgba(245,184,48,0.1)',
        boxShadow: scrolled ? '0 4px 24px rgba(26,18,8,0.3)' : 'none',
      }}
      role="navigation"
      aria-label="Main Navigation"
    >
      {/* Top accent line */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #E8820A, #C4440A, #1A7A8A, #E8820A, transparent)',
        opacity: scrolled ? 1 : 0.6,
        transition: 'opacity 0.3s',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" id="nav-logo" aria-label="JanVaani Home">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Logo size={40} />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif", color: '#FDECC8' }}
              >
                JanVaani
              </span>
              <span
                className="text-[9px] font-medium tracking-widest uppercase hidden sm:block"
                style={{ color: '#F5B830', fontFamily: "'Noto Serif Devanagari', serif" }}
              >
                जनवाणी
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  id={`nav-${link.to.replace('/', '') || 'home'}`}
                  className="relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md"
                  style={{
                    color: isActive ? '#F5B830' : '#FDECC8',
                    fontFamily: 'Hind Siliguri, sans-serif',
                    fontWeight: isActive ? 600 : 500,
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="hi-text">{link.hiLabel}</span>
                  <span className="en-text">{link.enLabel}</span>
                  {/* Active underline */}
                  <span
                    className="absolute bottom-0 left-0 h-0.5 transition-all duration-300"
                    style={{
                      width: isActive ? '100%' : '0%',
                      background: '#F5B830',
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Toggle Pill */}
            <div className="lang-toggle lang-toggle-nav" role="group" aria-label="Language Selection">
              <button
                className={lang === 'hi' ? 'active' : ''}
                onClick={() => setLang('hi')}
                aria-pressed={lang === 'hi'}
              >
                हिंदी
              </button>
              <button
                className={lang === 'en' ? 'active' : ''}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
              >
                English
              </button>
            </div>

            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                id="logout-btn"
                onClick={logout}
                className="btn-gsap px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200"
                style={{
                  color: '#FDECC8',
                  border: '1.5px solid rgba(212,46,24,0.5)',
                  background: 'rgba(212,46,24,0.15)',
                }}
              >
                <LogOut className="w-4 h-4 inline mr-1" />
                <span className="hi-text">लॉगआउट</span>
                <span className="en-text">Logout</span>
              </motion.button>
            ) : (
              <>
                <Link
                  to="/login"
                  id="nav-login-btn"
                  className="btn-gsap px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200"
                  style={{
                    color: '#FDECC8',
                    border: '1.5px solid rgba(253,236,200,0.3)',
                    fontFamily: 'Hind Siliguri, sans-serif',
                    background: 'transparent',
                  }}
                >
                  <LogIn className="w-4 h-4 inline mr-1" />
                  <span className="hi-text">लॉगिन</span>
                  <span className="en-text">Login</span>
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    id="nav-signup-btn"
                    className="btn-primary btn-gsap text-sm py-2 px-5"
                  >
                    <UserPlus className="w-4 h-4 inline mr-1" />
                    <span className="hi-text">साइन अप</span>
                    <span className="en-text">Sign Up</span>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#FDECC8' }}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
            style={{
              background: '#1A1208',
              borderTop: '1px solid rgba(245,184,48,0.2)',
            }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: '#FDECC8',
                    fontFamily: 'Hind Siliguri, sans-serif',
                  }}
                >
                  <span className="hi-text">{link.hiLabel}</span>
                  <span className="en-text">{link.enLabel}</span>
                </Link>
              ))}

              <div className="border-t my-3" style={{ borderColor: 'rgba(245,184,48,0.2)' }} />

              {/* Mobile Language Toggle */}
              <div className="px-4 py-2">
                <div className="lang-toggle lang-toggle-nav">
                  <button className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>हिंदी</button>
                  <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
                </div>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-3 rounded-lg text-sm transition-all"
                  style={{ color: '#D42E18' }}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hi-text">लॉगआउट</span>
                  <span className="en-text">Logout</span>
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-all"
                    style={{ color: '#FDECC8', fontFamily: 'Hind Siliguri, sans-serif' }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hi-text">लॉगिन</span>
                    <span className="en-text">Login</span>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}
                    className="btn-primary w-full text-center block text-sm mt-2"
                  >
                    <span className="hi-text">साइन अप</span>
                    <span className="en-text">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
