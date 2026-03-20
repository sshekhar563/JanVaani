import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, Briefcase } from 'lucide-react';
import { DotGrid } from '../components/AnimatedBackground';
import { useTranslation } from 'react-i18next';

export default function AdminLogin() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    departmentKey: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In this version, we require the departmentKey to match a specific value (simulated or verified by backend)
      // Here we check it against a known constant for demonstration, or just pass it to backend if needed.
      if (formData.departmentKey !== "JANVAANI_ADMIN_2024") {
        throw new Error("Invalid Department Access Key");
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      login(data.access_token, 'admin');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center shadow-lg shadow-navy-500/25 group-hover:shadow-navy-500/40 transition-shadow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">Jan Vaani</span>
              <span className="text-[10px] text-blue-400 ml-1.5 font-medium uppercase tracking-wider">Administration</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Secure access for government officials and administrators</p>
        </div>

        <div className="glass-card p-8 animate-slide-up border-blue-500/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@gov.in"
                  className="w-full pl-12 pr-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Department Access Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="adminKey"
                  value={formData.adminKey}
                  onChange={handleChange}
                  placeholder="Enter access key"
                  className="w-full pl-12 pr-4 py-3.5 bg-navy-800/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-admin flex items-center justify-center gap-2 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-300"></div>
              <div className="relative flex items-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to Administration <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </div>
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            New administrator?{' '}
            <Link to="/admin/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
