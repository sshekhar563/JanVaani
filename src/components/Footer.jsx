import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart } from 'lucide-react';
import Logo from './Logo';
import { motion } from 'framer-motion';

/**
 * Footer — Clean footer with links, social media, and branding.
 * Original Oil Painting palette: teal-deep background, cream text.
 */
export default function Footer() {
  const platformLinks = [
    { hiLabel: 'समस्या दर्ज करें', enLabel: 'Report an Issue', to: '/report' },
    { hiLabel: 'प्रशासन डैशबोर्ड', enLabel: 'Administration Dashboard', to: '/dashboard' },
    { hiLabel: 'मेरी समस्या ट्रैक करें', enLabel: 'Track My Issue', to: '#' },
    { hiLabel: 'API दस्तावेज़', enLabel: 'API Documentation', to: '#' },
  ];

  const resourceLinks = [
    { hiLabel: 'जनवाणी के बारे में', enLabel: 'About JanVaani', to: '#' },
    { hiLabel: 'गोपनीयता नीति', enLabel: 'Privacy Policy', to: '#' },
    { hiLabel: 'सेवा की शर्तें', enLabel: 'Terms of Service', to: '#' },
    { hiLabel: 'सहायता से संपर्क', enLabel: 'Contact Support', to: '#' },
  ];

  const socials = [
    { Icon: Twitter, label: 'Twitter', id: 'footer-twitter' },
    { Icon: Github, label: 'GitHub', id: 'footer-github' },
    { Icon: Mail, label: 'Email', id: 'footer-email' },
  ];

  return (
    <footer style={{ background: '#0D4A5C', position: 'relative', overflow: 'hidden' }}>
      {/* Top accent line */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #E8820A, #C4440A, #F5B830, #E8820A, transparent)',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group" id="footer-logo">
              <Logo size={42} />
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#FDECC8',
                }}>
                  JanVaani
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: '#F5B830',
                  fontFamily: "'Noto Serif Devanagari', serif",
                  letterSpacing: '0.1em',
                }}>
                  जनवाणी
                </div>
              </div>
            </Link>

            <p className="hi-text" style={{
              color: '#FDECC8',
              fontSize: '0.875rem',
              lineHeight: 1.7,
              maxWidth: '28rem',
              fontFamily: 'Hind Siliguri, sans-serif',
              marginBottom: '1.25rem',
              opacity: 0.8,
            }}>
              AI-संचालित शासन मंच जो नागरिक शिकायतों को कार्रवाई योग्य जानकारी में बदलता है।
            </p>
            <p className="en-text" style={{
              color: '#FDECC8',
              fontSize: '0.875rem',
              lineHeight: 1.7,
              maxWidth: '28rem',
              fontFamily: 'Hind Siliguri, sans-serif',
              marginBottom: '1.25rem',
              opacity: 0.8,
            }}>
              AI-powered governance platform transforming citizen grievances into actionable intelligence.
            </p>

            {/* Tagline */}
            <p style={{
              fontFamily: "'Noto Serif Devanagari', serif",
              fontSize: '0.9rem',
              color: '#F5B830',
              marginBottom: '1.5rem',
              letterSpacing: '0.04em',
            }}>
              <span className="hi-text">"जनता की आवाज़, नेता की दिशा"</span>
              <span className="en-text">"The voice of the people, the direction of the leader"</span>
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socials.map(({ Icon, label, id }) => (
                <motion.a
                  key={id}
                  href="#"
                  id={id}
                  title={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                  style={{
                    background: 'rgba(253,236,200,0.08)',
                    border: '1px solid rgba(253,236,200,0.15)',
                    color: 'rgba(253,236,200,0.6)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(245,184,48,0.2)';
                    e.currentTarget.style.color = '#FDECC8';
                    e.currentTarget.style.borderColor = 'rgba(245,184,48,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(253,236,200,0.08)';
                    e.currentTarget.style.color = 'rgba(253,236,200,0.6)';
                    e.currentTarget.style.borderColor = 'rgba(253,236,200,0.15)';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#FDECC8',
              marginBottom: '1rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              <span className="hi-text">प्लेटफ़ॉर्म</span>
              <span className="en-text">Platform</span>
            </h4>
            <div style={{ width: 32, height: 2, background: '#F5B830', borderRadius: 1, marginBottom: '1rem', opacity: 0.7 }}/>
            <ul className="space-y-2.5">
              {platformLinks.map(({ hiLabel, enLabel, to }, i) => (
                <li key={i}>
                  <Link
                    to={to}
                    style={{
                      color: 'rgba(253,236,200,0.6)',
                      fontSize: '0.875rem',
                      fontFamily: 'Hind Siliguri, sans-serif',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#F5B830'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(253,236,200,0.6)'}
                  >
                    <span className="hi-text">{hiLabel}</span>
                    <span className="en-text">{enLabel}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#FDECC8',
              marginBottom: '1rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              <span className="hi-text">संसाधन</span>
              <span className="en-text">Resources</span>
            </h4>
            <div style={{ width: 32, height: 2, background: '#F5B830', borderRadius: 1, marginBottom: '1rem', opacity: 0.7 }}/>
            <ul className="space-y-2.5">
              {resourceLinks.map(({ hiLabel, enLabel, to }, i) => (
                <li key={i}>
                  <a
                    href={to}
                    style={{
                      color: 'rgba(253,236,200,0.6)',
                      fontSize: '0.875rem',
                      fontFamily: 'Hind Siliguri, sans-serif',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#F5B830'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(253,236,200,0.6)'}
                  >
                    <span className="hi-text">{hiLabel}</span>
                    <span className="en-text">{enLabel}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(253,236,200,0.12)',
          marginTop: '3rem',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
          className="sm:flex-row"
        >
          <p style={{ color: 'rgba(253,236,200,0.5)', fontSize: '0.75rem', fontFamily: 'Hind Siliguri, sans-serif' }}>
            <span className="hi-text">कॉपीराइट 2024 जनवाणी। </span>
            <span className="en-text">Copyright 2024 JanVaani. </span>
            <Heart className="inline w-3 h-3" style={{ color: '#F5B830' }} />{' '}
            <span className="hi-text">बेहतर शासन के लिए।</span>
            <span className="en-text">for better governance.</span>
          </p>
          <p style={{ color: '#F5B830', fontSize: '0.75rem', fontFamily: 'Hind Siliguri, sans-serif' }}>
            <span className="hi-text">AI द्वारा संचालित · भारत के लिए निर्मित</span>
            <span className="en-text">Powered by AI · Built for Bharat</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
