import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Shield, ArrowRight, Building2, Briefcase } from 'lucide-react';
import { DotGrid } from '../components/AnimatedBackground';

export default function AdminSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
    designation: '',
    registrationKey: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.fullName,
          password: formData.password,
          registration_key: formData.registrationKey,
          role: 'admin'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', 'admin');
      window.location.href = '/dashboard';
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

      <div className="w-full max-w-lg relative z-10">
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
          <h1 className="text-3xl font-bold text-white mb-2">Request Admin Access</h1>
          <p className="text-gray-400">Register as a government official to manage and resolve citizen issues</p>
        </div>

        <div className="glass-card p-8 animate-slide-up border-blue-500/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-navy-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Official Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-navy-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Public Works"
                    className="w-full pl-12 pr-4 py-3 bg-navy-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Designation</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Chief Engineer"
                    className="w-full pl-12 pr-4 py-3 bg-navy-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Registration Key (provided by admin)</label>
              <input
                type="text"
                name="registrationKey"
                value={formData.registrationKey}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-navy-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Create Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex-none items-center pointer-events-none pt-3">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-navy-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex-none items-center pointer-events-none pt-3">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-navy-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
                    required
                  />
                </div>
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
              className="w-full btn-admin flex items-center justify-center gap-2 text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden h-14"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-300"></div>
              <div className="relative flex items-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Submit Registration Request <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </div>
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an admin account?{' '}
            <Link to="/admin/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
