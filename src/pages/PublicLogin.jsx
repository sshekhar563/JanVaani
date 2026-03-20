import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, Shield, ArrowRight, Smartphone, User } from 'lucide-react';
import { DotGrid } from '../components/AnimatedBackground';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function PublicLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('email'); // Renamed from activeTab
  const [formData, setFormData] = useState({
    email: '', // Changed from emailOrPhone
    password: '',
    phone: '', // Added phone field
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleEmailLogin = async (e) => { // Renamed from handleSubmit
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email, // Changed from formData.emailOrPhone
          password: formData.password,
        }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Server is currently unavailable. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(data?.detail || 'Login failed');
      }

      login(data.access_token, 'public'); // Call useAuth's login
      navigate('/report'); // Redirect using navigate
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e) => { // New function for OTP login
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app, this would verify the OTP with the backend
      // For now, simulate success
      if (formData.otp === '123456') { // Example OTP
        // Assuming a successful OTP verification would return a token
        const mockToken = 'mock_otp_token_12345';
        login(mockToken, 'public');
        navigate('/report');
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setOtpSent(true);
    // In a real app, this would call a backend OTP service
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 pt-20 pb-10">
      <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <DotGrid
          dotSize={2}
          gap={12}
          baseColor="#879a7e"
          activeColor="#ff7e29"
          proximity={120}
          shockRadius={250}
          shockStrength={3}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-500 to-trust-500 flex items-center justify-center shadow-lg shadow-saffron-500/25 group-hover:shadow-saffron-500/40 transition-shadow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">Jan Vaani</span>
              <span className="text-[10px] text-saffron-400 ml-1.5 font-medium uppercase tracking-wider">Public Portal</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{t('login.welcomeBack')}</h1>
          <p className="text-gray-400">Sign in to report and track issues</p>
        </div>

        <div className="glass-card p-8 animate-slide-up">
          <div className="flex bg-navy-800/60 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'email'
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              {t('login.emailTab')}
            </button>
            <button
              onClick={() => { setActiveTab('otp'); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'otp'
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-lg shadow-saffron-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              {t('login.otpTab')}
            </button>
          </div>

          <form onSubmit={activeTab === 'email' ? handleEmailLogin : (otpSent ? handleOtpLogin : handleSendOtp)} className="space-y-5">
            {activeTab === 'email' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('login.emailLabel')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                    name="email"
                    value={formData.email}
                      onChange={handleChange}
                      placeholder={t('login.emailPlaceholder')}
                      className="w-full pl-12 pr-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('login.passwordLabel')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t('login.passwordPlaceholder')}
                      className="w-full pl-12 pr-12 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('login.mobileLabel')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                      type="tel"
                    name="phone"
                    value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('login.mobilePlaceholder')}
                      className="w-full pl-12 pr-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('login.enterOtp')}</label>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder={t('login.otpPlaceholder')}
                      maxLength={6}
                      className="w-full px-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white text-center text-lg tracking-[0.5em] placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {activeTab === 'email' ? t('login.loginBtn') : (otpSent ? t('login.verifyLogin') : t('login.sendOtp'))} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-gray-500 font-medium">{t('login.or')}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all duration-300 group">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>{t('login.continueGoogle')}</span>
          </button>

          <p className="text-center text-gray-400 mt-6">
            {t('login.noAccount')}{' '}
            <Link to="/signup" className="text-saffron-400 hover:text-saffron-300 font-semibold transition-colors">
              {t('login.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
