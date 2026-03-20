import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import Logo from './Logo';
import gsap from 'gsap';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const { lang, setLang } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP button animations
  const navBtnsRef = useRef([]);
  useEffect(() => {
    navBtnsRef.current.forEach(btn => {
      if (!btn) return;
      const onEnter = () => gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
      const onLeave = () => gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
      btn.addEventListener('mouseenter', onEnter);
      btn.addEventListener('mouseleave', onLeave);
      btn._gsapCleanup = () => {
        btn.removeEventListener('mouseenter', onEnter);
        btn.removeEventListener('mouseleave', onLeave);
      };
    });
    return () => navBtnsRef.current.forEach(btn => btn?._gsapCleanup?.());
  }, []);

  const navLinks = [
    { to: '/',          hiLabel: 'घर',              enLabel: 'Home' },
    { to: '/report',    hiLabel: 'शिकायत दर्ज करें', enLabel: 'File Complaint' },
    { to: '/dashboard', hiLabel: 'डैशबोर्ड',         enLabel: 'Dashboard' },
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
          <Link to="/" className="flex items-center gap-2.5 group" id="nav-logo">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <Logo size={40} />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className="text-lg font-bold tracking-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#FDECC8',
                }}
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
            <div className="lang-toggle lang-toggle-nav">
              <button
                className={lang === 'hi' ? 'active' : ''}
                onClick={() => setLang('hi')}
              >
                हिंदी
              </button>
              <button
                className={lang === 'en' ? 'active' : ''}
                onClick={() => setLang('en')}
              >
                English
              </button>
            </div>

            {isAuthenticated ? (
              <button
                id="logout-btn"
                onClick={logout}
                ref={el => navBtnsRef.current[0] = el}
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
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  id="nav-login-btn"
                  ref={el => navBtnsRef.current[1] = el}
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
                <Link
                  to="/signup"
                  id="nav-signup-btn"
                  ref={el => navBtnsRef.current[2] = el}
                  className="btn-primary btn-gsap text-sm py-2 px-5"
                >
                  <UserPlus className="w-4 h-4 inline mr-1" />
                  <span className="hi-text">साइन अप</span>
                  <span className="en-text">Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#FDECC8' }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden border-t animate-slide-up"
          style={{
            background: '#1A1208',
            borderColor: 'rgba(245,184,48,0.2)',
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
                <button
                  className={lang === 'hi' ? 'active' : ''}
                  onClick={() => setLang('hi')}
                >
                  हिंदी
                </button>
                <button
                  className={lang === 'en' ? 'active' : ''}
                  onClick={() => setLang('en')}
                >
                  English
                </button>
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
        </div>
      )}
    </nav>
  );
}
