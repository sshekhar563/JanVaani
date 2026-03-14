import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-500 to-trust-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Jan Vaani</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              AI-powered governance platform transforming citizen grievances into actionable intelligence. 
              Building trust between leaders and communities through transparency and verified action.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5">
              <li><Link to="/report" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">Report an Issue</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">Leader Dashboard</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">Track My Issue</a></li>
              <li><a href="#" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">API Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">About Jan Vaani</a></li>
              <li><a href="#" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            Copyright 2024 Jan Vaani. Made with <Heart className="inline w-3 h-3 text-red-400" /> for better governance.
          </p>
          <p className="text-gray-500 text-xs">
            Powered by AI - Built for India.
          </p>
        </div>
      </div>
    </footer>
  );
}
