import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import StatsCards from '../components/dashboard/StatsCards';
import PriorityInbox from '../components/dashboard/PriorityInbox';
import TrustIndex from '../components/dashboard/TrustIndex';
import ProofOfWork from '../components/dashboard/ProofOfWork';
import { 
  Bell, Search, User, Calendar, Shield, ChevronDown,
  BarChart3, TrendingUp, Activity
} from 'lucide-react';
import { trustIndexData } from '../data/mockData';

function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Leadership War Room</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back, District Collector - Last updated 2 min ago</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search issues..."
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-saffron-500/50 w-64"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">3</span>
        </button>
        
        {/* Profile */}
        <button className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-trust-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-gray-300 hidden sm:block">Admin</span>
          <ChevronDown className="w-3 h-3 text-gray-500 hidden sm:block" />
        </button>
      </div>
    </div>
  );
}

function OverviewView() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid lg:grid-cols-2 gap-6">
        <TrustIndex />
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-saffron-400" />
                Quick Insights
              </h3>
              <p className="text-xs text-gray-500 mt-1">AI-generated summary</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Critical Alert', desc: 'School building structural issue in Ward 7 requires immediate engineering assessment.', type: 'critical' },
              { label: 'Misinformation', desc: 'Fake hospital closure message spreading on WhatsApp. Official rebuttal recommended.', type: 'warning' },
              { label: 'Trending', desc: 'Water supply complaints up 40% in Sector 4 this week. Pipeline aging detected.', type: 'info' },
              { label: 'Positive', desc: 'MG Road pothole repair completed. Citizen satisfaction score: 92%.', type: 'success' },
            ].map((insight, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                insight.type === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                insight.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' :
                insight.type === 'info' ? 'bg-blue-500/5 border-blue-500/20' :
                'bg-trust-500/5 border-trust-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs font-bold ${
                    insight.type === 'critical' ? 'text-red-400' :
                    insight.type === 'warning' ? 'text-amber-400' :
                    insight.type === 'info' ? 'text-blue-400' : 'text-trust-400'
                  }`}>{insight.label}</span>
                </div>
                <p className="text-sm text-gray-300">{insight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PriorityInbox />
    </div>
  );
}

function AnalyticsView() {
  const { trend, trendLabels } = trustIndexData;
  const maxTrend = Math.max(...trend);

  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid lg:grid-cols-2 gap-6">
        <TrustIndex />
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-trust-400" />
                Trust Score Trend
              </h3>
              <p className="text-xs text-gray-500 mt-1">Last 6 months</p>
            </div>
          </div>
          {/* Simple bar chart */}
          <div className="flex items-end gap-3 h-48 px-4">
            {trend.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">{val}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-trust-600 to-trust-400 transition-all duration-1000"
                  style={{ height: `${(val / maxTrend) * 100}%` }}
                />
                <span className="text-[10px] text-gray-500">{trendLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-saffron-400" />
          Issue Category Distribution
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Roads & Infrastructure', count: 342, pct: 27 },
            { label: 'Water & Sanitation', count: 287, pct: 23 },
            { label: 'Electricity & Lighting', count: 198, pct: 16 },
            { label: 'Sanitation & Waste', count: 156, pct: 13 },
            { label: 'Education & Infrastructure', count: 124, pct: 10 },
            { label: 'Healthcare', count: 89, pct: 7 },
            { label: 'Other', count: 51, pct: 4 },
          ].map(cat => (
            <div key={cat.label} className="flex items-center gap-4">
              <span className="text-sm text-gray-300 w-48 flex-shrink-0 truncate">{cat.label}</span>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-trust-500 transition-all duration-1000"
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-16 text-right">{cat.count} ({cat.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'issues': return <PriorityInbox />;
      case 'verified': return <ProofOfWork />;
      case 'analytics': return <AnalyticsView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white pt-16">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[68px]' : 'ml-[240px]'} p-6`}>
        <DashboardHeader />
        {renderContent()}
      </main>
    </div>
  );
}
