import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Shield, ArrowRight, MapPin, Building2, Map } from 'lucide-react';
import { DotGrid } from '../components/AnimatedBackground';
import { useTranslation } from 'react-i18next';

export default function Signup() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    city: '',
    area: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Signup submitted:', formData);
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

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-trust-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-saffron-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-500 to-trust-500 flex items-center justify-center shadow-lg shadow-saffron-500/25 group-hover:shadow-saffron-500/40 transition-shadow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">Jan Vaani</span>
              <span className="text-[10px] text-saffron-400 ml-1.5 font-medium uppercase tracking-wider">{t('signup.tagline')}</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{t('signup.createAccount')}</h1>
          <p className="text-gray-400">{t('signup.joinJV')}</p>
        </div>

        {/* Signup Card */}
        <div className="glass-card p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section: Basic Information */}
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-saffron-400 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
                {t('signup.basicInfo')}
              </h3>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('signup.fullNameLabel')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t('signup.fullNamePlaceholder')}
                  className="w-full pl-12 pr-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Email & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('signup.emailLabel')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('signup.emailPlaceholder')}
                    className="w-full pl-12 pr-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('signup.mobileLabel')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder={t('signup.mobilePlaceholder')}
                    className="w-full pl-12 pr-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('signup.passwordLabel')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('signup.passwordPlaceholder')}
                    className="w-full pl-12 pr-12 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('signup.confirmPasswordLabel')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('signup.confirmPasswordPlaceholder')}
                    className="w-full pl-12 pr-12 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-trust-400 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-trust-500" />
                {t('signup.locationSection')}
                <span className="text-xs text-gray-500 normal-case font-normal">{t('signup.locationNote')}</span>
              </h3>
            </div>

            {/* City & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('signup.cityLabel')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t('signup.cityPlaceholder')}
                    className="w-full pl-12 pr-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('signup.areaLabel')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Map className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder={t('signup.areaPlaceholder')}
                    className="w-full pl-12 pr-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('signup.addressLabel')} <span className="text-gray-500 font-normal">{t('signup.optional')}</span>
              </label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t('signup.addressPlaceholder')}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 focus:ring-2 focus:ring-saffron-500/20 transition-all duration-300 resize-none"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-white/20 bg-navy-800/60 text-saffron-500 focus:ring-saffron-500/50"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                {t('signup.agreeText')}{' '}
                <button type="button" className="text-saffron-400 hover:text-saffron-300 font-medium transition-colors">{t('signup.termsOfService')}</button>
                {' '}{t('signup.and')}{' '}
                <button type="button" className="text-saffron-400 hover:text-saffron-300 font-medium transition-colors">{t('signup.privacyPolicy')}</button>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2 text-base"
            >
              {t('signup.createBtn')} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-6">
            {t('signup.haveAccount')}{' '}
            <Link to="/login" className="text-saffron-400 hover:text-saffron-300 font-semibold transition-colors">
              {t('signup.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
