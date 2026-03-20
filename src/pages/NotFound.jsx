import { Link } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-navy-900 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[150px] font-black text-white/[0.03] leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saffron-500/20 to-trust-500/20 border border-saffron-500/30 flex items-center justify-center animate-pulse-slow">
              <Search className="w-10 h-10 text-saffron-400" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-xs font-medium text-saffron-400 mb-6">
          <AlertTriangle className="w-3 h-3" />
          Page Not Found
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Oops! This page <span className="text-saffron-400">doesn't exist</span>
        </h1>

        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you're looking for may have been moved, deleted, or never existed. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline text-base px-8 py-3.5 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500 mb-4">Quick links</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/report" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">
              Report Issue
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/dashboard" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">
              Dashboard
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/login" className="text-sm text-gray-400 hover:text-saffron-400 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
